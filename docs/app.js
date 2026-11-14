import {
  APPLEFLOW_META,
  COMBINED_RULESET_CARD,
  STANDALONE_RULESETS,
  auditConfig,
  generateClientConfig,
  getStandaloneRulesetUrl,
  renderStandaloneRulesetContent,
  scrubConfigSecrets,
} from "./auditor.js?v=1.0.4";

const state = {
  lang: "zh",
  client: "surge",
  rsFormat: "surge",
  rsInspectingId: null,
  autoScrub: true,
  lastScrubCount: 0,
  showFullIp: false,
  regionResults: null,
  probeResults: null,
};

const COUNTRY_NAMES = {
  CN: { flag: "🇨🇳", zh: "中国大陆", en: "Mainland China" },
  HK: { flag: "🇭🇰", zh: "中国香港", en: "Hong Kong" },
  TW: { flag: "🇹🇼", zh: "中国台湾", en: "Taiwan" },
  MO: { flag: "🇲🇴", zh: "中国澳门", en: "Macau" },
  US: { flag: "🇺🇸", zh: "美国", en: "United States" },
  JP: { flag: "🇯🇵", zh: "日本", en: "Japan" },
  SG: { flag: "🇸🇬", zh: "新加坡", en: "Singapore" },
  KR: { flag: "🇰🇷", zh: "韩国", en: "South Korea" },
  GB: { flag: "🇬🇧", zh: "英国", en: "United Kingdom" },
  DE: { flag: "🇩🇪", zh: "德国", en: "Germany" },
  FR: { flag: "🇫🇷", zh: "法国", en: "France" },
  NL: { flag: "🇳🇱", zh: "荷兰", en: "Netherlands" },
  CA: { flag: "🇨🇦", zh: "加拿大", en: "Canada" },
  AU: { flag: "🇦🇺", zh: "澳大利亚", en: "Australia" },
  IN: { flag: "🇮🇳", zh: "印度", en: "India" },
  MY: { flag: "🇲🇾", zh: "马来西亚", en: "Malaysia" },
  TH: { flag: "🇹🇭", zh: "泰国", en: "Thailand" },
  RU: { flag: "🇷🇺", zh: "俄罗斯", en: "Russia" },
};

const COLO_CITIES = {
  LAX: { zh: "洛杉矶", en: "Los Angeles" },
  SJC: { zh: "圣何塞", en: "San Jose" },
  SFO: { zh: "旧金山", en: "San Francisco" },
  SEA: { zh: "西雅图", en: "Seattle" },
  PDX: { zh: "波特兰", en: "Portland" },
  DEN: { zh: "丹佛", en: "Denver" },
  DFW: { zh: "达拉斯", en: "Dallas" },
  IAH: { zh: "休斯顿", en: "Houston" },
  ORD: { zh: "芝加哥", en: "Chicago" },
  IAD: { zh: "弗吉尼亚/阿什本", en: "Ashburn" },
  EWR: { zh: "纽瓦克/纽约", en: "Newark" },
  JFK: { zh: "纽约", en: "New York" },
  ATL: { zh: "亚特兰大", en: "Atlanta" },
  MIA: { zh: "迈阿密", en: "Miami" },
  PHX: { zh: "凤凰城", en: "Phoenix" },
  SLC: { zh: "盐湖城", en: "Salt Lake City" },
  BOS: { zh: "波士顿", en: "Boston" },
  HKG: { zh: "香港", en: "Hong Kong" },
  TPE: { zh: "台北", en: "Taipei" },
  KHH: { zh: "高雄", en: "Kaohsiung" },
  NRT: { zh: "东京成田", en: "Tokyo" },
  HND: { zh: "东京羽田", en: "Tokyo" },
  KIX: { zh: "大阪", en: "Osaka" },
  FUK: { zh: "福冈", en: "Fukuoka" },
  ICN: { zh: "首尔", en: "Seoul" },
  SIN: { zh: "新加坡", en: "Singapore" },
  LHR: { zh: "伦敦", en: "London" },
  FRA: { zh: "法兰克福", en: "Frankfurt" },
  AMS: { zh: "阿姆斯特丹", en: "Amsterdam" },
  CDG: { zh: "巴黎", en: "Paris" },
  YYZ: { zh: "多伦多", en: "Toronto" },
  YVR: { zh: "温哥华", en: "Vancouver" },
  SYD: { zh: "悉尼", en: "Sydney" },
  SHA: { zh: "上海", en: "Shanghai" },
  PVG: { zh: "上海", en: "Shanghai" },
  PEK: { zh: "北京", en: "Beijing" },
  PKX: { zh: "北京", en: "Beijing" },
  TSN: { zh: "天津", en: "Tianjin" },
  TNA: { zh: "济南", en: "Jinan" },
  TAO: { zh: "青岛", en: "Qingdao" },
  CAN: { zh: "广州", en: "Guangzhou" },
  SZX: { zh: "深圳", en: "Shenzhen" },
  FSZ: { zh: "佛山", en: "Foshan" },
  DGX: { zh: "东莞", en: "Dongguan" },
  FOC: { zh: "福州", en: "Fuzhou" },
  XMN: { zh: "厦门", en: "Xiamen" },
  HGH: { zh: "杭州", en: "Hangzhou" },
  NGB: { zh: "宁波", en: "Ningbo" },
  NKG: { zh: "南京", en: "Nanjing" },
  WUX: { zh: "无锡", en: "Wuxi" },
  CTU: { zh: "成都", en: "Chengdu" },
  TFU: { zh: "成都", en: "Chengdu" },
  CKG: { zh: "重庆", en: "Chongqing" },
  WUH: { zh: "武汉", en: "Wuhan" },
  CSX: { zh: "长沙", en: "Changsha" },
  CGO: { zh: "郑州", en: "Zhengzhou" },
  XIY: { zh: "西安", en: "Xi'an" },
  SHE: { zh: "沈阳", en: "Shenyang" },
  KMG: { zh: "昆明", en: "Kunming" },
};

function codeToFlag(cc) {
  if (!cc || cc.length !== 2) return "";
  if (COUNTRY_NAMES[cc]) return COUNTRY_NAMES[cc].flag;
  const base = 0x1f1e6;
  return String.fromCodePoint(
    base + (cc.toUpperCase().charCodeAt(0) - 65),
    base + (cc.toUpperCase().charCodeAt(1) - 65)
  );
}

function formatRegionLabel(loc, colo, lang = "zh") {
  if (!loc) return lang === "en" ? "Unknown Region" : "未知区域";
  const upperLoc = loc.toUpperCase();
  const upperColo = (colo || "").toUpperCase();
  const flag = codeToFlag(upperLoc);
  const country = COUNTRY_NAMES[upperLoc]
    ? COUNTRY_NAMES[upperLoc][lang === "en" ? "en" : "zh"]
    : upperLoc;
  const cityObj = COLO_CITIES[upperColo];
  if (cityObj) {
    const city = cityObj[lang === "en" ? "en" : "zh"];
    return `${flag} ${country} · ${city} (${upperColo})`.trim();
  }
  return (upperColo ? `${flag} ${country} (${upperColo})` : `${flag} ${country}`).trim();
}

function maskIp(ip, showFull) {
  if (!ip) return "—";
  if (showFull) return ip;
  if (ip.includes(":")) {
    const parts = ip.split(":");
    return `${parts.slice(0, 2).join(":")}:*:*`;
  }
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.*.*`;
  }
  return ip;
}

const I18N = {
  zh: {
    heroBadge: "零 MitM · 零证书报错 · iOS / macOS 26–27 实机验证",
    heroTitle: "Apple 智能时代的极简分流与排雷工具",
    heroSub: "无需 HTTPS 解密与重写脚本。一套轻量分流同时保障「中文普通话 Siri 不报错 + 普通话来电筛选保留 + Apple Intelligence PCC 与相册高质量消除 + ChatGPT 视觉智能」。",
    law1Title: "01 · 中文 Siri 真实 IP 直连",
    law1Desc: "guzzoni 与 *.siri.apple.com 走代理或 Fake-IP 必报错，必须 DIRECT + always-real-ip。",
    law2Title: "02 · PCC 与高质量消除置顶美区",
    law2Desc: "issuer / ropes / mask / app.apple.com 与 apple-relay.* 置于 Apple_All 之前，节点开启 UDP 443。",
    law3Title: "03 · 免定位 / Siri MitM 解密",
    law3Desc: "iOS 27.2+ 已启用强证书固定，避免对 gspe1-ssl 或 smoot 启用 MitM 解密导致断连。",
    law4Title: "04 · 地区设「台湾」+ 外区商店",
    law4Desc: "既避开大陆地区限制，又完整保留普通话「询问来电原因」来电筛选。",
    tabStudio: "模块安装",
    tabRulesets: "分流规则集",
    tabDoctor: "配置体检",
    tabSymptoms: "故障速查",
    tabProbe: "出口探针",
    studioTitle: "客户端独立模块（一键挂载）",
    studioSub: "已内置真实 IP 护栏（always-real-ip / fake-ip-filter）与置顶分流规则。导入客户端后，可直接在模块参数中选择你的美区策略组名称。",
    rsTitle: "纯净分流规则集（RULE-SET 远程订阅）",
    rsSub: "供自维护主配置的用户直接复制远程规则链接：既可按功能拆分引用，也可直接使用下方合并总集。",
    rsSubdividedHeading: "按功能细分规则集",
    rsCombinedHeading: "合并总规则集（一条包含全部）",
    rsCopyContent: "复制规则内容",
    rsClosePreview: "收起预览",
    doctorTitle: "本地自动脱敏配置排雷体检",
    doctorSub: "默认在读取瞬间自动抹除所有节点 IP、密码、UUID 与机场订阅 URL，同时无损检测分流规则顺序与节点 UDP / QUIC 开关状态。",
    trust1: "导入即本地抹除节点密钥与订阅链接",
    trust2: "支持断网/飞行模式离线体检（F12 Network 零请求）",
    trust3: "查看未压缩源码 (auditor.js) ↗",
    chooseFile: "选择本地配置文件",
    loadBrokenDemo: "载入翻车示例",
    loadCleanDemo: "载入满分示例",
    clearAudit: "清空",
    autoScrubLabel: "自动抹除节点密码与订阅 URL",
    symTitle: "常见故障 3 秒定位手册",
    symSub: "遇到报错先别盲目换节点或重刷系统，对照下方现象直接定位根因：",
    probeTitle: "分流出口区域实测 & 核心端点连通性探针",
    probeSub: "直接检测当前浏览器在「国内直连 / 默认海外代理 / ChatGPT / AI 中继」四条通道实际接通的国家地区与机房落点，并测试 Apple 原生网关握手延迟。",
    showFullIpLabel: "显示完整出口 IP（默认打码）",
    runProbe: "开始检测接通节点区域与延迟",
    probeRegionHeading: "四路实际分流出口区域与机房落点",
    probeAppleHeading: "Apple 智能与 Siri 原生端点 TLS 握手连通性",
    cliTipTitle: "验证苹果官方准入接口 (gspe1-ssl) 判定你的国家代码",
    cliTipDesc: "Apple 私有网关不带浏览器跨域头，macOS 终端运行右侧命令若直接输出 US 即代表准入路由已生效：",
    copied: "已复制到剪贴板",
  },
  en: {
    heroBadge: "Zero-MitM · No Cert Errors · Verified on iOS / macOS 26–27",
    heroTitle: "Minimalist Routing & Config Doctor for Apple Intelligence",
    heroSub: "Zero HTTPS decryption or rewrite scripts needed. Keep Mandarin Siri & Call Screening on real-IP DIRECT while routing Apple PCC, Photos High-Quality Clean Up & ChatGPT cleanly through US proxies.",
    law1Title: "01 · Mandarin Siri -> DIRECT",
    law1Desc: "Never proxy or Fake-IP guzzoni.apple.com & *.siri.apple.com.",
    law2Title: "02 · PCC & Clean Up Above Apple_All",
    law2Desc: "Place issuer / ropes / mask / app.apple.com & apple-relay.* above catch-all Apple rules; keep UDP 443.",
    law3Title: "03 · No Location/Siri MitM",
    law3Desc: "iOS 27.2+ enforces certificate pinning; avoid MitM decryption on gspe1-ssl or smoot.",
    law4Title: "04 · Region Taiwan + Non-CN Store",
    law4Desc: "Preserves Mandarin Call Screening while unlocking Visual Intelligence & cloud tools.",
    tabStudio: "Modules",
    tabRulesets: "Rule-Sets",
    tabDoctor: "Config Doctor",
    tabSymptoms: "Troubleshooting",
    tabProbe: "Exit Probe",
    studioTitle: "Plug-and-Play Client Modules",
    studioSub: "Includes real-IP guardrails and top-priority routing rules. Select your US policy group directly inside your client's module settings after installation.",
    rsTitle: "Standalone & Combined Rule-Sets",
    rsSub: "Subscribe to individual orthogonal lists above, or grab the single combined bundle below.",
    rsSubdividedHeading: "Subdivided Rule-Sets",
    rsCombinedHeading: "Combined All-in-One Bundle",
    rsCopyContent: "Copy Rules",
    rsClosePreview: "Close Preview",
    doctorTitle: "Local Auto-Redacting Config Doctor",
    doctorSub: "Automatically strips proxy server IPs, passwords, UUIDs, and subscription URLs locally in memory while auditing routing rules and node UDP/QUIC flags.",
    trust1: "Auto-redacts credentials & sub URLs",
    trust2: "Works offline in Airplane Mode (0 network calls)",
    trust3: "Inspect unminified source (auditor.js) ↗",
    chooseFile: "Open Config File",
    loadBrokenDemo: "Load Broken Demo",
    loadCleanDemo: "Load Clean Demo",
    clearAudit: "Clear",
    autoScrubLabel: "Auto-redact proxy passwords & sub URLs",
    symTitle: "3-Second Symptom Troubleshooter",
    symSub: "Pinpoint the exact root cause before changing nodes or restoring iOS:",
    probeTitle: "Connected Exit Region & Endpoint Probe",
    probeSub: "Detects real exit country, city/datacenter colo, and masked IP across Direct, Default Proxy, ChatGPT, and AI Relay lanes.",
    showFullIpLabel: "Show full exit IPs (masked by default)",
    runProbe: "Detect Exit Regions & Latency",
    probeRegionHeading: "Connected Exit Region & Datacenter Matrix",
    probeAppleHeading: "Apple Native Endpoints TLS Handshake",
    cliTipTitle: "Verify Apple's exact gspe1-ssl country code",
    cliTipDesc: "Run this on macOS Terminal (output 'US' confirms geo-eligibility routing works):",
    copied: "Copied to clipboard",
  },
};

const CLIENT_MODULES = {
  surge: [
    {
      nameZh: "AppleFlow 全套分流模块（推荐）",
      nameEn: "AppleFlow Full Module (Recommended)",
      badgeZh: "支持模块参数改策略名",
      badgeEn: "Supports Module Argument",
      descZh: "包含中文 Siri 真实 IP 直连护栏 + Apple PCC 隐私云计算与相册高质量消除 + ChatGPT（含语音/Sora）/ Gemini / Claude（含 Artifacts）/ 视觉识图。安装后可在 Surge 模块参数 Policy 中填入你的美区策略组名（默认 PROXY）。",
      descEn: "Includes Mandarin Siri real-IP direct guardrail + Apple PCC & Photos High-Quality Clean Up + ChatGPT (incl. Voice/Sora), Gemini, Claude Artifacts & Visual Intelligence. Customize Policy argument directly inside Surge.",
      file: "AppleFlow-Full.sgmodule",
      uriPrefix: "surge:///install-module?url=",
      installZh: "一键安装到 Surge",
      installEn: "Install in Surge",
    },
    {
      nameZh: "AppleFlow 核心精简版（不含外部大模型）",
      nameEn: "AppleFlow Core Module (Apple Native Only)",
      badgeZh: "仅 Apple 原生域",
      badgeEn: "Apple Domains Only",
      descZh: "仅包含中文 Siri 直连护栏与 Apple 原生 PCC 隐私云计算，适合已在主配置中自行维护 OpenAI / Google 规则的用户。",
      descEn: "Contains only Mandarin Siri direct guardrail and Apple native PCC routing.",
      file: "AppleFlow.sgmodule",
      uriPrefix: "surge:///install-module?url=",
      installZh: "一键安装精简版",
      installEn: "Install Core in Surge",
    },
  ],
  loon: [
    {
      nameZh: "AppleFlow · Loon 插件",
      nameEn: "AppleFlow · Loon Plugin",
      badgeZh: "内置图形化策略选择",
      badgeEn: "Built-in Policy Picker",
      descZh: "包含中文 Siri 直连护栏 (`real-ip`) + Apple PCC 隐私云计算 + ChatGPT / 视觉识图。导入后可在插件详情页下拉选择你的美区策略组。",
      descEn: "Includes Siri real-ip direct guardrail + Apple PCC + AI extensions with Loon's native policy selector.",
      file: "AppleFlow.plugin",
      uriPrefix: "loon://import?plugin=",
      installZh: "一键导入 Loon",
      installEn: "Import in Loon",
    },
  ],
  shadowrocket: [
    {
      nameZh: "AppleFlow · Shadowrocket 模块",
      nameEn: "AppleFlow · Shadowrocket Module",
      badgeZh: "开箱即用",
      badgeEn: "Plug & Play",
      descZh: "包含 `always-real-ip` 护栏、中文 Siri 直连与 Apple PCC / ChatGPT / 视觉智能美区分流（默认指向 PROXY）。",
      descEn: "Includes always-real-ip, Mandarin Siri direct, and Apple PCC / ChatGPT routing.",
      file: "AppleFlow.module",
      uriPrefix: "shadowrocket://install?module=",
      installZh: "一键安装到 Shadowrocket",
      installEn: "Install in Shadowrocket",
    },
  ],
  stash: [
    {
      nameZh: "AppleFlow · Stash 覆写 (Override)",
      nameEn: "AppleFlow · Stash Override",
      badgeZh: "自动注入 fake-ip-filter",
      badgeEn: "Injects fake-ip-filter",
      descZh: "自动配置 `fake-ip-filter` 与置顶分流规则（请确保你的美区节点已开启 UDP 转发以支持 QUIC）。",
      descEn: "Configures fake-ip-filter and top-priority PCC/Siri rules (ensure UDP relay is enabled on US nodes).",
      file: "AppleFlow.stoverride",
      uriPrefix: "stash://install-override?url=",
      installZh: "一键安装到 Stash",
      installEn: "Install in Stash",
    },
  ],
  mihomo: [
    {
      nameZh: "AppleFlow · Mihomo (Clash Meta) 覆写模板",
      nameEn: "AppleFlow · Mihomo Mixin YAML",
      badgeZh: "含 fake-ip-filter + rule-providers",
      badgeEn: "fake-ip-filter + rule-providers",
      descZh: "在客户端 Sub-Store / Verge Rev / Party 的全局扩展覆写中引用或粘贴，将策略名改为你的美国策略组即可。",
      descEn: "Use as a Mihomo profile mixin or copy rule-providers into your main YAML config.",
      file: "AppleFlow-Mihomo.yaml",
      uriPrefix: null,
    },
  ],
};

const REGION_LANES = [
  {
    id: "direct",
    titleZh: "国内直连通道 (DIRECT 基准)",
    titleEn: "Domestic Direct Lane (DIRECT Baseline)",
    urls: ["https://www.visa.cn/cdn-cgi/trace", "https://www.cloudflare-cn.com/cdn-cgi/trace"],
    evaluate(loc, regionStr, lang) {
      if (loc === "CN") {
        return {
          level: "pass",
          text: lang === "en" ? "Healthy domestic direct exit (Global Proxy OFF)" : "正常国内直连（未误开全局代理，中文 Siri 安全）",
        };
      }
      return {
        level: "error",
        text:
          lang === "en"
            ? `Domestic traffic exited via ${regionStr}! Global Proxy may break Mandarin Siri.`
            : `警告：国内流量跑到了 ${regionStr}，疑似开启全局代理，中文 Siri 极易报错`,
      };
    },
  },
  {
    id: "defaultProxy",
    titleZh: "默认海外代理出口 (PROXY 基准)",
    titleEn: "Default Overseas Proxy Exit",
    urls: ["https://1.1.1.1/cdn-cgi/trace"],
    enrichGeoIp: true,
    evaluate(loc, regionStr, lang) {
      if (loc === "CN") {
        return {
          level: "warn",
          text: lang === "en" ? "Currently direct in CN (is proxy enabled?)" : "当前为国内直连（代理软件是否未开启？）",
        };
      }
      if (loc === "US") {
        return {
          level: "pass",
          text: lang === "en" ? "Connected to US exit node" : "默认代理即为美国节点",
        };
      }
      return {
        level: "pass",
        text:
          lang === "en"
            ? `Default proxy is ${regionStr} (ensure AI rules route to US)`
            : `默认出口为 ${regionStr}（确保 AI 专线已单独分流至美国即可）`,
      };
    },
  },
  {
    id: "chatgpt",
    titleZh: "Siri ChatGPT / OpenAI 实际出口",
    titleEn: "Siri ChatGPT / OpenAI Actual Exit",
    urls: ["https://chatgpt.com/cdn-cgi/trace", "https://platform.openai.com/cdn-cgi/trace"],
    evaluate(loc, regionStr, lang) {
      if (loc === "US") {
        return {
          level: "pass",
          text: lang === "en" ? "Optimal: Connected via US node" : "已精准分流至美国节点",
        };
      }
      if (["CN", "HK", "MO", "RU", "BY", "IR", "KP"].includes(loc)) {
        return {
          level: "error",
          text:
            lang === "en"
              ? `Restricted region (${loc}) — Siri ChatGPT will fail, route to US.`
              : `落在受限地区 (${regionStr})，Siri 调用 ChatGPT 会被拒，请分流至美区`,
        };
      }
      return {
        level: "warn",
        text:
          lang === "en"
            ? `Connected via ${loc} (US recommended to match Apple PCC)`
            : `当前接通 ${regionStr}（可用，建议与 Apple PCC 统一走美区）`,
      };
    },
  },
  {
    id: "aiRelay",
    titleZh: "Claude / Cloudflare 中继实际出口",
    titleEn: "Claude / Cloudflare Relay Actual Exit",
    urls: ["https://claude.ai/cdn-cgi/trace", "https://www.cloudflare.com/cdn-cgi/trace"],
    evaluate(loc, regionStr, lang) {
      if (loc === "US") {
        return {
          level: "pass",
          text: lang === "en" ? "Optimal: US relay exit active" : "AI 与 Cloudflare 中继已走美国节点",
        };
      }
      if (["CN", "HK", "MO"].includes(loc)) {
        return {
          level: "warn",
          text:
            lang === "en"
              ? `Currently ${loc} — route claude.ai & apple-relay.* to US`
              : `当前落在 ${regionStr}，建议将 AI 扩展与 apple-relay.* 指向美区`,
        };
      }
      return {
        level: "pass",
        text: lang === "en" ? `Connected via ${loc}` : `已接通海外节点 (${regionStr})`,
      };
    },
  },
];

const PROBE_TARGETS = [
  { host: "guzzoni.apple.com", url: "https://guzzoni.apple.com", roleZh: "中文 Siri 与来电筛选网关（期望：国内直连）", roleEn: "Mandarin Siri Core (Expect: DIRECT)" },
  { host: "gspe1-ssl.ls.apple.com", url: "https://gspe1-ssl.ls.apple.com/pep/gcc", roleZh: "区域定位准入校验（期望：美区节点 · 禁 MitM）", roleEn: "Geo Eligibility (Expect: US Proxy · No MitM)" },
  { host: "mask-api.icloud.com", url: "https://mask-api.icloud.com", roleZh: "PCC 匿名令牌签发（期望：美区节点）", roleEn: "PCC Blind Token Mask (Expect: US Proxy)" },
  { host: "apple-relay.cloudflare.com", url: "https://apple-relay.cloudflare.com", roleZh: "PCC Cloudflare 边缘中继（期望：美区节点）", roleEn: "PCC Cloudflare Relay (Expect: US Proxy)" },
  { host: "apple-relay.fastly-edge.com", url: "https://apple-relay.fastly-edge.com", roleZh: "PCC Fastly 边缘中继（期望：美区节点）", roleEn: "PCC Fastly Relay (Expect: US Proxy)" },
  { host: "lens.google.com", url: "https://lens.google.com", roleZh: "视觉智能 Google 识图（期望：美区节点）", roleEn: "Visual Intelligence Lens (Expect: US Proxy)" },
];

const BROKEN_DEMO = `#!MANAGED-CONFIG https://sub.example-airport.com/api/v1/client/subscribe?token=secret_demo_token_12345

[General]
skip-proxy = 127.0.0.1, 192.168.0.0/16, localhost
always-real-ip = *.srv.nintendo.net

[Proxy]
🌐 全球直连 = direct
🇺🇸 示例美区节点 = trojan, us1.example.com, 443, password=my_super_secret_password, udp-relay=false, block-quic=on

[Rule]
# 错误 1：全局一刀切拦截了 QUIC (UDP 443)，拖慢甚至阻断 PCC 中继
AND,((PROTOCOL,UDP),(DEST-PORT,443)),REJECT-NO-DROP
# 错误 2：把中文 Siri 网关分流到了海外代理
DOMAIN-SUFFIX,guzzoni.apple.com,🇺🇸 示例美区节点
# 错误 3：Apple_All 兜底直连放在了 AI / PCC 规则前面，导致 mask.icloud.com 与 gspe1-ssl 被截胡直连
RULE-SET,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Surge/Apple/Apple_All_No_Resolve.list,🌐 全球直连
DOMAIN-SUFFIX,apple-relay.apple.com,🇭🇰 香港节点
DOMAIN-SUFFIX,akadns.net,DIRECT

[MITM]
ca-passphrase = demo_private_passphrase
# 错误 4：对已启用强证书固定的定位与 Siri 域名开启了 MitM
hostname = %APPEND% gspe1-ssl.ls.apple.com, *.smoot.apple.com
`;

function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg || I18N[state.lang].copied;
  el.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => el.classList.remove("show"), 1800);
}

function switchTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.toggle("active", b.dataset.tab === tabId));
  document.querySelectorAll(".panel").forEach((p) => p.classList.toggle("active", p.id === `panel-${tabId}`));
}

function renderStudio() {
  const container = document.getElementById("moduleCardList");
  container.innerHTML = "";
  const isEn = state.lang === "en";
  const items = CLIENT_MODULES[state.client] || CLIENT_MODULES.surge;
  const base = `${APPLEFLOW_META.rawBase}/modules`;

  for (const m of items) {
    const rawUrl = `${base}/${m.file}`;
    const card = document.createElement("div");
    card.className = "module-card";

    const head = document.createElement("div");
    head.className = "module-head";

    const name = document.createElement("div");
    name.className = "module-name";
    name.textContent = isEn ? m.nameEn : m.nameZh;

    const badge = document.createElement("span");
    badge.className = "rs-badge rs-badge-proxy";
    badge.textContent = isEn ? m.badgeEn : m.badgeZh;

    head.appendChild(name);
    head.appendChild(badge);

    const desc = document.createElement("div");
    desc.className = "module-desc";
    desc.textContent = isEn ? m.descEn : m.descZh;

    const bar = document.createElement("div");
    bar.className = "module-url-bar";

    const urlEl = document.createElement("div");
    urlEl.className = "sub-url";
    urlEl.textContent = rawUrl;

    const btns = document.createElement("div");
    btns.className = "btn-row";

    if (m.uriPrefix) {
      const installA = document.createElement("a");
      installA.className = "btn btn-primary";
      installA.href = `${m.uriPrefix}${encodeURIComponent(rawUrl)}`;
      installA.textContent = isEn ? m.installEn : m.installZh;
      btns.appendChild(installA);
    }

    const copyBtn = document.createElement("button");
    copyBtn.className = m.uriPrefix ? "btn" : "btn btn-primary";
    copyBtn.type = "button";
    copyBtn.textContent = isEn ? "Copy URL" : "复制链接";
    copyBtn.addEventListener("click", async () => {
      await navigator.clipboard.writeText(rawUrl);
      showToast();
    });
    btns.appendChild(copyBtn);

    bar.appendChild(urlEl);
    bar.appendChild(btns);

    card.appendChild(head);
    card.appendChild(desc);
    card.appendChild(bar);
    container.appendChild(card);
  }
}

function buildRulesetCardElement({ id, title, badgeText, isDirect, desc, url, isCombined = false }) {
  const isEn = state.lang === "en";
  const card = document.createElement("div");
  card.className = isCombined ? "rs-card-combined" : "rs-card";

  const top = document.createElement("div");
  top.className = "rs-card-top";

  const titleEl = document.createElement("div");
  titleEl.className = "rs-title";
  titleEl.textContent = title;

  const badge = document.createElement("span");
  badge.className = `rs-badge ${isDirect ? "rs-badge-direct" : "rs-badge-proxy"}`;
  badge.textContent = badgeText;

  top.appendChild(titleEl);
  top.appendChild(badge);

  const descEl = document.createElement("div");
  descEl.className = "rs-desc";
  descEl.textContent = desc;

  const urlBox = document.createElement("div");
  urlBox.className = "rs-url";
  urlBox.textContent = url || (isEn ? "Click Preview Rules to inspect JSON" : "点击下方查看规则内容");

  const actions = document.createElement("div");
  actions.className = "btn-row";

  if (url) {
    const copyBtn = document.createElement("button");
    copyBtn.className = isCombined ? "btn btn-primary" : "btn";
    copyBtn.type = "button";
    copyBtn.textContent = isEn ? "Copy Subscription URL" : "复制订阅链接";
    copyBtn.addEventListener("click", async () => {
      await navigator.clipboard.writeText(url);
      showToast();
    });
    actions.appendChild(copyBtn);
  }

  const viewBtn = document.createElement("button");
  viewBtn.className = "btn";
  viewBtn.type = "button";
  const activeInspect = state.rsInspectingId === id;
  viewBtn.textContent = activeInspect
    ? isEn ? "Hide Rules" : "收起规则明细"
    : isEn ? "Preview Rules" : "查看规则明细";
  viewBtn.addEventListener("click", () => {
    state.rsInspectingId = state.rsInspectingId === id ? null : id;
    renderRulesetsTab();
  });
  actions.appendChild(viewBtn);

  card.appendChild(top);
  card.appendChild(descEl);
  card.appendChild(urlBox);
  card.appendChild(actions);
  return card;
}

function renderRulesetsTab() {
  const isEn = state.lang === "en";
  const grid = document.getElementById("rulesetCardGrid");
  grid.innerHTML = "";

  for (const rs of STANDALONE_RULESETS) {
    const url = getStandaloneRulesetUrl(state.rsFormat, rs.id);
    grid.appendChild(
      buildRulesetCardElement({
        id: rs.id,
        title: isEn ? rs.titleEn : rs.titleZh,
        badgeText: isEn ? rs.badgeEn : rs.badgeZh,
        isDirect: rs.routeType === "direct",
        desc: isEn ? rs.descEn : rs.descZh,
        url,
      })
    );
  }

  // Bottom: Combined All-in-One rule-set card
  const combinedArea = document.getElementById("combinedCardArea");
  combinedArea.innerHTML = "";
  const isQx = state.rsFormat === "qx";
  const combinedId = isQx ? COMBINED_RULESET_CARD.qxAllId : COMBINED_RULESET_CARD.id;
  const combinedUrl = getStandaloneRulesetUrl(state.rsFormat, combinedId);
  combinedArea.appendChild(
    buildRulesetCardElement({
      id: combinedId,
      title: isQx
        ? isEn ? COMBINED_RULESET_CARD.qxTitleEn : COMBINED_RULESET_CARD.qxTitleZh
        : isEn ? COMBINED_RULESET_CARD.titleEn : COMBINED_RULESET_CARD.titleZh,
      badgeText: isEn ? COMBINED_RULESET_CARD.badgeEn : COMBINED_RULESET_CARD.badgeZh,
      isDirect: false,
      desc: isQx
        ? isEn ? COMBINED_RULESET_CARD.qxDescEn : COMBINED_RULESET_CARD.qxDescZh
        : isEn ? COMBINED_RULESET_CARD.descEn : COMBINED_RULESET_CARD.descZh,
      url: combinedUrl,
      isCombined: true,
    })
  );

  // Collapsible preview drawer
  const drawer = document.getElementById("rsDrawer");
  if (state.rsInspectingId) {
    drawer.style.display = "block";
    const rendered = renderStandaloneRulesetContent(state.rsFormat, state.rsInspectingId, state.lang);
    document.getElementById("rsPreviewTitle").textContent = rendered.filename;
    document.getElementById("rsCodePreview").textContent = rendered.content;
  } else {
    drawer.style.display = "none";
  }
}

function applyInputToDoctor(rawText) {
  const textarea = document.getElementById("auditInput");
  if (state.autoScrub) {
    const { text, scrubbedCount } = scrubConfigSecrets(rawText);
    textarea.value = text;
    state.lastScrubCount = scrubbedCount;
  } else {
    textarea.value = rawText;
    state.lastScrubCount = 0;
  }
  renderScrubNotice();
  renderAudit();
}

function renderScrubNotice() {
  const notice = document.getElementById("scrubNotice");
  if (state.lastScrubCount > 0) {
    notice.style.display = "block";
    notice.textContent =
      state.lang === "en"
        ? `Locally redacted ${state.lastScrubCount} sensitive credential / subscription line(s) in browser memory before scanning.`
        : `已在浏览器本地内存自动抹除 ${state.lastScrubCount} 处节点地址、密码、证书私钥或机场订阅链接（仅保留分流规则供扫描）。`;
  } else {
    notice.style.display = "none";
  }
}

function renderAudit() {
  const raw = document.getElementById("auditInput").value;
  const area = document.getElementById("auditResultArea");
  if (!raw.trim()) {
    area.style.display = "none";
    state.lastScrubCount = 0;
    renderScrubNotice();
    return;
  }
  area.style.display = "block";

  const res = auditConfig(raw);
  const badge = document.getElementById("scoreBadge");
  badge.textContent = String(res.score);
  badge.className = "score-badge " + (res.score >= 90 ? "score-good" : res.score >= 65 ? "score-mid" : "score-bad");

  const errors = res.findings.filter((f) => f.severity === "error").length;
  const warns = res.findings.filter((f) => f.severity === "warn").length;

  const sumTitle = document.getElementById("scoreSummaryTitle");
  const sumSub = document.getElementById("scoreSummarySub");
  const fmtLabel = res.format === "clash-yaml" ? "Clash / Mihomo / Stash YAML" : "Surge / Loon / INI";

  if (state.lang === "en") {
    sumTitle.textContent = errors === 0 ? `Healthy Configuration (${fmtLabel})` : `Found ${errors} Critical Conflict(s), ${warns} Warning(s)`;
    sumSub.textContent =
      errors === 0
        ? "Siri real-IP protection and Apple PCC routing order look clean."
        : "Fix the items below to restore Mandarin Siri and Apple PCC connectivity.";
  } else {
    sumTitle.textContent =
      errors === 0
        ? `配置健康通过（格式：${fmtLabel}）`
        : `检出 ${errors} 项冲突 · ${warns} 项建议（格式：${fmtLabel}）`;
    sumSub.textContent =
      errors === 0
        ? "中文 Siri 真实 IP 直连与 Apple PCC 分流顺序均符合最佳实践。"
        : "请按下方提示修正规则顺序或移除冲突项，即可恢复中文 Siri 与 Apple 智能连接。";
  }

  const list = document.getElementById("findingList");
  list.innerHTML = "";
  for (const f of res.findings) {
    const item = document.createElement("div");
    item.className = `finding-item finding-${f.severity}`;
    const prefix = f.severity === "pass" ? "[通过] " : f.severity === "warn" ? "[注意] " : "[冲突] ";
    const title = document.createElement("div");
    title.className = "finding-title";
    title.textContent = `${prefix}${state.lang === "en" ? f.titleEn : f.titleZh}`;
    item.appendChild(title);

    const detailText = state.lang === "en" ? f.detailEn : f.detailZh;
    if (detailText) {
      const detail = document.createElement("div");
      detail.className = "finding-detail";
      detail.textContent = detailText;
      item.appendChild(detail);
    }

    if (f.fix) {
      const fix = document.createElement("div");
      fix.className = "finding-fix";
      fix.textContent = f.fix;
      item.appendChild(fix);
    }
    list.appendChild(item);
  }
}

function parseCloudflareTrace(text) {
  const map = {};
  for (const line of String(text || "").split("\n")) {
    const idx = line.indexOf("=");
    if (idx > 0) {
      map[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
    }
  }
  return map;
}

async function fetchTraceWithFallback(urls) {
  for (const url of urls) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5500);
    const t0 = performance.now();
    try {
      const resp = await fetch(`${url}?_af=${Date.now()}`, {
        cache: "no-store",
        signal: ctrl.signal,
      });
      if (!resp.ok) continue;
      const body = await resp.text();
      const parsed = parseCloudflareTrace(body);
      if (parsed.loc || parsed.ip) {
        clearTimeout(timer);
        return {
          ok: true,
          ms: Math.round(performance.now() - t0),
          loc: (parsed.loc || "").toUpperCase(),
          colo: (parsed.colo || "").toUpperCase(),
          ip: parsed.ip || "",
          host: parsed.h || new URL(url).hostname,
        };
      }
    } catch {
      // fallback
    } finally {
      clearTimeout(timer);
    }
  }
  return { ok: false, ms: 0 };
}

async function fetchGeoIspOptional() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 3500);
  try {
    const resp = await fetch(`https://api.ip.sb/geoip?_af=${Date.now()}`, {
      cache: "no-store",
      signal: ctrl.signal,
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.isp || data.asn_organization || data.organization || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function renderRegionLanes() {
  const grid = document.getElementById("regionLaneGrid");
  grid.innerHTML = "";
  const isEn = state.lang === "en";

  for (const lane of REGION_LANES) {
    const card = document.createElement("div");
    card.className = "region-card";

    const head = document.createElement("div");
    head.className = "region-card-head";

    const nameEl = document.createElement("div");
    nameEl.className = "region-lane-name";
    nameEl.textContent = isEn ? lane.titleEn : lane.titleZh;

    const latEl = document.createElement("div");
    latEl.className = "region-latency";

    const r = state.regionResults?.[lane.id];
    if (!r) {
      latEl.textContent = "—";
    } else if (r.status === "running") {
      latEl.textContent = isEn ? "Detecting..." : "探测中...";
    } else if (r.ok) {
      latEl.textContent = `${r.ms} ms`;
    } else {
      latEl.textContent = isEn ? "Unreachable" : "连接超时";
    }

    head.appendChild(nameEl);
    head.appendChild(latEl);

    const locMain = document.createElement("div");
    locMain.className = "region-loc-main";

    const metaEl = document.createElement("div");
    metaEl.className = "region-meta";

    const verdictEl = document.createElement("div");

    if (!r) {
      locMain.textContent = isEn ? "Not tested yet" : "尚未检测";
      locMain.style.color = "var(--text-muted)";
      locMain.style.fontSize = "14px";
      metaEl.textContent = isEn ? "Click button above to detect exit node region" : "点击上方按钮读取当前通道实际接通的国家与机房";
      verdictEl.className = "region-verdict verdict-idle";
      verdictEl.textContent = isEn ? "Idle" : "等待探测";
    } else if (r.status === "running") {
      locMain.textContent = "...";
      metaEl.textContent = isEn ? "Reading exit trace..." : "正在读取分流出口节点信息...";
      verdictEl.className = "region-verdict verdict-idle";
      verdictEl.textContent = "...";
    } else if (!r.ok) {
      locMain.textContent = isEn ? "Connection Failed" : "无法接通或被拦截";
      locMain.style.color = "var(--error)";
      metaEl.textContent = lane.urls[0];
      verdictEl.className = "region-verdict verdict-error";
      verdictEl.textContent = isEn ? "Check proxy node or DNS rules" : "请检查当前节点是否离线或规则误拦截";
    } else {
      const regionStr = formatRegionLabel(r.loc, r.colo, state.lang);
      locMain.textContent = regionStr;
      const ipDisplay = maskIp(r.ip, state.showFullIp);
      const ispSuffix = r.isp ? ` · ${r.isp}` : "";
      metaEl.textContent = `IP: ${ipDisplay}${ispSuffix} · via ${r.host}`;
      const v = lane.evaluate(r.loc, regionStr, state.lang);
      verdictEl.className = `region-verdict verdict-${v.level}`;
      verdictEl.textContent = v.text;
    }

    card.appendChild(head);
    card.appendChild(locMain);
    card.appendChild(metaEl);
    card.appendChild(verdictEl);
    grid.appendChild(card);
  }
}

function renderProbeRows() {
  const grid = document.getElementById("probeGrid");
  grid.innerHTML = "";
  for (const t of PROBE_TARGETS) {
    const row = document.createElement("div");
    row.className = "probe-row";
    const left = document.createElement("div");
    const hostEl = document.createElement("div");
    hostEl.className = "probe-host";
    hostEl.textContent = t.host;
    const roleEl = document.createElement("div");
    roleEl.className = "probe-role";
    roleEl.textContent = state.lang === "en" ? t.roleEn : t.roleZh;
    left.appendChild(hostEl);
    left.appendChild(roleEl);

    const right = document.createElement("div");
    right.className = "probe-ms";
    const r = state.probeResults?.[t.host];
    if (!r) {
      right.style.color = "var(--text-muted)";
      right.textContent = "—";
    } else if (r.status === "running") {
      right.style.color = "var(--text-secondary)";
      right.textContent = "...";
    } else if (r.ok) {
      right.style.color = r.ms < 600 ? "var(--pass)" : "var(--warn)";
      right.textContent = `${r.ms} ms`;
    } else {
      right.style.color = "var(--error)";
      right.textContent = state.lang === "en" ? "Timeout" : "超时/阻断";
    }

    row.appendChild(left);
    row.appendChild(right);
    grid.appendChild(row);
  }
}

async function runLiveProbes() {
  state.regionResults = {};
  state.probeResults = {};
  for (const lane of REGION_LANES) state.regionResults[lane.id] = { status: "running" };
  for (const t of PROBE_TARGETS) state.probeResults[t.host] = { status: "running" };
  renderRegionLanes();
  renderProbeRows();

  const regionTasks = REGION_LANES.map(async (lane) => {
    const [trace, isp] = await Promise.all([
      fetchTraceWithFallback(lane.urls),
      lane.enrichGeoIp ? fetchGeoIspOptional() : Promise.resolve(null),
    ]);
    state.regionResults[lane.id] = { status: "done", ...trace, isp };
    renderRegionLanes();
  });

  const appleTasks = PROBE_TARGETS.map(async (t) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    const t0 = performance.now();
    try {
      const sep = t.url.includes("?") ? "&" : "?";
      await fetch(`${t.url}${sep}_af=${Date.now()}`, {
        mode: "no-cors",
        cache: "no-store",
        signal: ctrl.signal,
      });
      const ms = Math.round(performance.now() - t0);
      state.probeResults[t.host] = { status: "done", ok: true, ms };
    } catch {
      state.probeResults[t.host] = { status: "done", ok: false, ms: 0 };
    } finally {
      clearTimeout(timer);
      renderProbeRows();
    }
  });

  await Promise.all([...regionTasks, ...appleTasks]);
}

function applyLang() {
  const dict = I18N[state.lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  renderStudio();
  renderRulesetsTab();
  renderScrubNotice();
  renderAudit();
  renderRegionLanes();
  renderProbeRows();
}

// Wire up events
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

document.getElementById("clientGrid").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll("#clientGrid .chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  state.client = chip.dataset.client;
  renderStudio();
});

document.getElementById("rsFormatGrid").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll("#rsFormatGrid .chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  state.rsFormat = chip.dataset.rsfmt;
  state.rsInspectingId = null;
  renderRulesetsTab();
});

document.getElementById("rsCopyBtn").addEventListener("click", async () => {
  await navigator.clipboard.writeText(document.getElementById("rsCodePreview").textContent);
  showToast();
});

document.getElementById("rsCloseDrawerBtn").addEventListener("click", () => {
  state.rsInspectingId = null;
  renderRulesetsTab();
});

document.getElementById("autoScrubChk").addEventListener("change", (e) => {
  state.autoScrub = e.target.checked;
  if (state.autoScrub && document.getElementById("auditInput").value.trim()) {
    applyInputToDoctor(document.getElementById("auditInput").value);
  }
});

document.getElementById("auditInput").addEventListener("paste", (e) => {
  if (!state.autoScrub) return;
  const pasted = e.clipboardData?.getData("text");
  if (!pasted) return;
  e.preventDefault();
  applyInputToDoctor(pasted);
});

document.getElementById("auditInput").addEventListener("input", () => {
  renderAudit();
});

document.getElementById("fileInput").addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  applyInputToDoctor(await file.text());
  e.target.value = "";
});

const dz = document.getElementById("dropzone");
dz.addEventListener("dragover", (e) => {
  e.preventDefault();
});
dz.addEventListener("drop", async (e) => {
  e.preventDefault();
  const file = e.dataTransfer?.files?.[0];
  if (!file) return;
  applyInputToDoctor(await file.text());
});

document.getElementById("demoBrokenBtn").addEventListener("click", () => {
  applyInputToDoctor(BROKEN_DEMO);
});

document.getElementById("demoCleanBtn").addEventListener("click", () => {
  const clean = generateClientConfig({ client: "surge", policy: "🇺🇸 美国节点", includeExt: true, includeApns: true });
  applyInputToDoctor(clean.content);
});

document.getElementById("clearAuditBtn").addEventListener("click", () => {
  document.getElementById("auditInput").value = "";
  state.lastScrubCount = 0;
  renderScrubNotice();
  renderAudit();
});

document.getElementById("runProbeBtn").addEventListener("click", runLiveProbes);

document.getElementById("showFullIpChk").addEventListener("change", (e) => {
  state.showFullIp = e.target.checked;
  renderRegionLanes();
});

document.getElementById("copyGccCmdBtn").addEventListener("click", async () => {
  await navigator.clipboard.writeText("curl -s https://gspe1-ssl.ls.apple.com/pep/gcc && echo");
  showToast();
});

document.getElementById("langToggle").addEventListener("click", () => {
  state.lang = state.lang === "zh" ? "en" : "zh";
  applyLang();
});

applyLang();
