<h1 align="center"> AppleFlow</h1>

<p align="center">
  <strong>Zero-MitM Routing Engine & Local Config Doctor for Apple Intelligence, PCC & Mandarin Siri</strong><br>
  Built for iOS / iPadOS / macOS 26–27
</p>

<p align="center">
  <a href="https://kianuni.github.io/AppleFlow/"><strong>Open Interactive Web Studio & Config Doctor</strong></a> ·
  <a href="README.md">简体中文</a> ·
  <a href="https://github.com/Kianuni/Erosion-CN">Erosion-CN</a>
</p>

---

## Overview

**AppleFlow** provides a lightweight, zero-MitM routing rule architecture verified on iOS / macOS 26–27:

1. **Mandarin Siri & Call Screening Stay on Real-IP `DIRECT`**: Keeps `guzzoni.apple.com`, `*.siri.apple.com`, and `*.smoot.apple.com` out of overseas proxies and Fake-IP (`198.18.0.0/15`), preventing Siri connection errors.
2. **Apple PCC & OHTTP Relays Above Catch-All Apple Rules**: Routes `gspe1-ssl.ls.apple.com`, `apple-relay.*`, and `mask*.icloud.com` through your low-latency US proxy without blocking UDP 443 (`QUIC`).
3. **Zero MitM**: Certificate pinning in iOS 27.2+ breaks MitM on `gspe1-ssl.ls.apple.com`. AppleFlow uses zero scripts and zero MitM certificates.
4. **Local Auto-Redacting Config Doctor & Exit Region Probe**: Audit your Surge `.conf` or Mihomo / Clash `.yaml` strictly in local browser memory (with automatic proxy credential & subscription URL redaction), and inspect real connected exit regions across split-routing lanes in the [Web Studio](https://kianuni.github.io/AppleFlow/).

## Quick Subscribe

- **Surge (`AppleFlow-Full.sgmodule`)**: `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow-Full.sgmodule` (supports `#!arguments=Policy:PROXY`)
- **Loon (`AppleFlow.plugin`)**: `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow.plugin`
- **Shadowrocket (`AppleFlow.module`)**: `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow.module`
- **Stash (`AppleFlow.stoverride`)**: `https://raw.githubusercontent.com/Kianuni/AppleFlow/main/modules/AppleFlow.stoverride`
- **Mihomo / Clash Meta**: [`modules/AppleFlow-Mihomo.yaml`](modules/AppleFlow-Mihomo.yaml) & [`rules/clash/`](rules/clash/)
- **Combined US AI Rule-Set (`Apple-AI-All`)**: [`rules/surge/Apple-AI-All.list`](rules/surge/Apple-AI-All.list) · [`rules/clash/Apple-AI-All.yaml`](rules/clash/Apple-AI-All.yaml) · [`rules/sing-box/Apple-AI-All.json`](rules/sing-box/Apple-AI-All.json) · [`rules/quantumultx/AppleFlow-All.list`](rules/quantumultx/AppleFlow-All.list)

## License

Released under the [MIT License](LICENSE).
