# Changelog

All notable changes to **AppleFlow** are documented in this file.

## [v1.0.1](https://github.com/Kianuni/AppleFlow/releases/tag/v1.0.1) — 2026-11-14

### 分流规则升级 (Routing Rules)
- **补齐 `Apple-PCC` 盲签名与相册「高质量消除」闭环**：新增 `*.issuer.apple.com`（PCC 盲签名令牌签发）与 `*.ropes.apple.com`（PCC ROPES 隐私推理网关），配合 `mask*.icloud.com`、`ss-cleanup-proxy-prod.us-east-1m.app.apple.com` 与 `*.app.apple.com`，彻底解决因规则被 `Apple_All` 截胡直连导致的相册高质量消除 `PrivateCloudComputeError Code=32033` 报错。
- **全面升级 `Apple-AI-Ext`（扩展至 25 条精选生产域名）**：
  - **OpenAI / ChatGPT**：新增 ChatGPT 高级实时语音 (Advanced Voice) WebRTC 域名（`chatgpt.livekit.cloud`、`host.livekit.cloud`、`turn.livekit.cloud`）、`sora.com`、`chat.com`、`oaistatsig.com` 及 `openai.com.cdn.cloudflare.net`；
  - **Anthropic / Claude**：新增 `claudeusercontent.com`（Claude Artifacts 代码/网页预览沙盒与附件渲染）及 `claude.com`；
  - **Google 视觉识图与 Gemini（精准去误伤）**：**移除宽泛的 `DOMAIN-SUFFIX,googleapis.com` 与 `DOMAIN-SUFFIX,gstatic.com`**（避免劫持 YouTube、Google 地图、网页字体等日常请求去美区），改为仅保留 `lens.google.com` 并精准收录锁美区的 **Gemini / AI Studio / DeepMind** 核心域名（`gemini.google.com`、`gemini.gstatic.com`、`generativelanguage.googleapis.com`、`proactivebackend-pa.googleapis.com`、`robinfrontend-pa.googleapis.com`、`aistudio.google.com`、`alkalimakersuite-pa.clients6.google.com`、`deepmind.google`）。
- **补齐 IPv6 推送网段同步**：同步在线工作台 `Apple-APNs-Direct` 规则预览与 Sing-box 导出的 4 条苹果官方 APNs `IP-CIDR6` 子网。

### 在线工作台与配置体检 (Web Studio & Config Doctor)
- **新增代理节点层 `UDP / QUIC` 能力排雷**：Config Doctor 现可直接在本地检测节点参数级的 QUIC/UDP 隐患（Surge 的 `udp-relay=false`、`block-quic=on`、纯 `HTTP/HTTPS` 代理协议、Shadowsocks/SOCKS5 漏写 `udp-relay=true`；以及 Clash / Mihomo / Stash YAML 节点的 `udp: false` 或漏声明 `udp: true`），并在本地内存自动脱敏抹除节点地址/密码时无损保留布尔检测标志。
- **优化在线出口探针**：将仅支持客户端双向证书 (mTLS) 的私有端点替换为 `apple-relay.fastly-edge.com`，消除 Safari 浏览器端假超时误报。
- **排障指南完善**：补充相册「高质量消除」`Code=32033` / `QUIC-BLOCK` 排查清单与自建 VPS 防火墙 UDP 443 放行说明。

**Full Changelog**: https://github.com/Kianuni/AppleFlow/compare/v1.0.0...v1.0.1

---

## [v1.0.0](https://github.com/Kianuni/AppleFlow/releases/tag/v1.0.0) — 2026-11-13

- 首个正式版本发布：专为 iOS / iPadOS / macOS 26–27 打造的 **100% 零 MitM** Apple 智能与中文 Siri 极简分流方案。
- 支持 Surge 5/6、Loon、Shadowrocket、Stash、Mihomo (Clash Meta)、Quantumult X、Sing-box 7 大客户端模块与正交规则集。
- 上线纯本地自动脱敏「配置体检 (Config Doctor)」与四通道实际出口区域探针（https://kianuni.github.io/AppleFlow/）。
