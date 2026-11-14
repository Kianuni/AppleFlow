#!/usr/bin/env python3
"""
AppleFlow Rule & Module Builder
Generates and validates zero-MitM routing rule-sets and client modules across:
  - Surge (.sgmodule & RULE-SET .list)
  - Loon (.plugin)
  - Shadowrocket (.module)
  - Stash (.stoverride)
  - Mihomo / Clash Meta (.yaml rule-providers & mixin snippet)
  - Quantumult X (.list)
  - Sing-box v1.10+ (.json rule-set source v2)
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPO_RAW = "https://raw.githubusercontent.com/Kianuni/AppleFlow/main"
HOMEPAGE = "https://kianuni.github.io/AppleFlow/"
REPO_URL = "https://github.com/Kianuni/AppleFlow"
VERSION = "1.0.1"

# 1. Siri & Mandarin Call Screening — MUST go DIRECT with real IP (never proxy, never Fake-IP)
SIRI_DIRECT_RULES: list[tuple[str, str, str]] = [
    ("DOMAIN-SUFFIX", "guzzoni.apple.com", "Siri & 普通话来电筛选核心语音网关（严禁代理或 Fake-IP）"),
    ("DOMAIN-SUFFIX", "siri.apple.com", "Siri 语音服务域名"),
    ("DOMAIN", "dejavu.apple.com", "Siri 语音识别辅助服务"),
    ("DOMAIN", "sequoia.apple.com", "Siri 自然语言服务"),
    ("DOMAIN-SUFFIX", "smoot.apple.com", "Spotlight / Siri 搜索建议（切勿开启旧版 MitM）"),
]

# 2. Apple Intelligence Private Cloud Compute (PCC), OHTTP Relay & Geo-Eligibility
APPLE_PCC_RULES: list[tuple[str, str, str]] = [
    ("DOMAIN", "gspe1-ssl.ls.apple.com", "Apple 智能区域与定位准入校验（iOS 27.2+ 严禁开启 MitM）"),
    ("DOMAIN-SUFFIX", "issuer.apple.com", "PCC 盲签名令牌签发（inference / waitlist，严禁直连泄漏 CN IP）"),
    ("DOMAIN-SUFFIX", "ropes.apple.com", "PCC ROPES 隐私推理传输网关"),
    ("DOMAIN", "mask-api.icloud.com", "PCC / 专用代理匿名令牌签发"),
    ("DOMAIN", "mask.icloud.com", "PCC OHTTP 盲化网关"),
    ("DOMAIN", "mask-h2.icloud.com", "PCC OHTTP HTTP/2 回退网关"),
    ("DOMAIN", "ss-cleanup-proxy-prod.us-east-1m.app.apple.com", "相册高质量消除云端推理专用节点"),
    ("DOMAIN-SUFFIX", "app.apple.com", "相册高质量消除与生成式云端服务接口"),
    ("DOMAIN-SUFFIX", "apple-relay.apple.com", "Apple 智能 PCC 隐私云计算中继（请勿拦截 UDP 443 / QUIC）"),
    ("DOMAIN-SUFFIX", "apple-relay.cloudflare.com", "PCC Cloudflare OHTTP 中继"),
    ("DOMAIN-SUFFIX", "apple-relay.fastly-edge.com", "PCC Fastly OHTTP 中继"),
    ("DOMAIN-SUFFIX", "apple-relay.akamaized.net", "PCC Akamai OHTTP 中继"),
    ("DOMAIN-SUFFIX", "cp4.cloudflare.com", "Apple 隐私中继辅助端点"),
]

# 3. Siri External AI Extensions, Visual Intelligence & Major AI Suites (OpenAI + Lens/Gemini + Claude)
APPLE_AI_EXT_RULES: list[tuple[str, str, str]] = [
    # OpenAI / ChatGPT / Advanced Voice / Sora
    ("DOMAIN-SUFFIX", "openai.com", "Siri ChatGPT 扩展核心接口"),
    ("DOMAIN-SUFFIX", "chatgpt.com", "Siri ChatGPT 扩展与账户登录"),
    ("DOMAIN-SUFFIX", "chat.com", "ChatGPT 官方短域名"),
    ("DOMAIN-SUFFIX", "sora.com", "OpenAI Sora 视频生成服务"),
    ("DOMAIN-SUFFIX", "oaistatic.com", "OpenAI 静态资源"),
    ("DOMAIN-SUFFIX", "oaiusercontent.com", "ChatGPT 生图与多模态附件"),
    ("DOMAIN-SUFFIX", "oaistatsig.com", "OpenAI 客户端特性开关校验"),
    ("DOMAIN-SUFFIX", "openai.com.cdn.cloudflare.net", "OpenAI Cloudflare 边缘加速"),
    ("DOMAIN", "openai-api.arkoselabs.com", "OpenAI 安全校验"),
    ("DOMAIN-SUFFIX", "chatgpt.livekit.cloud", "ChatGPT 高级实时语音 WebRTC 信令"),
    ("DOMAIN-SUFFIX", "host.livekit.cloud", "ChatGPT 高级实时语音媒体节点"),
    ("DOMAIN-SUFFIX", "turn.livekit.cloud", "ChatGPT 高级实时语音 TURN 中继"),
    # Google Visual Intelligence (Lens) & US-Locked Gemini Core (no overbroad googleapis/gstatic suffix)
    ("DOMAIN", "lens.google.com", "视觉智能 Google Lens 识图入口"),
    ("DOMAIN-SUFFIX", "gemini.google.com", "Google Gemini 网页与客户端"),
    ("DOMAIN", "gemini.gstatic.com", "Google Gemini 专用静态资源"),
    ("DOMAIN", "generativelanguage.googleapis.com", "Google Gemini 生成式 API"),
    ("DOMAIN", "proactivebackend-pa.googleapis.com", "Google Gemini App 后端接口"),
    ("DOMAIN", "robinfrontend-pa.googleapis.com", "Google Gemini 助手前端接口"),
    ("DOMAIN", "aistudio.google.com", "Google AI Studio 开发台"),
    ("DOMAIN", "alkalimakersuite-pa.clients6.google.com", "Google AI Studio 核心接口"),
    ("DOMAIN-SUFFIX", "deepmind.google", "Google DeepMind 服务"),
    # Anthropic / Claude & Artifacts Sandbox
    ("DOMAIN-SUFFIX", "anthropic.com", "Claude / Xcode Intelligence 扩展"),
    ("DOMAIN-SUFFIX", "claude.ai", "Claude AI 服务"),
    ("DOMAIN-SUFFIX", "claude.com", "Claude 官方主域"),
    ("DOMAIN-SUFFIX", "claudeusercontent.com", "Claude Artifacts 预览沙盒与附件渲染"),
]

# 4. Clean APNs & Apple ID Identity Direct Rules (without akadns.net over-matching)
APNS_DIRECT_RULES: list[tuple[str, str, str]] = [
    ("DOMAIN", "identity.apple.com", "Apple ID 设备身份认证直连"),
    ("DOMAIN-SUFFIX", "push.apple.com", "APNs 系统推送通知直连"),
    ("DOMAIN-KEYWORD", "apple.com.edgekey.net", "Apple Akamai 边缘直连"),
    ("IP-CIDR", "17.249.0.0/16", "Apple APNs IPv4 号段"),
    ("IP-CIDR", "17.252.0.0/16", "Apple APNs IPv4 号段"),
    ("IP-CIDR", "17.57.144.0/22", "Apple APNs IPv4 号段"),
    ("IP-CIDR", "17.188.128.0/18", "Apple APNs IPv4 号段"),
    ("IP-CIDR", "17.188.20.0/23", "Apple APNs IPv4 号段"),
    ("IP-CIDR6", "2403:300:a42::/48", "Apple APNs IPv6 号段"),
    ("IP-CIDR6", "2403:300:a51::/48", "Apple APNs IPv6 号段"),
    ("IP-CIDR6", "2620:149:a44::/48", "Apple APNs IPv6 号段"),
    ("IP-CIDR6", "2a01:b740:a42::/48", "Apple APNs IPv6 号段"),
]

REAL_IP_DOMAINS = [
    "guzzoni.apple.com",
    "*.guzzoni.apple.com",
    "*.siri.apple.com",
    "dejavu.apple.com",
    "sequoia.apple.com",
    "*.smoot.apple.com",
    "*.push.apple.com",
]

FAKE_IP_FILTER_CLASH = [
    "guzzoni.apple.com",
    "+.guzzoni.apple.com",
    "+.siri.apple.com",
    "dejavu.apple.com",
    "sequoia.apple.com",
    "+.smoot.apple.com",
    "+.push.apple.com",
    "gspe1-ssl.ls.apple.com",
    "+.issuer.apple.com",
    "+.ropes.apple.com",
    "mask-api.icloud.com",
    "mask.icloud.com",
    "mask-h2.icloud.com",
    "+.app.apple.com",
    "+.apple-relay.apple.com",
    "+.apple-relay.cloudflare.com",
    "+.apple-relay.fastly-edge.com",
    "+.apple-relay.akamaized.net",
]


def render_surge_list(title: str, note: str, rules: list[tuple[str, str, str]]) -> str:
    lines = [
        f"# AppleFlow — {title}",
        f"# {note}",
        f"# Homepage: {HOMEPAGE}",
        f"# Version: {VERSION}",
        "",
    ]
    for rtype, val, comment in rules:
        if rtype in ("IP-CIDR", "IP-CIDR6"):
            lines.append(f"{rtype},{val},no-resolve // {comment}")
        else:
            lines.append(f"{rtype},{val} // {comment}")
    return "\n".join(lines) + "\n"


def render_clash_yaml(title: str, rules: list[tuple[str, str, str]]) -> str:
    lines = [
        f"# AppleFlow — {title}",
        f"# Homepage: {HOMEPAGE}",
        "payload:",
    ]
    for rtype, val, comment in rules:
        if rtype in ("IP-CIDR", "IP-CIDR6"):
            lines.append(f"  - {rtype},{val},no-resolve # {comment}")
        else:
            lines.append(f"  - {rtype},{val} # {comment}")
    return "\n".join(lines) + "\n"


def render_qx_list(title: str, policy: str, rules: list[tuple[str, str, str]]) -> str:
    qx_map = {
        "DOMAIN": "HOST",
        "DOMAIN-SUFFIX": "HOST-SUFFIX",
        "DOMAIN-KEYWORD": "HOST-KEYWORD",
        "IP-CIDR": "IP-CIDR",
        "IP-CIDR6": "IP6-CIDR",
    }
    lines = [
        f"# AppleFlow — {title} (Quantumult X)",
        f"# Homepage: {HOMEPAGE}",
        "",
    ]
    for rtype, val, comment in rules:
        qtype = qx_map[rtype]
        lines.append(f"{qtype},{val},{policy} // {comment}")
    return "\n".join(lines) + "\n"


def render_singbox_json(rules: list[tuple[str, str, str]]) -> str:
    domain: list[str] = []
    domain_suffix: list[str] = []
    domain_keyword: list[str] = []
    ip_cidr: list[str] = []
    for rtype, val, _ in rules:
        if rtype == "DOMAIN":
            domain.append(val)
        elif rtype == "DOMAIN-SUFFIX":
            domain_suffix.append(val)
        elif rtype == "DOMAIN-KEYWORD":
            domain_keyword.append(val)
        elif rtype in ("IP-CIDR", "IP-CIDR6"):
            ip_cidr.append(val)
    rule_obj: dict[str, list[str]] = {}
    if domain:
        rule_obj["domain"] = domain
    if domain_suffix:
        rule_obj["domain_suffix"] = domain_suffix
    if domain_keyword:
        rule_obj["domain_keyword"] = domain_keyword
    if ip_cidr:
        rule_obj["ip_cidr"] = ip_cidr
    doc = {"version": 2, "rules": [rule_obj]}
    return json.dumps(doc, indent=2, ensure_ascii=False) + "\n"


def render_surge_module(include_ext: bool) -> str:
    name = "AppleFlow · Apple 智能与中文 Siri 全套分流" if include_ext else "AppleFlow · Apple 智能与中文 Siri 核心分流"
    desc = (
        "零 MitM 新一代 Apple 智能分流：锁定中文 Siri 与普通话来电筛选 (guzzoni) 真实 IP 直连，"
        "同时将 Apple Intelligence PCC 隐私云计算与区域准入置顶分流至指定美区策略组（默认 PROXY，可在模块参数中自定义）。"
    )
    lines = [
        f"#!name={name}",
        f"#!desc={desc}",
        f"#!author=Kianuni[{REPO_URL}]",
        f"#!homepage={HOMEPAGE}",
        "#!category= AppleFlow",
        f"#!version={VERSION}",
        "#!arguments=Policy:PROXY",
        "#!arguments-desc=Policy：填写你配置中的低延迟美国策略组或节点名称（例如 PROXY、🇺🇸 美国节点、📟 智能助理、AI）。请确保该节点支持 UDP / QUIC 且勿对 apple-relay 启用 REJECT。",
        "",
        "[General]",
        "skip-proxy = %APPEND% guzzoni.apple.com",
        f"always-real-ip = %APPEND% {', '.join(REAL_IP_DOMAINS)}",
        "",
        "[Rule]",
        "# 1. 中文 Siri 与普通话「询问来电原因」核心语音网关（必须真实 IP 直连，严禁走海外代理）",
    ]
    for rtype, val, _ in SIRI_DIRECT_RULES:
        lines.append(f"{rtype},{val},DIRECT")
    lines.append("")
    lines.append("# 2. Apple Intelligence 区域准入与 PCC 隐私云计算（置顶防 Apple_All 抢行）")
    for rtype, val, _ in APPLE_PCC_RULES:
        lines.append(f"{rtype},{val},{{{{{{Policy}}}}}}")
    if include_ext:
        lines.append("")
        lines.append("# 3. Siri ChatGPT 扩展、Claude 与视觉智能 Google 识图")
        for rtype, val, _ in APPLE_AI_EXT_RULES:
            lines.append(f"{rtype},{val},{{{{{{Policy}}}}}}")
    return "\n".join(lines) + "\n"


def render_loon_plugin() -> str:
    lines = [
        "#!name = AppleFlow · Apple 智能与中文 Siri 分流",
        "#!desc = 零 MitM 极简分流：保障中文 Siri 与普通话来电筛选真实 IP 直连，将 Apple Intelligence PCC 与 ChatGPT/视觉智能置顶分流至美区策略组。",
        f"#!openUrl = {HOMEPAGE}",
        f"#!author = Kianuni[{REPO_URL}]",
        f"#!homepage = {REPO_URL}",
        "#!select = 美区AI策略组, PROXY, 🇺🇸 美国节点, Apple Intelligence, AI",
        "#!system = ios, ipados, macos",
        f"#!version = {VERSION}",
        "",
        "[General]",
        "skip-proxy = guzzoni.apple.com",
        f"real-ip = {', '.join(REAL_IP_DOMAINS)}",
        "",
        "[Rule]",
        "# 1. 中文 Siri 与普通话来电筛选直连",
    ]
    for rtype, val, _ in SIRI_DIRECT_RULES:
        lines.append(f"{rtype}, {val}, DIRECT")
    lines.append("")
    lines.append("# 2. Apple Intelligence PCC 隐私云计算与区域准入")
    for rtype, val, _ in APPLE_PCC_RULES:
        lines.append(f"{rtype}, {val}, 美区AI策略组")
    lines.append("")
    lines.append("# 3. Siri ChatGPT 扩展与视觉智能")
    for rtype, val, _ in APPLE_AI_EXT_RULES:
        lines.append(f"{rtype}, {val}, 美区AI策略组")
    return "\n".join(lines) + "\n"


def render_shadowrocket_module() -> str:
    lines = [
        "#!name=AppleFlow · Apple 智能与中文 Siri 分流",
        "#!desc=零 MitM 极简分流：中文 Siri 与普通话来电筛选真实 IP 直连 + Apple Intelligence PCC / ChatGPT / 视觉智能走 PROXY 美区节点。",
        f"#!homepage={HOMEPAGE}",
        "",
        "[General]",
        "skip-proxy = %APPEND% guzzoni.apple.com",
        f"always-real-ip = %APPEND% {', '.join(REAL_IP_DOMAINS)}",
        "",
        "[Rule]",
    ]
    for rtype, val, _ in SIRI_DIRECT_RULES:
        lines.append(f"{rtype},{val},DIRECT")
    for rtype, val, _ in APPLE_PCC_RULES:
        lines.append(f"{rtype},{val},PROXY")
    for rtype, val, _ in APPLE_AI_EXT_RULES:
        lines.append(f"{rtype},{val},PROXY")
    return "\n".join(lines) + "\n"


def render_stash_override() -> str:
    lines = [
        'name: "AppleFlow · Apple 智能与中文 Siri 分流"',
        'desc: "零 MitM 极简分流：锁定中文 Siri 与普通话来电筛选真实 IP 直连，将 Apple Intelligence PCC 与 ChatGPT/视觉智能置顶分流至 PROXY（请确保美区节点开启 udp: true）。"',
        f'homepage: "{HOMEPAGE}"',
        "",
        "dns:",
        "  fake-ip-filter:",
    ]
    for item in FAKE_IP_FILTER_CLASH:
        lines.append(f'    - "{item}"')
    lines += [
        "",
        "rules:",
        "  # 1. 中文 Siri 与普通话来电筛选强制直连",
    ]
    for rtype, val, _ in SIRI_DIRECT_RULES:
        lines.append(f"  - {rtype},{val},DIRECT")
    lines.append("  # 2. Apple Intelligence PCC 与区域准入（置顶防 GEOSITE,apple,DIRECT 抢行）")
    for rtype, val, _ in APPLE_PCC_RULES:
        lines.append(f"  - {rtype},{val},PROXY")
    lines.append("  # 3. Siri ChatGPT 扩展与视觉智能")
    for rtype, val, _ in APPLE_AI_EXT_RULES:
        lines.append(f"  - {rtype},{val},PROXY")
    return "\n".join(lines) + "\n"


def render_mihomo_mixin() -> str:
    lines = [
        "# AppleFlow — Mihomo (Clash Meta) 覆写 / 混入模板",
        f"# 在线自定义策略组名生成器：{HOMEPAGE}",
        "# 注意：请将下方 PROXY 替换为你自己的低延迟美国策略组名称（且确保节点开启 udp: true）",
        "",
        "dns:",
        "  fake-ip-filter:",
    ]
    for item in FAKE_IP_FILTER_CLASH:
        lines.append(f'    - "{item}"')
    lines += [
        "",
        "rule-providers:",
        "  appleflow-siri-direct:",
        "    type: http",
        "    behavior: classical",
        "    interval: 86400",
        f"    url: {REPO_RAW}/rules/clash/Siri-Direct.yaml",
        "    path: ./ruleset/appleflow-siri-direct.yaml",
        "  appleflow-pcc:",
        "    type: http",
        "    behavior: classical",
        "    interval: 86400",
        f"    url: {REPO_RAW}/rules/clash/Apple-PCC.yaml",
        "    path: ./ruleset/appleflow-pcc.yaml",
        "  appleflow-ai-ext:",
        "    type: http",
        "    behavior: classical",
        "    interval: 86400",
        f"    url: {REPO_RAW}/rules/clash/Apple-AI-Ext.yaml",
        "    path: ./ruleset/appleflow-ai-ext.yaml",
        "",
        "# 请置于 GEOSITE,apple,DIRECT / GEOIP,CN,DIRECT 之前：",
        "rules:",
        "  - RULE-SET,appleflow-siri-direct,DIRECT",
        "  - RULE-SET,appleflow-pcc,PROXY",
        "  - RULE-SET,appleflow-ai-ext,PROXY",
    ]
    return "\n".join(lines) + "\n"


def render_qx_combined_all() -> str:
    qx_map = {
        "DOMAIN": "HOST",
        "DOMAIN-SUFFIX": "HOST-SUFFIX",
        "DOMAIN-KEYWORD": "HOST-KEYWORD",
        "IP-CIDR": "IP-CIDR",
        "IP-CIDR6": "IP6-CIDR",
    }
    lines = [
        "# AppleFlow — All-in-One Combined Rules (Quantumult X)",
        f"# Homepage: {HOMEPAGE}",
        "",
        "# 1. Siri & Mandarin Call Screening -> DIRECT",
    ]
    for rtype, val, comment in SIRI_DIRECT_RULES:
        lines.append(f"{qx_map[rtype]},{val},DIRECT // {comment}")
    lines.append("")
    lines.append("# 2. Clean APNs Push -> DIRECT")
    for rtype, val, comment in APNS_DIRECT_RULES:
        lines.append(f"{qx_map[rtype]},{val},DIRECT // {comment}")
    lines.append("")
    lines.append("# 3. Apple Intelligence PCC & AI Extensions -> AppleAI")
    for rtype, val, comment in APPLE_PCC_RULES + APPLE_AI_EXT_RULES:
        lines.append(f"{qx_map[rtype]},{val},AppleAI // {comment}")
    return "\n".join(lines) + "\n"


def expected_outputs() -> dict[Path, str]:
    ai_all_rules = APPLE_PCC_RULES + APPLE_AI_EXT_RULES
    return {
        # Surge RULE-SETs
        ROOT / "rules/surge/Siri-Direct.list": render_surge_list(
            "Siri & Mandarin Call Screening Direct Rules",
            "必须置于代理规则与 Apple 兜底规则之前，并配合 skip-proxy + always-real-ip 使用",
            SIRI_DIRECT_RULES,
        ),
        ROOT / "rules/surge/Apple-PCC.list": render_surge_list(
            "Apple Intelligence Private Cloud Compute (PCC)",
            "必须置于 Apple_All / icloud.com 直连规则之前，走支持 UDP/QUIC 的低延迟美区策略组",
            APPLE_PCC_RULES,
        ),
        ROOT / "rules/surge/Apple-AI-Ext.list": render_surge_list(
            "Siri ChatGPT Extension & Visual Intelligence",
            "Siri 外部大模型扩展与相机视觉智能 Google 识图接口",
            APPLE_AI_EXT_RULES,
        ),
        ROOT / "rules/surge/Apple-APNs-Direct.list": render_surge_list(
            "Clean APNs & Identity Direct Rules",
            "纯净版苹果推送与身份直连规则（已剔除会误伤第三方网站的 akadns.net）",
            APNS_DIRECT_RULES,
        ),
        ROOT / "rules/surge/Apple-AI-All.list": render_surge_list(
            "All-in-One Apple Intelligence & Extensions (PCC + ChatGPT + Lens + Claude)",
            "合并美区总规则集：包含 Apple PCC 隐私云计算与全部外部 AI 扩展，置于 Apple_All 之前并指向美区策略组",
            ai_all_rules,
        ),
        # Clash / Mihomo rule-providers
        ROOT / "rules/clash/Siri-Direct.yaml": render_clash_yaml("Siri & Mandarin Call Screening Direct", SIRI_DIRECT_RULES),
        ROOT / "rules/clash/Apple-PCC.yaml": render_clash_yaml("Apple Intelligence PCC & Cloud Tools", APPLE_PCC_RULES),
        ROOT / "rules/clash/Apple-AI-Ext.yaml": render_clash_yaml("Siri ChatGPT & Visual Intelligence", APPLE_AI_EXT_RULES),
        ROOT / "rules/clash/Apple-APNs-Direct.yaml": render_clash_yaml("Clean APNs & Identity Direct", APNS_DIRECT_RULES),
        ROOT / "rules/clash/Apple-AI-All.yaml": render_clash_yaml("All-in-One Apple Intelligence & Extensions", ai_all_rules),
        # Quantumult X
        ROOT / "rules/quantumultx/Siri-Direct.list": render_qx_list("Siri Direct", "DIRECT", SIRI_DIRECT_RULES),
        ROOT / "rules/quantumultx/Apple-PCC.list": render_qx_list("Apple Intelligence PCC", "AppleAI", APPLE_PCC_RULES),
        ROOT / "rules/quantumultx/Apple-AI-Ext.list": render_qx_list("Siri Extensions & Visual Intelligence", "AppleAI", APPLE_AI_EXT_RULES),
        ROOT / "rules/quantumultx/Apple-AI-All.list": render_qx_list("All-in-One Apple Intelligence & Extensions", "AppleAI", ai_all_rules),
        ROOT / "rules/quantumultx/AppleFlow-All.list": render_qx_combined_all(),
        # Sing-box v2 JSON
        ROOT / "rules/sing-box/Siri-Direct.json": render_singbox_json(SIRI_DIRECT_RULES),
        ROOT / "rules/sing-box/Apple-PCC.json": render_singbox_json(APPLE_PCC_RULES),
        ROOT / "rules/sing-box/Apple-AI-Ext.json": render_singbox_json(APPLE_AI_EXT_RULES),
        ROOT / "rules/sing-box/Apple-AI-All.json": render_singbox_json(ai_all_rules),
        # Client Modules
        ROOT / "modules/AppleFlow.sgmodule": render_surge_module(include_ext=False),
        ROOT / "modules/AppleFlow-Full.sgmodule": render_surge_module(include_ext=True),
        ROOT / "modules/AppleFlow.plugin": render_loon_plugin(),
        ROOT / "modules/AppleFlow.module": render_shadowrocket_module(),
        ROOT / "modules/AppleFlow.stoverride": render_stash_override(),
        ROOT / "modules/AppleFlow-Mihomo.yaml": render_mihomo_mixin(),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Build or validate AppleFlow rules and modules.")
    parser.add_argument("--check", action="store_true", help="Verify generated files match disk without writing.")
    args = parser.parse_args()

    outputs = expected_outputs()
    stale: list[Path] = []
    for path, content in outputs.items():
        if args.check:
            if not path.exists() or path.read_text(encoding="utf-8") != content:
                stale.append(path)
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")

    if args.check:
        if stale:
            print("Out-of-sync generated files:", file=sys.stderr)
            for p in stale:
                print(f"  - {p.relative_to(ROOT)}", file=sys.stderr)
            return 1
        print(f"OK: all {len(outputs)} generated rule-sets and modules are up to date.")
        return 0

    print(f"Generated {len(outputs)} rule-sets and client modules.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
