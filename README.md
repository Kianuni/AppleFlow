<h1 align="center"> AppleFlow</h1>

<p align="center">
  <strong>零 MitM 的 Apple 智能、PCC 隐私云计算与中文 Siri 极简分流方案 & 本地配置体检台</strong><br>
  适用于外版（港/美/日/台）及已解锁国行 iOS / iPadOS / macOS 26–27 设备
</p>

<p align="center">
  <a href="https://kianuni.github.io/AppleFlow/"><strong>打开在线工作台（模块安装 · 规则集 · 本地脱敏体检 · 出口探针）</strong></a> ·
  <a href="README_EN.md">English</a> ·
  <a href="https://github.com/Kianuni/Erosion-CN">Erosion-CN (国行解锁配套工具)</a>
</p>

---

## 为什么需要 AppleFlow？

早年流传的许多苹果分流教程与旧版解密模块在 **iOS / macOS 26–27** 时代已经出现严重水土不服：

1. **定位与 Siri 接口启用强证书固定**：自 iOS 27.2 起苹果对 `gspe1-ssl.ls.apple.com` 等核心接口启用了强证书固定（Certificate Pinning），若继续对该域名或 `*.smoot.apple.com` 开启 MitM 解密重写，会导致区域准入断连、Spotlight 搜索报错。
2. **中文 Siri 被代理或 Fake-IP 误伤**：只要 `guzzoni.apple.com` 或 `*.siri.apple.com` 落入海外节点（或被 VIF DNS 解析为 `198.18.x.x` Fake-IP），中文普通话 Siri 就会立即报错「我碰到了一点问题。请再试一次。」。
3. **`Apple_All` 抢行与 `QUIC-BLOCK` 误拦 PCC**：通用 `AI.list` 往往漏掉了 `mask*.icloud.com` 等匿名令牌接口，导致它们被下方的 `Apple_All -> DIRECT` 截胡直连；而前置屏蔽 UDP 443（`QUIC`）又会阻断或拖慢 `apple-relay.*` 的 OHTTP 隐私云计算握手。

**AppleFlow** 完全摒弃 HTTPS 解密（**100% 零 MitM、零脚本、零额外耗电**），用最小化的精确域名集同时保障：
- **中文普通话 Siri 秒回不报错** + **普通话「询问来电原因」来电筛选完整保留**；
- **Apple Intelligence 书写工具、PCC 隐私云计算、Siri ChatGPT 扩展与视觉智能稳定可用**；
- **国区 iCloud 同步与 APNs 推送不受任何拖累**。

---

## 一键模块安装（零 MitM）

> 在线一键唤起客户端安装、配置冲突自动脱敏排雷与实际出口区域检测，请访问 **[AppleFlow 在线工作台](https://kianuni.github.io/AppleFlow/)**。

| 客户端 | 推荐订阅地址 | 说明 |
| :--- | :--- | :--- |
| **Surge 5 / 6（全套推荐）** | `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow-Full.sgmodule` | 支持模块参数 `Policy` 自定义美区策略组名（默认 `PROXY`） |
| **Surge 5 / 6（核心精简版）** | `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow.sgmodule` | 仅含 Siri 直连 + Apple 原生 PCC，适合自维护 OpenAI/Google 规则的用户 |
| **Loon** | `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow.plugin` | 内置插件策略组下拉选择 |
| **Shadowrocket (小火箭)** | `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow.module` | 默认指向 `PROXY` |
| **Stash** | `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow.stoverride` | 自动注入 `fake-ip-filter` 与置顶规则 |
| **Mihomo / Clash Meta** | [`modules/AppleFlow-Mihomo.yaml`](modules/AppleFlow-Mihomo.yaml) | 含 `fake-ip-filter` 与 `rule-providers` 覆写模板 |

---

## 分流规则集（按需细分 & 合并总集）

请置于 **`Apple_All` / `GEOSITE,apple` / `GEOIP,CN` 之前**：

| 作用与推荐出口 | Surge / Loon `RULE-SET` | Mihomo / Clash `rule-provider` | Sing-box `v2 JSON` | Quantumult X |
| :--- | :--- | :--- | :--- | :--- |
| **1. 中文 Siri 强制直连 (`DIRECT`)** | [`rules/surge/Siri-Direct.list`](rules/surge/Siri-Direct.list) | [`rules/clash/Siri-Direct.yaml`](rules/clash/Siri-Direct.yaml) | [`rules/sing-box/Siri-Direct.json`](rules/sing-box/Siri-Direct.json) | [`rules/quantumultx/Siri-Direct.list`](rules/quantumultx/Siri-Direct.list) |
| **2. Apple PCC 隐私云计算 (`美区`)** | [`rules/surge/Apple-PCC.list`](rules/surge/Apple-PCC.list) | [`rules/clash/Apple-PCC.yaml`](rules/clash/Apple-PCC.yaml) | [`rules/sing-box/Apple-PCC.json`](rules/sing-box/Apple-PCC.json) | [`rules/quantumultx/Apple-PCC.list`](rules/quantumultx/Apple-PCC.list) |
| **3. ChatGPT 与视觉识图 (`美区`)** | [`rules/surge/Apple-AI-Ext.list`](rules/surge/Apple-AI-Ext.list) | [`rules/clash/Apple-AI-Ext.yaml`](rules/clash/Apple-AI-Ext.yaml) | [`rules/sing-box/Apple-AI-Ext.json`](rules/sing-box/Apple-AI-Ext.json) | [`rules/quantumultx/Apple-AI-Ext.list`](rules/quantumultx/Apple-AI-Ext.list) |
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

## 常见问题说明（与分流规则无关的系统级限制）

- **关于云端图像消除间歇报错（`Code=1009 Rate limited`）**：苹果 PCC 云端推理接口设有严格的单用户频率配额。短时间连续调用触发 `1009` 限流后换节点无效（进程缓存可通过关机重启清除，服务端配额需停手等待半天至 24 小时自动恢复），并非分流规则故障。
- **关于国行设备在 `iOS 27.3 beta 1` 下的限制**：`27.3 beta 1` 在相机与照片部分生成式接口新增了本地硬件机型码非缓存校验（`Eligibility returned no CN region policy on a CH region code device`），发网前即在本地拦截，无法通过网络分流绕过。

---

## 许可证

本项目采用 [MIT License](LICENSE) 开源，欢迎各分流模板与客户端配置自由引用。
