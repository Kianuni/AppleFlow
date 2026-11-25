<h1 align="center"> AppleFlow</h1>

<p align="center">
  <strong>Zero-MitM Routing Engine & Local Config Doctor for Apple Intelligence, Photos High-Quality Clean Up & Mandarin Siri</strong><br>
  Built for iOS / iPadOS / macOS 26–27
</p>

<p align="center">
  <a href="https://kianuni.github.io/AppleFlow/"><strong>Open Interactive Web Studio & Config Doctor</strong></a> ·
  <a href="README.md">简体中文</a> ·
  <a href="CHANGELOG.md">Changelog</a> ·
  <a href="https://github.com/Kianuni/Erosion-CN">Erosion-CN</a> ·
  <a href="https://github.com/Kianuni/AppleLens">AppleLens</a> ·
  <a href="https://kianuni.github.io/Lokey-Audit/">Lokey Offline Keyboard</a>
</p>

---

## Overview

**AppleFlow** provides a lightweight, zero-MitM routing rule architecture verified on iOS / macOS 26–27:

1. **Mandarin Siri & Call Screening Stay on Real-IP `DIRECT`**: Keeps `guzzoni.apple.com`, `*.siri.apple.com`, and `*.smoot.apple.com` out of overseas proxies and Fake-IP (`198.18.0.0/15`), preventing Siri connection errors.
2. **Complete Apple PCC & Photos High-Quality Clean Up Above Catch-All Apple Rules**: Routes `gspe1-ssl.ls.apple.com`, `issuer.apple.com`, `ropes.apple.com`, `mask*.icloud.com`, `app.apple.com`, and `apple-relay.*` through your low-latency US proxy with UDP 443 (`QUIC`) enabled — preventing `PrivateCloudComputeError Code=32033` caused by `Apple_All` direct leaks or `QUIC-BLOCK`.
3. **Zero MitM**: Certificate pinning in iOS 27.2+ breaks MitM on `gspe1-ssl.ls.apple.com`. AppleFlow uses zero scripts and zero MitM certificates.
4. **Local Auto-Redacting Config Doctor & Exit Region Probe**: Audit your Surge `.conf` or Mihomo / Clash `.yaml` strictly in local browser memory (with automatic proxy credential & subscription URL redaction), and inspect real connected exit regions across split-routing lanes in the [Web Studio](https://kianuni.github.io/AppleFlow/).

## Quick Subscribe

- **Surge (`AppleFlow-Full.sgmodule`)**: `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow-Full.sgmodule` (supports `#!arguments=Policy:PROXY`)
- **Loon (`AppleFlow.plugin`)**: `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow.plugin`
- **Shadowrocket (`AppleFlow.module`)**: `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow.module`
- **Stash (`AppleFlow.stoverride`)**: `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow.stoverride`
- **Mihomo / Clash Meta**: [`modules/AppleFlow-Mihomo.yaml`](modules/AppleFlow-Mihomo.yaml) & [`rules/clash/`](rules/clash/)
- **Combined US AI Rule-Set (`Apple-AI-All`)**: [`rules/surge/Apple-AI-All.list`](rules/surge/Apple-AI-All.list) · [`rules/clash/Apple-AI-All.yaml`](rules/clash/Apple-AI-All.yaml) · [`rules/sing-box/Apple-AI-All.json`](rules/sing-box/Apple-AI-All.json) · [`rules/quantumultx/AppleFlow-All.list`](rules/quantumultx/AppleFlow-All.list)

## Ecosystem · Enable · Route · Observe

**AppleFlow** pairs with **[Erosion-CN](https://github.com/Kianuni/Erosion-CN)** and **[AppleLens](https://github.com/Kianuni/AppleLens)** as the routing layer of our open-source Apple Intelligence ecosystem — covering **device enablement**, **zero-MitM split routing**, and **real-time observability**:

| Stage | Project | Role | What It Solves |
| :--- | :--- | :--- | :--- |
| **1. Unlock & Baseline** | **[Erosion-CN](https://github.com/Kianuni/Erosion-CN)** | iOS / iPadOS system customization & `MobileGestalt` toolkit | Safely enables Apple Intelligence, eSIM, and FaceTime Audio on supported hardware/builds (`CH/A`), backed by in-place verification and dual-vault factory restore |
| **2. Zero-MitM Routing** | **AppleFlow** *(This Repo)* | Minimal zero-MitM rulesets + [Interactive Web Config Doctor](https://kianuni.github.io/AppleFlow/) | Keeps Mandarin Siri (`guzzoni.apple.com`) on real-IP `DIRECT` while steering blind-signing token issuers, PCC relays, and AI extensions cleanly to UDP-enabled US exit nodes |
| **3. Observability & Diagnostics** | **[AppleLens](https://github.com/Kianuni/AppleLens)** | Native macOS MenuBar Radar + Workbench + CLI read-only diagnostics suite | Monitors On-Device / Apple PCC / External LLM traffic live, bridges USB iPhone logs with zero third-party tools, probes 4 exit lanes + QUIC + TLS pinning, and decodes `Apple_Intelligence_Report.json` offline |

```text
  [1. Erosion-CN] Device Enablement ──▶ [2. AppleFlow] Zero-MitM Routing ──▶ [3. AppleLens] macOS Radar · Probe · Report Lens
```

> ⌨️ **Everyday Offline Input**: Prefer native iOS restraint without the thin built-in Pinyin dictionary? Try **[Lokey](https://kianuni.github.io/Lokey-Audit/)** — 1:1 native iOS 26 feel paired with on-device Xiaohe/Ziranma Shuangpin, adaptive thumb typo calibration, and zero-copy [553k Frost Pack](https://github.com/Kianuni/lokey-frost-pack) mounting, physically zero-network ([TestFlight](https://testflight.apple.com/join/Bx9gxXTN) · [Audit Repo](https://github.com/Kianuni/Lokey-Audit)).

---

## License

Released under the [MIT License](LICENSE).
