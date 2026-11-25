<h1 align="center"> AppleFlow</h1>

<p align="center">
  <strong>零 MitM 的 Apple 智能、PCC 相册「高质量消除」与中文 Siri 极简分流方案 & 本地配置体检台</strong><br>
  适用于外版（港/美/日/台）及已解锁国行 iOS / iPadOS / macOS 26–27 设备
</p>

<p align="center">
  <a href="https://kianuni.github.io/AppleFlow/"><strong>打开在线工作台（模块安装 · 规则集 · 本地脱敏体检 · 出口探针）</strong></a> ·
  <a href="README_EN.md">English</a> ·
  <a href="CHANGELOG.md">更新日志</a> ·
  <a href="https://github.com/Kianuni/Erosion-CN">Erosion-CN (国行解锁配套工具)</a> ·
  <a href="https://github.com/Kianuni/AppleLens">AppleLens (macOS 观测与排障台)</a> ·
  <a href="https://kianuni.github.io/Lokey-Audit/">Lokey (零联网全拼/双拼输入法)</a>
</p>

---

## 为什么需要 AppleFlow？

早年流传的许多苹果分流教程与旧版解密模块在 **iOS / macOS 26–27** 时代已经出现严重水土不服：

1. **定位与 Siri 接口启用强证书固定**：自 iOS 27.2 起苹果对 `gspe1-ssl.ls.apple.com` 等核心接口启用了强证书固定（Certificate Pinning），若继续对该域名或 `*.smoot.apple.com` 开启 MitM 解密重写，会导致区域准入断连、Spotlight 搜索报错。
2. **中文 Siri 被代理或 Fake-IP 误伤**：只要 `guzzoni.apple.com` 或 `*.siri.apple.com` 落入海外节点（或被 VIF DNS 解析为 `198.18.x.x` Fake-IP），中文普通话 Siri 就会立即报错「我碰到了一点问题。请再试一次。」。
3. **`Apple_All` 抢行与 `QUIC-BLOCK` 导致相册「高质量消除」报 `Code=32033`**：市面通用 `AI.list` 往往仅包含 5 条 `apple-relay.*`，漏掉了盲签名签发与云端推理网关（`*.issuer.apple.com`、`ropes.apple.com`、`mask*.icloud.com`、`*.app.apple.com`），导致其被下方的 `Apple_All -> DIRECT` 截胡直连、泄漏大陆 IP 秒拒；同时节点未放行 UDP 443（触发 `QUIC-BLOCK`）也会中断 OHTTP 隐私计算握手。

**AppleFlow** 完全摒弃 HTTPS 解密（**100% 零 MitM、零脚本、零额外耗电**），用最小化的精确域名集同时保障：
- **中文普通话 Siri 秒回不报错** + **普通话「询问来电原因」来电筛选完整保留**；
- **Apple Intelligence 书写工具、相册「高质量消除」与扩图重构、PCC 隐私云计算、Siri ChatGPT 扩展与视觉智能稳定可用**；
- **国区 iCloud 同步与 APNs 推送不受任何拖累**。

---

## 一键模块安装（零 MitM）

> 在线一键唤起客户端安装、配置冲突自动脱敏排雷与实际出口区域检测，请访问 **[AppleFlow 在线工作台](https://kianuni.github.io/AppleFlow/)**。

| 客户端 | 推荐订阅地址 | 说明 |
| :--- | :--- | :--- |
| **Surge 5 / 6（全套推荐）** | `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow-Full.sgmodule` | 支持模块参数 `Policy` 自定义美区策略组名（默认 `PROXY`） |
| **Surge 5 / 6（核心精简版）** | `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow.sgmodule` | 仅含 Siri 直连 + Apple 原生 PCC，适合自维护 OpenAI/Google 规则的用户 |
| **Loon** | `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow.plugin` | 规则使用标准 `PROXY`，导入后在插件配置页选择美区策略组 |
| **Shadowrocket (小火箭)** | `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow.module` | 默认指向 `PROXY` |
| **Stash** | `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow.stoverride` | 自动注入 `fake-ip-filter` 与置顶规则 |
| **Mihomo / Clash Meta** | [`modules/AppleFlow-Mihomo.yaml`](modules/AppleFlow-Mihomo.yaml) | 含 `fake-ip-filter` 与 `rule-providers` 覆写模板 |

---

## 分流规则集（按需细分 & 合并总集）

请置于 **`Apple_All` / `GEOSITE,apple` / `GEOIP,CN` 之前**：

| 作用与推荐出口 | Surge / Loon `RULE-SET` | Mihomo / Clash `rule-provider` | Sing-box `v2 JSON` | Quantumult X |
| :--- | :--- | :--- | :--- | :--- |
| **1. 中文 Siri 强制直连 (`DIRECT`)** | [`rules/surge/Siri-Direct.list`](rules/surge/Siri-Direct.list) | [`rules/clash/Siri-Direct.yaml`](rules/clash/Siri-Direct.yaml) | [`rules/sing-box/Siri-Direct.json`](rules/sing-box/Siri-Direct.json) | [`rules/quantumultx/Siri-Direct.list`](rules/quantumultx/Siri-Direct.list) |
| **2. Apple PCC 与高质量消除 (`美区`)** | [`rules/surge/Apple-PCC.list`](rules/surge/Apple-PCC.list) | [`rules/clash/Apple-PCC.yaml`](rules/clash/Apple-PCC.yaml) | [`rules/sing-box/Apple-PCC.json`](rules/sing-box/Apple-PCC.json) | [`rules/quantumultx/Apple-PCC.list`](rules/quantumultx/Apple-PCC.list) |
| **3. ChatGPT / Gemini / Claude 与视觉识图 (`美区`)** | [`rules/surge/Apple-AI-Ext.list`](rules/surge/Apple-AI-Ext.list) | [`rules/clash/Apple-AI-Ext.yaml`](rules/clash/Apple-AI-Ext.yaml) | [`rules/sing-box/Apple-AI-Ext.json`](rules/sing-box/Apple-AI-Ext.json) | [`rules/quantumultx/Apple-AI-Ext.list`](rules/quantumultx/Apple-AI-Ext.list) |
| **4. 纯净 APNs 推送 (`DIRECT`，可选)** | [`rules/surge/Apple-APNs-Direct.list`](rules/surge/Apple-APNs-Direct.list) | [`rules/clash/Apple-APNs-Direct.yaml`](rules/clash/Apple-APNs-Direct.yaml) | — | — |
| **合集：美区 AI 合并总集 (2+3 合并)** | [`rules/surge/Apple-AI-All.list`](rules/surge/Apple-AI-All.list) | [`rules/clash/Apple-AI-All.yaml`](rules/clash/Apple-AI-All.yaml) | [`rules/sing-box/Apple-AI-All.json`](rules/sing-box/Apple-AI-All.json) | [`rules/quantumultx/AppleFlow-All.list`](rules/quantumultx/AppleFlow-All.list) *(含直连全集)* |

> **关键 DNS 提醒**：自建配置请务必把 `guzzoni.apple.com, *.guzzoni.apple.com, *.siri.apple.com` 加入 Surge 的 `always-real-ip`（以及 `skip-proxy = guzzoni.apple.com`）或 Mihomo / Clash 的 `dns.fake-ip-filter`。

---

## 黄金共存四步法（满血 AI + 中文 Siri + 普通话来电筛选）

1. **硬件准入**：外版机器直接可用；国行（`CH/A`）机器在 `iOS 27.0 – 27.2.1` 下使用 [Erosion-CN](https://github.com/Kianuni/Erosion-CN) 一键配齐并关机冷重启。
2. **语言与地区（切勿把地区改成美国）**：
   - `设置 -> 通用 -> 语言与地区`：首选语言第一项保持**简体中文**，地区设为 **台湾**（设为美国会丢失中文普通话「询问来电原因」来电筛选；留在中国大陆会阻断视觉智能与 AI 翻译）。
   - `设置 -> Apple 智能与 Siri`：Siri 语言保持 **中文（普通话 - 中国大陆）**。
   - 若 Siri 调 ChatGPT 回复繁体字：在 `设置 -> Apple 智能与 Siri -> 扩展 -> ChatGPT` 登录账号，在 ChatGPT 自定义指令中写入 `请始终使用简体中文回答`。
3. **双区账号分工**：iCloud 主账号可继续使用中国大陆区不动，但 **媒体与购买项目（App Store）必须登录非中国大陆区账号**。
4. **节点选择与模块清理**：
   - 美区策略组请选择**支持 UDP / QUIC 的低延迟美国节点**（切勿使用香港节点，也不要对 `apple-relay.*` 启用 `QUIC-BLOCK`）；
   - 若此前启用过针对 `gspe1-ssl.ls.apple.com`（定位服务）或 `*.smoot.apple.com`（Siri 搜索）的 MitM 解密重写模块，请将其停用（TestFlight 相关模块互不冲突，可按需保留）。

---

## 相册「高质量消除」报错排查清单

1. **检查规则是否完整并已刷新外部资源（修复 `PrivateCloudComputeError Code=32033`）**：确保已引用本项目的 `AppleFlow` 模块或 `Apple-PCC` / `Apple-AI-All` 规则集（完整包含 `issuer.apple.com`、`ropes.apple.com`、`mask*.icloud.com`、`app.apple.com`、`apple-relay.*`、`gspe1-ssl.ls.apple.com` 且排在 `Apple_All` 之前），并在代理客户端点击一次 **「更新外部资源 (Update External Resources)」**。
2. **确认美区节点已开启 UDP / QUIC 转发**：PCC OHTTP 强依赖 UDP 443 (QUIC)，请确认节点服务端防火墙已放行 UDP 端口，请求日志中无 `QUIC-BLOCK`（`↓ 0 B`）。
3. **改完规则后重启一次手机，避免连续狂点重试**：此前若因漏分流触发过 `Code=32033` 或 `Code=1009` 退避，`privatecloudcomputed` 会在内存缓存冷却状态——**关机重启一次手机**即可清空本地缓存；若因短时间高频使用触发苹果服务端频率配额，停手等待数小时自动恢复即可。
4. **关于国行设备在 `iOS 27.3 beta 1` 下的限制**：`27.3 beta 1` 新增了本地硬件机型码非缓存校验（`Eligibility returned no CN region policy on a CH region code device`），发网前即在本地拦截，需保持在 `iOS 27.0 – 27.2.1` 或等待苹果后续测试版调整。

---

## 协同生态 · Enable · Route · Observe

**AppleFlow** 与 **[Erosion-CN](https://github.com/Kianuni/Erosion-CN)**、**[AppleLens](https://github.com/Kianuni/AppleLens)** 共同组成面向 Apple Intelligence 的开源协同生态，打通「**设备准入 → 零 MitM 分流 → 观测与排障**」完整链路：

| 阶段 | 项目 | 核心定位 | 解决什么问题 |
| :--- | :--- | :--- | :--- |
| **1. 解锁与底层基线** | **[Erosion-CN](https://github.com/Kianuni/Erosion-CN)** | iOS / iPadOS 系统配置与 `MobileGestalt` 研究工具箱 | 在支持的系统版本上安全解锁国行（`CH/A`）Apple Intelligence、eSIM、FaceTime 音频，并提供防白苹果写入校验与双金库一键还原 |
| **2. 零 MitM 极简分流** | **AppleFlow** *(本项目)* | 零 HTTPS 解密的 Apple 智能、PCC 与中文 Siri 分流方案 + [在线配置体检台](https://kianuni.github.io/AppleFlow/) | 保证中文 Siri（`guzzoni.apple.com`）Real-IP 直连不报错，同时将盲签名令牌域、PCC 隐私中继与第三方 AI 扩展精准分流至支持 UDP/QUIC 的美区节点 |
| **3. 可观测性与排障解读** | **[AppleLens](https://github.com/Kianuni/AppleLens)** | macOS 原生菜单栏雷达 + 工作台 + CLI 只读诊断套件 | 实时观测端侧 / Apple PCC / 外部大模型外连动态，USB 直连 iPhone 翻译常见故障日志，实测 4 路出口与 QUIC/证书防劫持，并离线解读 `Apple_Intelligence_Report.json` |

```text
  [1. Erosion-CN] 设备端底层准入 ──▶ [2. AppleFlow] 零 MitM 精准分流 ──▶ [3. AppleLens] macOS 观测 · 探针 · 报告解读
```

> ⌨️ **延伸日常输入**：偏爱原生系统的克制，又嫌自带拼音词库单薄？试试同作者的 **[Lokey](https://kianuni.github.io/Lokey-Audit/)** —— 1:1 复刻 iOS 26 液态玻璃手感，端侧集成小鹤/自然码双拼、拇指热区纠错与只读 `mmap` [55.3 万词白霜词库](https://github.com/Kianuni/lokey-frost-pack)，物理级零联网（[TestFlight 体验](https://testflight.apple.com/join/Bx9gxXTN) · [源码审计](https://github.com/Kianuni/Lokey-Audit)）。

---

## 许可证

本项目采用 [MIT License](LICENSE) 开源，欢迎各分流模板与客户端配置自由引用。
