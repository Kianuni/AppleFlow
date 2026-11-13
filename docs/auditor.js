/**
 * AppleFlow Config Doctor & Rule Generator Core (Zero-Upload Local Engine)
 * Works identically in Browser ES Modules and Node.js test suites.
 */

export const APPLEFLOW_META = {
  version: "1.0.0",
  repoUrl: "https://github.com/Kianuni/AppleFlow",
  rawBase: "https://raw.githubusercontent.com/Kianuni/AppleFlow/main",
  pagesUrl: "https://kianuni.github.io/AppleFlow/",
};

export const RULE_BUNDLES = {
  siriDirect: [
    { type: "DOMAIN-SUFFIX", value: "guzzoni.apple.com", noteZh: "Siri 与普通话来电筛选主网关（严禁代理/Fake-IP）", noteEn: "Siri & Mandarin Call Screening core gateway (MUST go DIRECT)" },
    { type: "DOMAIN-SUFFIX", value: "siri.apple.com", noteZh: "Siri 语音核心域", noteEn: "Siri voice core domain" },
    { type: "DOMAIN", value: "dejavu.apple.com", noteZh: "Siri 语音识别辅助", noteEn: "Siri speech helper" },
    { type: "DOMAIN", value: "sequoia.apple.com", noteZh: "Siri 自然语言服务", noteEn: "Siri NL service" },
    { type: "DOMAIN-SUFFIX", value: "smoot.apple.com", noteZh: "Spotlight / Siri 搜索建议", noteEn: "Spotlight / Siri suggestions" },
  ],
  applePCC: [
    { type: "DOMAIN", value: "gspe1-ssl.ls.apple.com", noteZh: "Apple 智能区域与定位准入校验（禁 MitM）", noteEn: "Geo-eligibility check (never MitM on iOS 27.2+)" },
    { type: "DOMAIN", value: "mask-api.icloud.com", noteZh: "PCC 匿名令牌签发", noteEn: "PCC anonymous token issuer" },
    { type: "DOMAIN", value: "mask.icloud.com", noteZh: "PCC OHTTP 盲化网关", noteEn: "PCC OHTTP gateway" },
    { type: "DOMAIN", value: "mask-h2.icloud.com", noteZh: "PCC OHTTP HTTP/2 回退网关", noteEn: "PCC OHTTP H2 fallback" },
    { type: "DOMAIN", value: "ss-cleanup-proxy-prod.us-east-1m.app.apple.com", noteZh: "Apple 生成式云端推理节点", noteEn: "Apple cloud generative endpoint" },
    { type: "DOMAIN-SUFFIX", value: "app.apple.com", noteZh: "Apple 生成式云端服务接口", noteEn: "Apple cloud generative services" },
    { type: "DOMAIN-SUFFIX", value: "apple-relay.apple.com", noteZh: "PCC 隐私云计算中继（勿拦 UDP 443 / QUIC）", noteEn: "PCC OHTTP relay (do not block UDP 443 / QUIC)" },
    { type: "DOMAIN-SUFFIX", value: "apple-relay.cloudflare.com", noteZh: "PCC Cloudflare 中继", noteEn: "PCC Cloudflare relay" },
    { type: "DOMAIN-SUFFIX", value: "apple-relay.fastly-edge.com", noteZh: "PCC Fastly 中继", noteEn: "PCC Fastly relay" },
    { type: "DOMAIN-SUFFIX", value: "apple-relay.akamaized.net", noteZh: "PCC Akamai 中继", noteEn: "PCC Akamai relay" },
    { type: "DOMAIN-SUFFIX", value: "cp4.cloudflare.com", noteZh: "Apple 隐私中继辅助端点", noteEn: "Apple relay helper endpoint" },
  ],
  aiExt: [
    { type: "DOMAIN-SUFFIX", value: "openai.com", noteZh: "Siri ChatGPT 扩展接口", noteEn: "Siri ChatGPT extension API" },
    { type: "DOMAIN-SUFFIX", value: "chatgpt.com", noteZh: "ChatGPT 账号与多模态", noteEn: "ChatGPT auth & multimodal" },
    { type: "DOMAIN-SUFFIX", value: "oaistatic.com", noteZh: "OpenAI 静态资源", noteEn: "OpenAI static assets" },
    { type: "DOMAIN-SUFFIX", value: "oaiusercontent.com", noteZh: "ChatGPT 图片生成附件", noteEn: "ChatGPT image assets" },
    { type: "DOMAIN", value: "openai-api.arkoselabs.com", noteZh: "OpenAI 安全验证", noteEn: "OpenAI verification" },
    { type: "DOMAIN-SUFFIX", value: "googleapis.com", noteZh: "视觉智能 Google 识图接口", noteEn: "Visual Intelligence Google Lookup" },
    { type: "DOMAIN-SUFFIX", value: "gstatic.com", noteZh: "Google 识图静态资源", noteEn: "Google static assets" },
    { type: "DOMAIN", value: "lens.google.com", noteZh: "Google Lens 视觉识图", noteEn: "Google Lens endpoint" },
    { type: "DOMAIN-SUFFIX", value: "anthropic.com", noteZh: "Claude / Xcode Intelligence", noteEn: "Anthropic / Xcode Intelligence" },
    { type: "DOMAIN-SUFFIX", value: "claude.ai", noteZh: "Claude 服务", noteEn: "Claude web/API" },
  ],
  apnsDirect: [
    { type: "DOMAIN", value: "identity.apple.com", noteZh: "Apple ID 身份认证直连", noteEn: "Apple ID identity direct" },
    { type: "DOMAIN-SUFFIX", value: "push.apple.com", noteZh: "APNs 推送直连", noteEn: "APNs push direct" },
    { type: "DOMAIN-KEYWORD", value: "apple.com.edgekey.net", noteZh: "Apple Akamai 边缘直连", noteEn: "Apple Akamai edge direct" },
    { type: "IP-CIDR", value: "17.249.0.0/16", noteZh: "APNs IPv4", noteEn: "APNs IPv4" },
    { type: "IP-CIDR", value: "17.252.0.0/16", noteZh: "APNs IPv4", noteEn: "APNs IPv4" },
    { type: "IP-CIDR", value: "17.57.144.0/22", noteZh: "APNs IPv4", noteEn: "APNs IPv4" },
    { type: "IP-CIDR", value: "17.188.128.0/18", noteZh: "APNs IPv4", noteEn: "APNs IPv4" },
    { type: "IP-CIDR", value: "17.188.20.0/23", noteZh: "APNs IPv4", noteEn: "APNs IPv4" },
  ],
};

export const REAL_IP_LIST = [
  "guzzoni.apple.com",
  "*.guzzoni.apple.com",
  "*.siri.apple.com",
  "dejavu.apple.com",
  "sequoia.apple.com",
  "*.smoot.apple.com",
  "*.push.apple.com",
];

export const CLASH_FAKE_IP_FILTER = [
  "guzzoni.apple.com",
  "+.guzzoni.apple.com",
  "+.siri.apple.com",
  "dejavu.apple.com",
  "sequoia.apple.com",
  "+.smoot.apple.com",
  "+.push.apple.com",
  "gspe1-ssl.ls.apple.com",
  "mask-api.icloud.com",
  "mask.icloud.com",
  "mask-h2.icloud.com",
  "+.app.apple.com",
  "+.apple-relay.apple.com",
  "+.apple-relay.cloudflare.com",
  "+.apple-relay.fastly-edge.com",
  "+.apple-relay.akamaized.net",
];

function sanitizePolicyName(raw) {
  const cleaned = String(raw || "").replace(/[\r\n#,]/g, "").trim();
  return cleaned || "PROXY";
}

function quoteSurgePolicyIfNeeded(policy) {
  if (/[\s]/.test(policy) && !(policy.startsWith('"') && policy.endsWith('"'))) {
    return `"${policy}"`;
  }
  return policy;
}

/**
 * Generates customized client configuration text on the fly.
 */
export function generateClientConfig({
  client = "surge",
  policy = "PROXY",
  includeExt = true,
  includeApns = false,
  lang = "zh",
} = {}) {
  const p = sanitizePolicyName(policy);
  const surgePol = quoteSurgePolicyIfNeeded(p);
  const noteKey = lang === "en" ? "noteEn" : "noteZh";

  const activeProxyRules = [
    ...RULE_BUNDLES.applePCC,
    ...(includeExt ? RULE_BUNDLES.aiExt : []),
  ];
  const activeDirectRules = [
    ...RULE_BUNDLES.siriDirect,
    ...(includeApns ? RULE_BUNDLES.apnsDirect : []),
  ];

  if (client === "surge") {
    const title = lang === "en"
      ? `AppleFlow · Apple Intelligence & Mandarin Siri (${p})`
      : `AppleFlow · Apple 智能与中文 Siri 分流 (${p})`;
    const desc = lang === "en"
      ? `Zero-MitM Apple Intelligence routing: keeps Mandarin Siri & Call Screening (guzzoni) on DIRECT real IP while routing PCC & AI extensions to ${p}.`
      : `零 MitM 极简分流：锁定中文 Siri 与普通话来电筛选 (guzzoni) 真实 IP 直连，将 Apple Intelligence PCC 隐私云计算与扩展置顶分流至 ${p}。`;
    const lines = [
      `#!name=${title}`,
      `#!desc=${desc}`,
      `#!author=Kianuni[${APPLEFLOW_META.repoUrl}]`,
      `#!homepage=${APPLEFLOW_META.pagesUrl}`,
      `#!category= AppleFlow`,
      `#!version=${APPLEFLOW_META.version}`,
      "",
      "[General]",
      "skip-proxy = %APPEND% guzzoni.apple.com",
      `always-real-ip = %APPEND% ${REAL_IP_LIST.join(", ")}`,
      "",
      "[Rule]",
      lang === "en"
        ? "# 1. Mandarin Siri & Call Screening MUST go DIRECT with Real IP"
        : "# 1. 中文 Siri 与普通话「询问来电原因」必须真实 IP 直连（严禁走代理）",
      ...activeDirectRules.map((r) =>
        r.type.startsWith("IP-") ? `${r.type},${r.value},DIRECT,no-resolve // ${r[noteKey]}` : `${r.type},${r.value},DIRECT // ${r[noteKey]}`
      ),
      "",
      lang === "en"
        ? `# 2. Apple Intelligence PCC & Extensions -> ${p} (place ABOVE Apple_All)`
        : `# 2. Apple Intelligence PCC 隐私云计算与外部扩展 -> ${p}（置顶防 Apple_All 抢行）`,
      ...activeProxyRules.map((r) => `${r.type},${r.value},${surgePol} // ${r[noteKey]}`),
    ];
    return { filename: "AppleFlow-Custom.sgmodule", content: lines.join("\n") + "\n" };
  }

  if (client === "loon") {
    const lines = [
      `#!name = AppleFlow · Apple Intelligence (${p})`,
      `#!desc = Zero-MitM Apple Intelligence & Mandarin Siri routing (${p})`,
      `#!homepage = ${APPLEFLOW_META.pagesUrl}`,
      `#!system = ios, ipados, macos`,
      `#!version = ${APPLEFLOW_META.version}`,
      "",
      "[General]",
      "skip-proxy = guzzoni.apple.com",
      `real-ip = ${REAL_IP_LIST.join(", ")}`,
      "",
      "[Rule]",
      ...activeDirectRules.map((r) =>
        r.type.startsWith("IP-") ? `${r.type}, ${r.value}, DIRECT, no-resolve` : `${r.type}, ${r.value}, DIRECT`
      ),
      ...activeProxyRules.map((r) => `${r.type}, ${r.value}, ${p}`),
    ];
    return { filename: "AppleFlow-Custom.plugin", content: lines.join("\n") + "\n" };
  }

  if (client === "shadowrocket") {
    const lines = [
      `#!name=AppleFlow (${p})`,
      `#!desc=Apple Intelligence PCC -> ${p} · Mandarin Siri -> DIRECT`,
      `#!homepage=${APPLEFLOW_META.pagesUrl}`,
      "",
      "[General]",
      "skip-proxy = %APPEND% guzzoni.apple.com",
      `always-real-ip = %APPEND% ${REAL_IP_LIST.join(", ")}`,
      "",
      "[Rule]",
      ...activeDirectRules.map((r) =>
        r.type.startsWith("IP-") ? `${r.type},${r.value},DIRECT,no-resolve` : `${r.type},${r.value},DIRECT`
      ),
      ...activeProxyRules.map((r) => `${r.type},${r.value},${p}`),
    ];
    return { filename: "AppleFlow-Custom.module", content: lines.join("\n") + "\n" };
  }

  if (client === "stash" || client === "mihomo") {
    const isStash = client === "stash";
    const header = isStash
      ? [
          `name: "AppleFlow · Apple Intelligence (${p})"`,
          `desc: "Mandarin Siri DIRECT + Apple PCC -> ${p} (ensure udp: true)"`,
          `homepage: "${APPLEFLOW_META.pagesUrl}"`,
          "",
        ]
      : [
          `# AppleFlow — Mihomo (Clash Meta) Config Snippet`,
          `# Ensure your US proxy node in group "${p}" has udp: true enabled`,
          "",
        ];
    const lines = [
      ...header,
      "dns:",
      "  fake-ip-filter:",
      ...CLASH_FAKE_IP_FILTER.map((d) => `    - "${d}"`),
      "",
      "rules:",
      ...activeDirectRules.map((r) =>
        r.type.startsWith("IP-") ? `  - ${r.type},${r.value},DIRECT,no-resolve` : `  - ${r.type},${r.value},DIRECT`
      ),
      ...activeProxyRules.map((r) => `  - ${r.type},${r.value},${p}`),
    ];
    return {
      filename: isStash ? "AppleFlow-Custom.stoverride" : "AppleFlow-Mihomo.yaml",
      content: lines.join("\n") + "\n",
    };
  }

  if (client === "qx") {
    const qxMap = {
      DOMAIN: "HOST",
      "DOMAIN-SUFFIX": "HOST-SUFFIX",
      "DOMAIN-KEYWORD": "HOST-KEYWORD",
      "IP-CIDR": "IP-CIDR",
      "IP-CIDR6": "IP6-CIDR",
    };
    const lines = [
      `# AppleFlow — Quantumult X Filter (${p})`,
      `# Note: also add guzzoni.apple.com & *.siri.apple.com exclusions if using custom DNS/MitM`,
      "",
      ...activeDirectRules.map((r) => `${qxMap[r.type]}, ${r.value}, direct`),
      ...activeProxyRules.map((r) => `${qxMap[r.type]}, ${r.value}, ${p}`),
    ];
    return { filename: "AppleFlow-QX.list", content: lines.join("\n") + "\n" };
  }

  if (client === "singbox") {
    const doc = {
      route: {
        rules: [
          {
            domain: activeDirectRules.filter((r) => r.type === "DOMAIN").map((r) => r.value),
            domain_suffix: activeDirectRules.filter((r) => r.type === "DOMAIN-SUFFIX").map((r) => r.value),
            outbound: "direct",
          },
          {
            domain: activeProxyRules.filter((r) => r.type === "DOMAIN").map((r) => r.value),
            domain_suffix: activeProxyRules.filter((r) => r.type === "DOMAIN-SUFFIX").map((r) => r.value),
            outbound: p,
          },
        ],
      },
    };
    return { filename: "AppleFlow-singbox-route.json", content: JSON.stringify(doc, null, 2) + "\n" };
  }

  return { filename: "AppleFlow.txt", content: "" };
}

/**
 * Normalizes quotes and inline comments from a policy token.
 */
function stripInlineComment(str) {
  return String(str || "").replace(/\s+(\/\/|#).*$/, "").trim();
}

function cleanPolicyToken(raw) {
  if (!raw) return "";
  return stripInlineComment(raw)
    .replace(/^["']|["']$/g, "")
    .trim();
}

function isLikelyDirectTarget(target, knownDirectAliases) {
  if (!target) return false;
  const upper = target.toUpperCase();
  if (upper === "DIRECT") return true;
  if (knownDirectAliases.has(target)) return true;
  if (/直连|direct/i.test(target) && !/非直连/.test(target)) return true;
  return false;
}

function isRejectTarget(target) {
  if (!target) return false;
  return /^REJECT(-DROP|-NO-DROP|-TINYGIF)?$/i.test(target.trim());
}

/**
 * Audits a user's Surge (.conf / .sgmodule) or Clash/Mihomo/Stash (.yaml) text locally.
 */
export function auditConfig(rawText) {
  const text = String(rawText || "");
  const trimmed = text.trim();
  if (!trimmed) {
    return { format: "empty", score: 0, findings: [] };
  }

  const lines = text.split(/\r?\n/);
  const isYaml =
    /(^|\n)\s*(proxies|proxy-groups|rule-providers|rules|dns)\s*:/m.test(text) &&
    !/^\s*\[(General|Rule|Proxy|MITM)\]/im.test(text);
  const format = isYaml ? "clash-yaml" : "surge-ini";

  const findings = [];
  const knownDirectAliases = new Set(["DIRECT", "direct"]);

  // 1. Collect direct proxy aliases (e.g. `🌐 全球直连 = direct`) and proxy groups
  const proxyGroups = new Map();
  let currentSection = "";

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const stripped = rawLine.trim();
    if (!stripped || stripped.startsWith("#") || stripped.startsWith("//") || stripped.startsWith(";")) {
      continue;
    }
    const secMatch = stripped.match(/^\[([^\]]+)\]/);
    if (secMatch) {
      currentSection = secMatch[1].trim().toLowerCase();
      continue;
    }
    if (!isYaml && currentSection === "proxy") {
      const eqIdx = stripped.indexOf("=");
      if (eqIdx > 0) {
        const name = cleanPolicyToken(stripped.slice(0, eqIdx));
        const rhs = stripped.slice(eqIdx + 1).trim().toLowerCase();
        if (rhs === "direct" || rhs.startsWith("direct,")) {
          knownDirectAliases.add(name);
        }
      }
    }
    if (!isYaml && currentSection === "proxy group") {
      const eqIdx = stripped.indexOf("=");
      if (eqIdx > 0) {
        const name = cleanPolicyToken(stripped.slice(0, eqIdx));
        const rhs = stripped.slice(eqIdx + 1).trim();
        proxyGroups.set(name, rhs);
        // If a select group's FIRST option is a direct alias (e.g. `🍎 苹果服务 = select, "🌐 全球直连", ...`), note its default
        const parts = rhs.split(",").map((s) => cleanPolicyToken(s));
        if (parts[0]?.toLowerCase() === "select" && parts[1] && isLikelyDirectTarget(parts[1], knownDirectAliases)) {
          proxyGroups.set(`${name}::__defaultDirect`, true);
        }
      }
    }
  }

  // 2. Parse General / DNS / MITM / Script / Rules
  currentSection = "";
  let skipProxyLine = "";
  let realIpLine = "";
  let fakeIpEnabled = false;
  const fakeIpFilters = [];
  let inFakeIpFilter = false;
  const mitmLines = [];
  const scriptLines = [];
  const parsedRules = [];

  for (let i = 0; i < lines.length; i++) {
    const lineNo = i + 1;
    const rawLine = lines[i];
    const stripped = rawLine.trim();

    if (!stripped) continue;

    // Active configuration lines only
    if (stripped.startsWith("#") || stripped.startsWith("//") || stripped.startsWith(";")) {
      continue;
    }

    if (!isYaml) {
      const secMatch = stripped.match(/^\[([^\]]+)\]/);
      if (secMatch) {
        currentSection = secMatch[1].trim().toLowerCase();
        continue;
      }
      if (currentSection === "general") {
        if (/^skip-proxy\s*=/i.test(stripped)) skipProxyLine += " " + stripped;
        if (/^(always-real-ip|real-ip)\s*=/i.test(stripped)) realIpLine += " " + stripped;
      } else if (currentSection === "mitm") {
        if (/^hostname\s*=/i.test(stripped)) mitmLines.push({ lineNo, text: stripped });
      } else if (currentSection === "script" || currentSection === "url rewrite" || currentSection === "map local") {
        scriptLines.push({ lineNo, text: stripped });
      } else if (currentSection === "rule" || currentSection === "") {
        if (/^(DOMAIN|DOMAIN-SUFFIX|DOMAIN-KEYWORD|DOMAIN-SET|RULE-SET|GEOSITE|IP-CIDR|IP-CIDR6|AND|OR|PROTOCOL|DEST-PORT|FINAL|HOST|HOST-SUFFIX)\b/i.test(stripped)) {
          parsedRules.push({ lineNo, raw: stripped });
        }
      }
    } else {
      // Clash / Mihomo / Stash YAML
      if (/^enhanced-mode\s*:\s*fake-ip/i.test(stripped)) {
        fakeIpEnabled = true;
      }
      if (/^fake-ip-filter\s*:/i.test(stripped)) {
        inFakeIpFilter = true;
        continue;
      }
      if (inFakeIpFilter) {
        if (stripped.startsWith("-")) {
          fakeIpFilters.push(stripped.replace(/^-+\s*/, "").replace(/^["']|["']$/g, "").trim());
          continue;
        } else if (/^[a-zA-Z0-9_-]+\s*:/.test(stripped)) {
          inFakeIpFilter = false;
        }
      }
      if (stripped.startsWith("- ")) {
        const candidate = stripped.slice(2).trim().replace(/^["']|["']$/g, "");
        if (/^(DOMAIN|DOMAIN-SUFFIX|DOMAIN-KEYWORD|RULE-SET|GEOSITE|IP-CIDR|IP-CIDR6|AND|OR|DST-PORT|NETWORK|MATCH)\b/i.test(candidate)) {
          parsedRules.push({ lineNo, raw: candidate });
        }
      }
    }
  }

  // Helper to extract target policy from a rule line (accounting for nested parentheses like `AND,((PROTOCOL,UDP),(DEST-PORT,443)),REJECT`)
  function parseRuleEntry(entry) {
    const rawNoComment = stripInlineComment(entry.raw);
    const tokens = [];
    let depth = 0;
    let buf = "";
    for (const ch of rawNoComment) {
      if (ch === "(") depth++;
      if (ch === ")") depth = Math.max(0, depth - 1);
      if (ch === "," && depth === 0) {
        tokens.push(buf.trim());
        buf = "";
      } else {
        buf += ch;
      }
    }
    if (buf.trim()) tokens.push(buf.trim());

    const type = (tokens[0] || "").toUpperCase();
    if (type === "FINAL" || type === "MATCH") {
      return { ...entry, type, pattern: "", policy: cleanPolicyToken(tokens[1] || "") };
    }
    if (type === "AND" || type === "OR") {
      return { ...entry, type, pattern: tokens[1] || "", policy: cleanPolicyToken(tokens[2] || "") };
    }
    return {
      ...entry,
      type,
      pattern: (tokens[1] || "").trim(),
      policy: cleanPolicyToken(tokens[2] || ""),
    };
  }

  const rules = parsedRules.map(parseRuleEntry);

  // --- CHECK 1: Siri Core Direct Routing (`guzzoni.apple.com` & `siri.apple.com`) ---
  const guzzoniRule = rules.find(
    (r) =>
      /guzzoni\.apple\.com/i.test(r.pattern) ||
      /Siri-Direct|appleflow-siri-direct/i.test(r.pattern)
  );
  const siriRule = rules.find(
    (r) =>
      /(^|\.)siri\.apple\.com$/i.test(r.pattern) ||
      /Siri-Direct|appleflow-siri-direct/i.test(r.pattern)
  );

  if (!guzzoniRule) {
    findings.push({
      id: "siri-direct-missing",
      severity: "error",
      titleZh: "缺少中文 Siri 核心域名 (guzzoni.apple.com) 直连保护规则",
      titleEn: "Missing DIRECT rule for Siri core gateway (guzzoni.apple.com)",
      detailZh:
        "未检测到显式的 guzzoni.apple.com 直连规则。一旦该域名落入海外代理策略组或开启全局代理，中文 Siri 会立即报「我碰到了一点问题。请再试一次。」且普通话来电筛选可能异常。",
      detailEn:
        "Routing guzzoni.apple.com through an overseas proxy causes Mandarin Siri to fail immediately. Add DOMAIN-SUFFIX,guzzoni.apple.com,DIRECT.",
      fix: "DOMAIN-SUFFIX,guzzoni.apple.com,DIRECT\nDOMAIN-SUFFIX,siri.apple.com,DIRECT",
    });
  } else if (!isLikelyDirectTarget(guzzoniRule.policy, knownDirectAliases)) {
    findings.push({
      id: "siri-routed-to-proxy",
      severity: "error",
      line: guzzoniRule.lineNo,
      titleZh: `致命冲突：第 ${guzzoniRule.lineNo} 行将 guzzoni.apple.com 分流到了「${guzzoniRule.policy}」`,
      titleEn: `Critical: Line ${guzzoniRule.lineNo} routes guzzoni.apple.com to "${guzzoniRule.policy}"`,
      detailZh:
        "中文普通话 Siri 与来电筛选要求 guzzoni.apple.com 及 siri.apple.com 必须走本地真实 IP 直连 (DIRECT)，走海外节点会触发服务端区域会话校验失败。",
      detailEn:
        "Mandarin Siri requires guzzoni.apple.com to connect via DIRECT real IP.",
      fix: "DOMAIN-SUFFIX,guzzoni.apple.com,DIRECT",
    });
  } else if (!siriRule) {
    findings.push({
      id: "siri-sub-missing",
      severity: "warn",
      titleZh: "已放行 guzzoni，但建议同时补齐 siri.apple.com / smoot.apple.com 直连规则",
      titleEn: "Recommend adding siri.apple.com & smoot.apple.com DIRECT rules alongside guzzoni",
      detailZh: "补齐 DOMAIN-SUFFIX,siri.apple.com,DIRECT 与 DOMAIN-SUFFIX,smoot.apple.com,DIRECT 可避免后续泛解析规则误匹配。",
      detailEn: "Adding siri.apple.com and smoot.apple.com DIRECT avoids wildcard proxy capture.",
    });
  } else {
    findings.push({
      id: "siri-direct-ok",
      severity: "pass",
      line: guzzoniRule.lineNo,
      titleZh: `中文 Siri 主网关直连保护正常（第 ${guzzoniRule.lineNo} 行 -> ${guzzoniRule.policy}）`,
      titleEn: `Siri core gateway properly routed to DIRECT (line ${guzzoniRule.lineNo})`,
    });
  }

  // --- CHECK 2: Real-IP / Fake-IP Protection ---
  if (!isYaml) {
    const hasGeneralSection = /\[\s*General\s*\]/i.test(text);
    if (hasGeneralSection) {
      const hasGuzzoniRealIp = /guzzoni\.apple\.com/i.test(realIpLine);
      const hasSiriRealIp = /siri\.apple\.com/i.test(realIpLine);
      const hasGuzzoniSkip = /guzzoni\.apple\.com/i.test(skipProxyLine);
      if (!hasGuzzoniRealIp || !hasSiriRealIp) {
        findings.push({
          id: "surge-real-ip-missing",
          severity: "error",
          titleZh: "[General] 缺少 Siri 域名的 always-real-ip（Fake-IP 会导致 Siri 断连）",
          titleEn: "Missing always-real-ip for guzzoni.apple.com & *.siri.apple.com in [General]",
          detailZh:
            "Surge / Loon 接管 VIF DNS 时若返回 198.18.0.0/15 Fake-IP，会导致 Siri 守护进程 TLS/QUIC 握手异常。请务必加入 always-real-ip。",
          detailEn:
            "Fake-IP (198.18.x.x) breaks Siri daemon connections. Add guzzoni.apple.com and *.siri.apple.com to always-real-ip.",
          fix: "skip-proxy = %APPEND% guzzoni.apple.com\nalways-real-ip = %APPEND% guzzoni.apple.com, *.guzzoni.apple.com, *.siri.apple.com",
        });
      } else {
        findings.push({
          id: "surge-real-ip-ok",
          severity: "pass",
          titleZh: `Siri 真实 IP 保护已启用（always-real-ip${hasGuzzoniSkip ? " + skip-proxy" : ""}）`,
          titleEn: "Real-IP DNS protection verified for Siri domains",
        });
      }
    }
  } else {
    const hasFilter = fakeIpFilters.some((f) => /guzzoni\.apple\.com|siri\.apple\.com|^\+\.apple\.com$|^\*\.apple\.com$/i.test(f));
    if ((fakeIpEnabled || /\bdns\s*:/m.test(text)) && !hasFilter) {
      findings.push({
        id: "clash-fakeip-missing",
        severity: "error",
        titleZh: "dns.fake-ip-filter 未排除 Siri 与 PCC 关键域名",
        titleEn: "dns.fake-ip-filter is missing Siri & PCC domains",
        detailZh: "Mihomo / Clash / Stash 在 Fake-IP 模式下会将 guzzoni.apple.com 解析为虚拟 IP，导致 Siri 报错。请在 fake-ip-filter 中放行。",
        detailEn: "Add guzzoni.apple.com, +.siri.apple.com, and +.apple-relay.apple.com to fake-ip-filter.",
      });
    } else if (hasFilter) {
      findings.push({
        id: "clash-fakeip-ok",
        severity: "pass",
        titleZh: "YAML fake-ip-filter 真实 IP 过滤已配置",
        titleEn: "YAML fake-ip-filter verified",
      });
    }
  }

  // --- CHECK 3: Apple PCC Routing & Catch-All Apple Rule Shadowing ---
  const pccRule = rules.find((r) =>
    /apple-relay|Apple-PCC|appleflow-pcc|AI\.list|apple_intelligence|ai\.conf/i.test(r.pattern)
  );
  const maskExplicit = rules.find((r) =>
    /mask(-api|-h2)?\.icloud\.com|Apple-PCC|appleflow-pcc|apple_intelligence/i.test(r.pattern)
  );
  const cleanupExplicit = rules.find((r) =>
    /app\.apple\.com|Apple-PCC|appleflow-pcc|apple_intelligence/i.test(r.pattern)
  );
  const catchAllAppleDirect = rules.find((r) => {
    const matchesApple =
      /Apple_All|Apple\.list|Apple\.conf|^apple$|icloud\.com|^\.?apple\.com$/i.test(r.pattern) &&
      !/apple-relay|apple_intelligence|Apple-PCC|Apple-APNs/i.test(r.pattern);
    if (!matchesApple) return false;
    return (
      isLikelyDirectTarget(r.policy, knownDirectAliases) ||
      proxyGroups.get(`${r.policy}::__defaultDirect`) === true
    );
  });

  if (!pccRule) {
    findings.push({
      id: "pcc-missing",
      severity: "error",
      titleZh: "未检测到 Apple Intelligence (apple-relay / PCC) 海外分流规则",
      titleEn: "Missing Apple Intelligence PCC (apple-relay.*) proxy routing rules",
      detailZh:
        "缺少 apple-relay.*、gspe1-ssl.ls.apple.com、mask*.icloud.com 及 app.apple.com 的美区分流规则，这会导致书写工具云端请求与 PCC 隐私计算无法正常连接。",
      detailEn:
        "Add AppleFlow PCC rules routed to a low-latency US proxy above any Apple catch-all rules.",
    });
  } else {
    if (isLikelyDirectTarget(pccRule.policy, knownDirectAliases)) {
      findings.push({
        id: "pcc-direct-error",
        severity: "error",
        line: pccRule.lineNo,
        titleZh: `第 ${pccRule.lineNo} 行将 Apple PCC 规则设为了直连（${pccRule.policy}）`,
        titleEn: `Line ${pccRule.lineNo} routes Apple PCC rules to DIRECT (${pccRule.policy})`,
        detailZh: "Apple Intelligence PCC 与 gspe1-ssl.ls.apple.com 必须走低延迟美区代理节点，国内直连会被判定为不支持地区。",
        detailEn: "Apple PCC and gspe1-ssl.ls.apple.com must route through a supported US proxy.",
      });
    } else if (catchAllAppleDirect && catchAllAppleDirect.lineNo < pccRule.lineNo) {
      findings.push({
        id: "pcc-shadowed",
        severity: "error",
        line: catchAllAppleDirect.lineNo,
        titleZh: `规则顺序被抢行：第 ${catchAllAppleDirect.lineNo} 行 Apple 兜底直连位于 PCC 规则（第 ${pccRule.lineNo} 行）之前`,
        titleEn: `Rule Shadowing: Apple catch-all rule (line ${catchAllAppleDirect.lineNo}) precedes PCC rule (line ${pccRule.lineNo})`,
        detailZh:
          "Apple_All / GEOSITE,apple / icloud.com 包含了 apple.com 与 icloud.com 域名后缀，放在前面会把 gspe1-ssl.ls.apple.com、mask*.icloud.com 与 app.apple.com 全部截胡成直连！请将 AppleFlow / AI 规则移到 Apple 兜底规则上方。",
        detailEn:
          "Move Apple PCC / AI rules ABOVE Apple_All / GEOSITE,apple so PCC endpoints are not hijacked to DIRECT.",
      });
    } else {
      findings.push({
        id: "pcc-order-ok",
        severity: "pass",
        line: pccRule.lineNo,
        titleZh: `Apple PCC 分流规则位置正确（第 ${pccRule.lineNo} 行 -> ${pccRule.policy}，位于苹果兜底规则之前）`,
        titleEn: `Apple PCC routing verified (line ${pccRule.lineNo} -> ${pccRule.policy})`,
      });

      if (/(🇭🇰|香港|\bHK\b|Hong\s*Kong)/i.test(pccRule.policy) && !/(🇺🇸|美国|\bUS\b)/.test(pccRule.policy)) {
        findings.push({
          id: "pcc-hk-policy",
          severity: "error",
          line: pccRule.lineNo,
          titleZh: `节点地区不兼容：PCC 分流指向了香港策略组「${pccRule.policy}」`,
          titleEn: `Unsupported Region: PCC policy "${pccRule.policy}" points to Hong Kong`,
          detailZh: "香港出口 IP 不支持 ChatGPT 扩展，且易触发 PCC 区域准入限制。请改用低延迟美国 (US) 节点。",
          detailEn: "Use a low-latency United States (US) proxy for Apple PCC and Siri ChatGPT.",
        });
      }

      if (catchAllAppleDirect && (!maskExplicit || !cleanupExplicit)) {
        findings.push({
          id: "pcc-mask-cleanup-tip",
          severity: "warn",
          line: catchAllAppleDirect.lineNo,
          titleZh: "建议在 Apple_All 直连前显式补充 mask*.icloud.com 与 app.apple.com",
          titleEn: "Recommend explicitly routing mask*.icloud.com & app.apple.com before Apple_All",
          detailZh:
            "部分通用 AI.list 仅包含 apple-relay.*，未包含 mask*.icloud.com 与 app.apple.com，可能落入下方的 Apple_All 直连规则影响 PCC 匿名令牌签发。",
          detailEn:
            "Generic AI lists often omit mask-api.icloud.com and *.app.apple.com, letting Apple_All route them to DIRECT.",
          fix: `DOMAIN,mask-api.icloud.com,${quoteSurgePolicyIfNeeded(pccRule.policy)}\nDOMAIN,mask.icloud.com,${quoteSurgePolicyIfNeeded(pccRule.policy)}\nDOMAIN,mask-h2.icloud.com,${quoteSurgePolicyIfNeeded(pccRule.policy)}\nDOMAIN-SUFFIX,app.apple.com,${quoteSurgePolicyIfNeeded(pccRule.policy)}`,
        });
      }
    }
  }

  // --- CHECK 4: QUIC / UDP 443 Reject Trap ---
  const quicBlockRule = rules.find((r) => {
    if (!isRejectTarget(r.policy)) return false;
    const rawUpper = r.raw.toUpperCase();
    return (
      rawUpper.includes("QUIC") ||
      (rawUpper.includes("UDP") && rawUpper.includes("443"))
    );
  });
  if (quicBlockRule && (!pccRule || quicBlockRule.lineNo < pccRule.lineNo || /apple-relay/i.test(quicBlockRule.raw))) {
    findings.push({
      id: "quic-block-trap",
      severity: "error",
      line: quicBlockRule.lineNo,
      titleZh: `高危拦截：第 ${quicBlockRule.lineNo} 行全局屏蔽了 UDP 443 / QUIC（会阻断或拖慢 PCC 中继）`,
      titleEn: `Line ${quicBlockRule.lineNo} blocks UDP 443 / QUIC before Apple PCC rules`,
      detailZh:
        "Apple Intelligence 的 privatecloudcomputed 优先使用 HTTP/3 (QUIC / UDP 443) 连接 apple-relay.*。前置拦截 QUIC 会导致 PCC 握手超时，请移除该拦截或将 apple-relay.* 置于其上方。",
      detailEn:
        "Apple PCC OHTTP relays prefer HTTP/3 (UDP 443). Do not reject QUIC on apple-relay.*.",
    });
  }

  // --- CHECK 5: Location / Siri MitM Pinning Conflict ---
  const badMitm = mitmLines.find((m) => /gspe1-ssl\.ls\.apple\.com|smoot\.apple\.com|guzzoni\.apple\.com/i.test(m.text));
  const badScript = scriptLines.find((s) =>
    /gspe1-ssl\.ls\.apple\.com|smoot\.apple\.com|LocationService|Siri-Spotlight/i.test(s.text)
  );
  if (badMitm || badScript) {
    const hit = badMitm || badScript;
    findings.push({
      id: "apple-pinning-mitm",
      severity: "error",
      line: hit.lineNo,
      titleZh: `检测到针对定位/Siri 域名的 MitM 解密配置（第 ${hit.lineNo} 行）`,
      titleEn: `MitM decryption or rewrite detected on pinned Apple Location/Siri domains (line ${hit.lineNo})`,
      detailZh:
        "自 iOS 27.2 起苹果已对定位与资格校验启用强证书固定 (Certificate Pinning)，对 gspe1-ssl.ls.apple.com 或 *.smoot.apple.com 进行 MitM 解密会导致定位准入断连与 Siri 搜索异常，建议移除对应 MitM 主机名（TestFlight 类配置互不冲突）。",
      detailEn:
        "Certificate pinning on iOS 27.2+ causes connection failures when MitM decryption is active on gspe1-ssl.ls.apple.com or *.smoot.apple.com.",
    });
  }

  // --- CHECK 6: Overbroad akadns.net Direct Rule ---
  const akadnsRule = rules.find((r) => /^akadns\.net$/i.test(r.pattern) && r.type === "DOMAIN-SUFFIX");
  if (akadnsRule) {
    findings.push({
      id: "akadns-overbroad",
      severity: "warn",
      line: akadnsRule.lineNo,
      titleZh: `第 ${akadnsRule.lineNo} 行存在过宽的 DOMAIN-SUFFIX,akadns.net 规则`,
      titleEn: `Overbroad DOMAIN-SUFFIX,akadns.net rule on line ${akadnsRule.lineNo}`,
      detailZh: "akadns.net 是 Akamai 公共智能解析后缀，大量非苹果海外服务也通过 CNAME 指向它，强制直连会误伤其他海外应用。建议改用精确的 push.apple.com + apple.com.edgekey.net。",
      detailEn: "akadns.net is shared across many non-Apple Akamai customers; avoid wildcard DIRECT matching.",
    });
  }

  // Compute health score (0-100)
  let score = 100;
  for (const f of findings) {
    if (f.severity === "error") score -= 28;
    else if (f.severity === "warn") score -= 8;
  }
  score = Math.max(0, Math.min(100, score));

  return { format, score, findings };
}

/**
 * Scrubs proxy server IPs, passwords, UUIDs, WireGuard keys, MitM CA secrets,
 * and airport subscription URLs strictly in local memory before displaying/auditing,
 * while preserving [General], [Rule], direct aliases, and MitM hostnames for 100% accurate auditing.
 */
export function scrubConfigSecrets(rawText) {
  const input = String(rawText || "");
  if (!input.trim()) return { text: input, scrubbedCount: 0 };

  let scrubbedCount = 0;
  const lines = input.replace(/\r\n/g, "\n").split("\n");
  const isYaml = lines.some((l) => /^\s*(proxies|proxy-groups|rules|rule-providers|dns)\s*:/i.test(l));

  if (!isYaml) {
    let section = "";
    const out = lines.map((line) => {
      const trimmed = line.trim();
      if (/^#!MANAGED-CONFIG\s+https?:\/\//i.test(trimmed)) {
        scrubbedCount++;
        return "#!MANAGED-CONFIG [已本地脱敏抹除托管订阅链接]";
      }
      const secMatch = trimmed.match(/^\[([^\]]+)\]$/);
      if (secMatch) {
        section = secMatch[1].trim().toLowerCase();
        return line;
      }
      if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//") || trimmed.startsWith(";")) {
        return line;
      }

      if (section === "proxy") {
        const eqIdx = line.indexOf("=");
        if (eqIdx > 0) {
          const name = line.slice(0, eqIdx).trim();
          const rhs = line.slice(eqIdx + 1).trim();
          if (/^(direct|reject(-tinygif|-drop|-no-drop)?)\b/i.test(rhs)) {
            return line;
          }
          if (!rhs.includes("[已本地脱敏")) {
            scrubbedCount++;
            return `${name} = custom, 0.0.0.0, 443, [已本地脱敏抹除节点地址与密钥]`;
          }
        }
      } else if (section === "proxy group") {
        if (/policy-path\s*=\s*https?:\/\//i.test(line)) {
          scrubbedCount++;
          return line.replace(/policy-path\s*=\s*https?:\/\/[^\s,]+/gi, "policy-path=[已本地脱敏抹除订阅链接]");
        }
      } else if (section === "mitm") {
        if (/^\s*(ca-passphrase|ca-p12)\s*=/i.test(line) && !line.includes("[已本地脱敏")) {
          const key = line.split("=")[0].trim();
          scrubbedCount++;
          return `${key} = [已本地脱敏抹除证书私钥]`;
        }
      } else if (section.startsWith("wireguard")) {
        if (/^\s*(private-key|preshared-key|peer)\s*=/i.test(line) && !line.includes("[已本地脱敏")) {
          const key = line.split("=")[0].trim();
          scrubbedCount++;
          return `${key} = [已本地脱敏抹除密钥]`;
        }
      }
      return line;
    });
    return { text: out.join("\n"), scrubbedCount };
  }

  // YAML scrubber (Clash / Mihomo / Stash)
  let topSection = "";
  const out = lines.map((line) => {
    const topMatch = line.match(/^([a-zA-Z0-9_-]+)\s*:/);
    if (topMatch) {
      topSection = topMatch[1].toLowerCase();
    }
    let updated = line;
    if (topSection === "proxies" || topSection === "proxy-providers") {
      const secretKeyRe = /\b(server|password|uuid|private-key|preshared-key|auth-str|auth_str|psk|short-id|obfs-password)\s*:\s*(?!\[?"?\[已本地脱敏)([^,\r\n}#]+)/gi;
      updated = updated.replace(secretKeyRe, (_m, k) => {
        scrubbedCount++;
        return `${k}: "[已本地脱敏]"`;
      });
    }
    if (topSection === "proxy-providers" && /\burl\s*:\s*['"]?https?:\/\//i.test(updated)) {
      updated = updated.replace(/\burl\s*:\s*['"]?https?:\/\/[^\s'"#]+['"]?/gi, () => {
        scrubbedCount++;
        return `url: "[已本地脱敏抹除订阅链接]"`;
      });
    }
    return updated;
  });
  return { text: out.join("\n"), scrubbedCount };
}

export const STANDALONE_RULESETS = [
  {
    id: "Siri-Direct",
    bundleKey: "siriDirect",
    routeType: "direct",
    titleZh: "Siri-Direct · 中文 Siri 与来电筛选直连护栏",
    titleEn: "Siri-Direct · Mandarin Siri & Call Screening Guardrail",
    badgeZh: "强制 DIRECT + 真实 IP",
    badgeEn: "Force DIRECT + Real IP",
    descZh: "保护 guzzoni.apple.com 与 *.siri.apple.com 不被海外代理或 Fake-IP 劫持，彻底解决中文 Siri 报错与普通话来电筛选失灵。",
    descEn: "Keeps guzzoni.apple.com & *.siri.apple.com on real-IP DIRECT so Mandarin Siri and Call Screening never break.",
  },
  {
    id: "Apple-PCC",
    bundleKey: "applePCC",
    routeType: "proxy",
    titleZh: "Apple-PCC · 隐私云计算与区域准入",
    titleEn: "Apple-PCC · Private Cloud Compute & Geo-Eligibility",
    badgeZh: "走美区 AI 策略（置顶于 Apple_All 前）",
    badgeEn: "Route to US Proxy (Above Apple_All)",
    descZh: "涵盖 gspe1-ssl 准入校验、mask*.icloud.com 匿名令牌签发、apple-relay.* OHTTP 中继与 Apple 云端推理网关。",
    descEn: "Covers gspe1-ssl eligibility, mask*.icloud.com blind tokens, and apple-relay.* OHTTP relays.",
  },
  {
    id: "Apple-AI-Ext",
    bundleKey: "aiExt",
    routeType: "proxy",
    titleZh: "Apple-AI-Ext · ChatGPT / 视觉智能 / Claude 扩展",
    titleEn: "Apple-AI-Ext · ChatGPT, Visual Lookup & Claude",
    badgeZh: "走美区 AI 策略",
    badgeEn: "Route to US Proxy",
    descZh: "Siri 集成 ChatGPT、相机控制 Visual Intelligence Google 识图以及 Xcode / Claude 智能扩展所需域名。",
    descEn: "Covers Siri ChatGPT integration, Visual Intelligence Google Lens lookup, and Anthropic Claude.",
  },
  {
    id: "Apple-APNs-Direct",
    bundleKey: "apnsDirect",
    routeType: "direct",
    titleZh: "Apple-APNs-Direct · 纯净版推送长连直连",
    titleEn: "Apple-APNs-Direct · Clean APNs Push Direct",
    badgeZh: "可选 DIRECT（无 akadns 误伤）",
    badgeEn: "Optional DIRECT (No akadns collateral)",
    descZh: "仅精确放行 push.apple.com 与 17.249/17.57 等 APNs 推送网段直连，剔除传统规则中容易误伤海外应用的宽泛 akadns.net。",
    descEn: "Routes APNs push CIDRs & push.apple.com to DIRECT without overbroad akadns.net wildcard rules.",
  },
];

export const COMBINED_RULESET_CARD = {
  id: "Apple-AI-All",
  qxAllId: "AppleFlow-All",
  titleZh: "Apple-AI-All · 美区 AI 全量合并规则集",
  titleEn: "Apple-AI-All · Combined US AI Rule-Set",
  qxTitleZh: "AppleFlow-All · 全量合并总规则集（含直连 + 美区全集）",
  qxTitleEn: "AppleFlow-All · Complete All-in-One Filter",
  badgeZh: "合集 · 一条搞定",
  badgeEn: "All-in-One Bundle",
  descZh: "已合并上方「Apple-PCC + Apple-AI-Ext」全部 21 条美区域名（PCC 隐私云计算、ChatGPT、视觉识图、Claude），指向美区策略组即可；中文 Siri 仍需保留上方 Siri-Direct 直连。",
  descEn: "Combines all 21 US proxy rules (Apple-PCC + Apple-AI-Ext) into a single subscription URL. Pair with Siri-Direct above for Mandarin Siri.",
  qxDescZh: "单文件完整包含 Siri 直连、APNs 直连、Apple PCC 与全部外部 AI 扩展（共 34 条，已内置 DIRECT 与 AppleAI 分流标签），远程引用这一条即可。",
  qxDescEn: "Single file containing all 34 rules with built-in DIRECT and AppleAI policy tags.",
};

export function getStandaloneRulesetUrl(format, rulesetId) {
  const base = `${APPLEFLOW_META.rawBase}/rules`;
  if (format === "clash") return `${base}/clash/${rulesetId}.yaml`;
  if (format === "qx") {
    if (rulesetId === "Apple-APNs-Direct") return `${base}/surge/${rulesetId}.list`;
    return `${base}/quantumultx/${rulesetId}.list`;
  }
  if (format === "singbox") {
    if (rulesetId === "Apple-APNs-Direct") return null;
    return `${base}/sing-box/${rulesetId}.json`;
  }
  return `${base}/surge/${rulesetId}.list`;
}

export function renderStandaloneRulesetContent(format, rulesetId, lang = "zh") {
  const noteKey = lang === "en" ? "noteEn" : "noteZh";

  if (rulesetId === "AppleFlow-All" && format === "qx") {
    const qxMap = {
      DOMAIN: "HOST",
      "DOMAIN-SUFFIX": "HOST-SUFFIX",
      "DOMAIN-KEYWORD": "HOST-KEYWORD",
      "IP-CIDR": "IP-CIDR",
      "IP-CIDR6": "IP6-CIDR",
    };
    const lines = [
      "# AppleFlow — AppleFlow-All (Quantumult X All-in-One)",
      ...[...RULE_BUNDLES.siriDirect, ...RULE_BUNDLES.apnsDirect].map((r) => `${qxMap[r.type]},${r.value},DIRECT // ${r[noteKey]}`),
      ...[...RULE_BUNDLES.applePCC, ...RULE_BUNDLES.aiExt].map((r) => `${qxMap[r.type]},${r.value},AppleAI // ${r[noteKey]}`),
    ];
    return { filename: "AppleFlow-All.list", content: lines.join("\n") + "\n" };
  }

  let rules = [];
  let routeType = "proxy";
  if (rulesetId === "Apple-AI-All") {
    rules = [...RULE_BUNDLES.applePCC, ...RULE_BUNDLES.aiExt];
    routeType = "proxy";
  } else {
    const item = STANDALONE_RULESETS.find((r) => r.id === rulesetId) || STANDALONE_RULESETS[0];
    rules = RULE_BUNDLES[item.bundleKey] || [];
    routeType = item.routeType;
  }

  if (format === "clash") {
    const lines = [
      `# AppleFlow — ${rulesetId} (Clash / Mihomo / Stash classical payload)`,
      "payload:",
      ...rules.map((r) =>
        r.type.startsWith("IP-") ? `  - ${r.type},${r.value},no-resolve` : `  - ${r.type},${r.value}`
      ),
    ];
    return { filename: `${rulesetId}.yaml`, content: lines.join("\n") + "\n" };
  }

  if (format === "qx") {
    const qxMap = {
      DOMAIN: "HOST",
      "DOMAIN-SUFFIX": "HOST-SUFFIX",
      "DOMAIN-KEYWORD": "HOST-KEYWORD",
      "IP-CIDR": "IP-CIDR",
      "IP-CIDR6": "IP6-CIDR",
    };
    const tag = routeType === "direct" ? "DIRECT" : "AppleAI";
    const lines = [
      `# AppleFlow — ${rulesetId} (Quantumult X filter_remote)`,
      ...rules.map((r) => `${qxMap[r.type]}, ${r.value}, ${tag}`),
    ];
    return { filename: `${rulesetId}.list`, content: lines.join("\n") + "\n" };
  }

  if (format === "singbox") {
    const ruleObj = {};
    const domains = rules.filter((r) => r.type === "DOMAIN").map((r) => r.value);
    const suffixes = rules.filter((r) => r.type === "DOMAIN-SUFFIX").map((r) => r.value);
    const keywords = rules.filter((r) => r.type === "DOMAIN-KEYWORD").map((r) => r.value);
    const cidrs = rules.filter((r) => r.type === "IP-CIDR").map((r) => r.value);
    if (domains.length) ruleObj.domain = domains;
    if (suffixes.length) ruleObj.domain_suffix = suffixes;
    if (keywords.length) ruleObj.domain_keyword = keywords;
    if (cidrs.length) ruleObj.ip_cidr = cidrs;
    return {
      filename: `${rulesetId}.json`,
      content: JSON.stringify({ version: 2, rules: [ruleObj] }, null, 2) + "\n",
    };
  }

  // Default: surge / loon / shadowrocket .list
  const lines = [
    `# AppleFlow — ${rulesetId} (Surge / Loon / Shadowrocket RULE-SET)`,
    ...rules.map((r) =>
      r.type.startsWith("IP-") ? `${r.type},${r.value},no-resolve // ${r[noteKey]}` : `${r.type},${r.value} // ${r[noteKey]}`
    ),
  ];
  return { filename: `${rulesetId}.list`, content: lines.join("\n") + "\n" };
}

export function generateRulesetSnippet({
  format = "surge",
  policy = "🇺🇸 美国节点",
  includeExt = true,
  includeApns = false,
  lang = "zh",
} = {}) {
  const p = sanitizePolicyName(policy);
  const surgePol = quoteSurgePolicyIfNeeded(p);
  const base = `${APPLEFLOW_META.rawBase}/rules`;

  if (format === "clash") {
    const lines = [
      lang === "en"
        ? "# 1. Add fake-ip-filter under dns: so Mandarin Siri keeps real IP"
        : "# 1. 在 dns: 段加入 fake-ip-filter，防止中文 Siri 被 Fake-IP 劫持",
      "dns:",
      "  fake-ip-filter:",
      ...CLASH_FAKE_IP_FILTER.slice(0, 7).map((d) => `    - "${d}"`),
      "",
      lang === "en" ? "# 2. Declare AppleFlow rule-providers" : "# 2. 声明 AppleFlow 远程规则集 (rule-providers)",
      "rule-providers:",
      "  AppleFlow-Siri-Direct:",
      "    type: http",
      "    behavior: classical",
      "    interval: 86400",
      `    url: "${base}/clash/Siri-Direct.yaml"`,
      "    path: ./ruleset/AppleFlow-Siri-Direct.yaml",
      "  AppleFlow-PCC:",
      "    type: http",
      "    behavior: classical",
      "    interval: 86400",
      `    url: "${base}/clash/Apple-PCC.yaml"`,
      "    path: ./ruleset/AppleFlow-PCC.yaml",
    ];
    if (includeExt) {
      lines.push(
        "  AppleFlow-AI-Ext:",
        "    type: http",
        "    behavior: classical",
        "    interval: 86400",
        `    url: "${base}/clash/Apple-AI-Ext.yaml"`,
        "    path: ./ruleset/AppleFlow-AI-Ext.yaml"
      );
    }
    if (includeApns) {
      lines.push(
        "  AppleFlow-APNs-Direct:",
        "    type: http",
        "    behavior: classical",
        "    interval: 86400",
        `    url: "${base}/clash/Apple-APNs-Direct.yaml"`,
        "    path: ./ruleset/AppleFlow-APNs-Direct.yaml"
      );
    }
    lines.push(
      "",
      lang === "en"
        ? "# 3. Place ABOVE generic Apple / GEOIP,CN rules in rules:"
        : "# 3. 在 rules: 顶部引用（务必放在通用 Apple 直连规则之前！）",
      "rules:",
      "  - RULE-SET,AppleFlow-Siri-Direct,DIRECT",
      ...(includeApns ? ["  - RULE-SET,AppleFlow-APNs-Direct,DIRECT"] : []),
      `  - RULE-SET,AppleFlow-PCC,${p}`,
      ...(includeExt ? [`  - RULE-SET,AppleFlow-AI-Ext,${p}`] : [])
    );
    return { filename: "AppleFlow-RuleProviders.yaml", content: lines.join("\n") + "\n" };
  }

  if (format === "qx") {
    const lines = [
      "[filter_remote]",
      `${base}/quantumultx/Siri-Direct.list, tag=Siri直连护栏, force-policy=direct, update-interval=86400, opt-parser=false, enabled=true`,
      `${base}/quantumultx/Apple-PCC.list, tag=Apple智能PCC, force-policy=${p}, update-interval=86400, opt-parser=false, enabled=true`,
      ...(includeExt
        ? [`${base}/quantumultx/Apple-AI-Ext.list, tag=Apple智能扩展, force-policy=${p}, update-interval=86400, opt-parser=false, enabled=true`]
        : []),
    ];
    return { filename: "AppleFlow-QX-FilterRemote.conf", content: lines.join("\n") + "\n" };
  }

  if (format === "singbox") {
    const ruleSets = [
      { tag: "appleflow-siri-direct", type: "remote", format: "source", url: `${base}/sing-box/Siri-Direct.json`, download_detour: "direct" },
      { tag: "appleflow-pcc", type: "remote", format: "source", url: `${base}/sing-box/Apple-PCC.json`, download_detour: p },
      ...(includeExt
        ? [{ tag: "appleflow-ai-ext", type: "remote", format: "source", url: `${base}/sing-box/Apple-AI-Ext.json`, download_detour: p }]
        : []),
    ];
    const routeRules = [
      { rule_set: ["appleflow-siri-direct"], outbound: "direct" },
      { rule_set: ["appleflow-pcc", ...(includeExt ? ["appleflow-ai-ext"] : [])], outbound: p },
    ];
    return {
      filename: "AppleFlow-Singbox-RuleSet.json",
      content: JSON.stringify({ route: { rules: routeRules, rule_set: ruleSets } }, null, 2) + "\n",
    };
  }

  // Surge / Loon / Shadowrocket
  const lines = [
    "[General]",
    "skip-proxy = %APPEND% guzzoni.apple.com",
    `always-real-ip = %APPEND% ${REAL_IP_LIST.join(", ")}`,
    "",
    "[Rule]",
    lang === "en"
      ? "# Place these RULE-SET lines ABOVE any Apple_All / CN catch-all rules:"
      : "# 请将以下 RULE-SET 放在任何 Apple_All / Apple 兜底直连规则【之前】：",
    `RULE-SET,${base}/surge/Siri-Direct.list,DIRECT`,
    ...(includeApns ? [`RULE-SET,${base}/surge/Apple-APNs-Direct.list,DIRECT,no-resolve`] : []),
    `RULE-SET,${base}/surge/Apple-PCC.list,${surgePol}`,
    ...(includeExt ? [`RULE-SET,${base}/surge/Apple-AI-Ext.list,${surgePol}`] : []),
  ];
  return { filename: "AppleFlow-RuleSet-Snippet.conf", content: lines.join("\n") + "\n" };
}
