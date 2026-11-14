import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  auditConfig,
  generateClientConfig,
  generateRulesetSnippet,
  renderStandaloneRulesetContent,
  scrubConfigSecrets,
} from "../docs/auditor.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

// 1. Clean generated Surge module should score 100 with zero errors/warns
{
  const gen = generateClientConfig({ client: "surge", policy: "🇺🇸 美国节点", includeExt: true, includeApns: true });
  const res = auditConfig(gen.content);
  assert.equal(res.format, "surge-ini");
  assert.equal(res.score, 100, `Expected 100, got ${res.score}: ${JSON.stringify(res.findings)}`);
  assert.equal(res.findings.filter((f) => f.severity === "error").length, 0);
}

// 2. Clean generated Mihomo YAML should score 100
{
  const gen = generateClientConfig({ client: "mihomo", policy: "US-AI", includeExt: true });
  const res = auditConfig(gen.content);
  assert.equal(res.format, "clash-yaml");
  assert.equal(res.score, 100, `Expected 100, got ${res.score}: ${JSON.stringify(res.findings)}`);
}

// 3. Broken Surge config: guzzoni to PROXY, Apple_All before PCC, QUIC blocked, pinned MitM, missing always-real-ip
{
  const broken = `
[General]
skip-proxy = 127.0.0.1, localhost

[Rule]
AND,((PROTOCOL,UDP),(DEST-PORT,443)),REJECT
DOMAIN-SUFFIX,guzzoni.apple.com,PROXY
RULE-SET,https://example.com/Apple_All.list,DIRECT
DOMAIN-SUFFIX,apple-relay.apple.com,🇺🇸 美国节点
DOMAIN-SUFFIX,akadns.net,DIRECT

[MITM]
hostname = %APPEND% gspe1-ssl.ls.apple.com, *.smoot.apple.com
`;
  const res = auditConfig(broken);
  const ids = new Set(res.findings.map((f) => f.id));
  assert(ids.has("siri-routed-to-proxy"), "Should catch guzzoni routed to PROXY");
  assert(ids.has("surge-real-ip-missing"), "Should catch missing always-real-ip");
  assert(ids.has("pcc-shadowed"), "Should catch Apple_All shadowing PCC");
  assert(ids.has("quic-block-trap"), "Should catch UDP 443 QUIC reject before PCC");
  assert(ids.has("apple-pinning-mitm"), "Should catch MitM on pinned Apple domains");
  assert(ids.has("akadns-overbroad"), "Should catch overbroad akadns.net");
  assert.equal(res.score, 0);
}

// 4. Broken Clash YAML: fake-ip enabled without filter, HK policy for PCC
{
  const brokenYaml = `
dns:
  enable: true
  enhanced-mode: fake-ip

rules:
  - DOMAIN-SUFFIX,guzzoni.apple.com,DIRECT
  - DOMAIN-SUFFIX,siri.apple.com,DIRECT
  - DOMAIN-SUFFIX,apple-relay.apple.com,🇭🇰 香港节点
`;
  const res = auditConfig(brokenYaml);
  const ids = new Set(res.findings.map((f) => f.id));
  assert(ids.has("clash-fakeip-missing"), "Should catch missing fake-ip-filter");
  assert(ids.has("pcc-hk-policy"), "Should catch HK policy on PCC");
}

// 5. Custom direct proxy alias (`🌐 全球直连 = direct`) should be recognized as DIRECT without false error
{
  const customDirect = `
[General]
skip-proxy = 127.0.0.1, guzzoni.apple.com
always-real-ip = guzzoni.apple.com, *.guzzoni.apple.com, *.siri.apple.com

[Proxy]
🌐 全球直连 = direct

[Proxy Group]
🍎 苹果服务 = select, "🌐 全球直连", "🇺🇸 美国节点"

[Rule]
RULE-SET,https://example.com/AI.list,"📟 智能助理"
DOMAIN-SUFFIX,guzzoni.apple.com,"🌐 全球直连"
DOMAIN-SUFFIX,siri.apple.com,"🌐 全球直连"
RULE-SET,https://example.com/Apple_All_No_Resolve.list,"🍎 苹果服务"
`;
  const res = auditConfig(customDirect);
  const errors = res.findings.filter((f) => f.severity === "error");
  assert.equal(errors.length, 0, `Expected 0 errors on custom direct alias config, got: ${JSON.stringify(errors)}`);
  // And it should gently suggest explicit mask*.icloud.com & app.apple.com above Apple_All!
  assert(res.findings.some((f) => f.id === "pcc-mask-cleanup-tip"));
}

// 6. Verify all 6 pre-built modules in ../modules exist and are non-empty
for (const modFile of [
  "AppleFlow.sgmodule",
  "AppleFlow-Full.sgmodule",
  "AppleFlow.plugin",
  "AppleFlow.module",
  "AppleFlow.stoverride",
  "AppleFlow-Mihomo.yaml",
]) {
  const fullPath = path.join(rootDir, "modules", modFile);
  assert(fs.existsSync(fullPath), `Missing module ${modFile}`);
  assert(fs.statSync(fullPath).size > 200, `Module ${modFile} unexpectedly small`);
}

// 7. Privacy Scrubber: strips Surge & Clash credentials/URLs while keeping audit results 100% identical
{
  const sensitiveSurge = `#!MANAGED-CONFIG https://sub.secret-airport.io/sub?token=super_secret_999

[General]
skip-proxy = 127.0.0.1, guzzoni.apple.com
always-real-ip = guzzoni.apple.com, *.guzzoni.apple.com, *.siri.apple.com

[Proxy]
🌐 全球直连 = direct
🇺🇸 洛杉矶专线 = snell, 198.51.100.42, 16443, psk=my_private_snell_key, version=4

[Proxy Group]
🇺🇸 美国节点 = url-test, policy-path=https://sub.secret-airport.io/nodes?key=abc123

[Rule]
DOMAIN-SUFFIX,guzzoni.apple.com,"🌐 全球直连"
DOMAIN-SUFFIX,siri.apple.com,"🌐 全球直连"
DOMAIN-SUFFIX,apple-relay.apple.com,"🇺🇸 美国节点"
DOMAIN,mask-api.icloud.com,"🇺🇸 美国节点"
DOMAIN-SUFFIX,app.apple.com,"🇺🇸 美国节点"

[MITM]
ca-passphrase = top_secret_mitm_pwd
hostname = %APPEND% testflight.apple.com
`;
  const before = auditConfig(sensitiveSurge);
  const { text: scrubbed, scrubbedCount } = scrubConfigSecrets(sensitiveSurge);
  assert(scrubbedCount >= 4, `Expected >=4 scrubbed items, got ${scrubbedCount}`);
  assert(!scrubbed.includes("super_secret_999"));
  assert(!scrubbed.includes("my_private_snell_key"));
  assert(!scrubbed.includes("198.51.100.42"));
  assert(!scrubbed.includes("abc123"));
  assert(!scrubbed.includes("top_secret_mitm_pwd"));
  assert(scrubbed.includes("🌐 全球直连 = direct"), "Should preserve direct alias");
  const after = auditConfig(scrubbed);
  assert.equal(after.score, before.score);

  const sensitiveYaml = `
proxies:
  - { name: "US-1", type: trojan, server: us.secret.org, port: 443, password: "yaml_secret_password" }
proxy-providers:
  airport:
    type: http
    url: "https://secret-provider.org/clash?token=xyz987"
rules:
  - DOMAIN-SUFFIX,guzzoni.apple.com,DIRECT
`;
  const scrubbedYaml = scrubConfigSecrets(sensitiveYaml);
  assert(!scrubbedYaml.text.includes("yaml_secret_password"));
  assert(!scrubbedYaml.text.includes("us.secret.org"));
  assert(!scrubbedYaml.text.includes("xyz987"));
}

// 8. Standalone rule-sets & snippets render across all 4 formats
for (const fmt of ["surge", "clash", "qx", "singbox"]) {
  const snip = generateRulesetSnippet({ format: fmt, policy: "US-AI", includeExt: true, includeApns: true });
  assert(snip.content.length > 80, `Empty snippet for ${fmt}`);
  const detail = renderStandaloneRulesetContent(fmt, "Apple-PCC", "zh");
  assert(detail.content.includes("apple-relay.apple.com"), `Missing PCC domain in ${fmt}`);
}

// 9. Node-level UDP / QUIC audit checks (Surge & Clash YAML) + preservation across privacy scrubbing
{
  const surgeBadNode = `
[General]
skip-proxy = 127.0.0.1, guzzoni.apple.com
always-real-ip = guzzoni.apple.com, *.guzzoni.apple.com, *.siri.apple.com

[Proxy]
🇺🇸 美区节点A = trojan, secret-us.host.io, 443, password=secret_pw_1, udp-relay=false, block-quic=on

[Proxy Group]
📟 智能助理 = select, 🇺🇸 美区节点A

[Rule]
DOMAIN-SUFFIX,guzzoni.apple.com,DIRECT
DOMAIN-SUFFIX,siri.apple.com,DIRECT
DOMAIN-SUFFIX,apple-relay.apple.com,📟 智能助理
`;
  const rawAudit = auditConfig(surgeBadNode);
  const rawIds = new Set(rawAudit.findings.map((f) => f.id));
  assert(rawIds.has("surge-node-udp-disabled"), "Should catch Surge udp-relay=false");
  assert(rawIds.has("surge-node-block-quic"), "Should catch Surge block-quic=on");

  const scrubbed = scrubConfigSecrets(surgeBadNode);
  assert(!scrubbed.text.includes("secret-us.host.io"));
  assert(!scrubbed.text.includes("secret_pw_1"));
  const scrubbedAudit = auditConfig(scrubbed.text);
  const scrubbedIds = new Set(scrubbedAudit.findings.map((f) => f.id));
  assert(scrubbedIds.has("surge-node-udp-disabled"), "Scrubbed Surge config must preserve udp-relay=false detection");
  assert(scrubbedIds.has("surge-node-block-quic"), "Scrubbed Surge config must preserve block-quic=on detection");

  // Surge SS missing udp-relay=true -> warn; with udp-relay=true -> clean
  const surgeSsNoUdp = surgeBadNode.replace(
    "trojan, secret-us.host.io, 443, password=secret_pw_1, udp-relay=false, block-quic=on",
    "ss, secret-us.host.io, 8388, encrypt-method=aes-256-gcm, password=secret_pw_2"
  );
  assert(auditConfig(scrubConfigSecrets(surgeSsNoUdp).text).findings.some((f) => f.id === "surge-ss-udp-missing"));

  const surgeSsWithUdp = surgeSsNoUdp.replace("password=secret_pw_2", "password=secret_pw_2, udp-relay=true");
  assert.equal(auditConfig(scrubConfigSecrets(surgeSsWithUdp).text).score, 100);

  // Clash multi-line YAML proxy with udp: false vs missing udp: true vs udp: true
  const clashUdpFalse = `
dns:
  enable: true
  enhanced-mode: fake-ip
  fake-ip-filter:
    - "guzzoni.apple.com"
    - "+.siri.apple.com"
proxies:
  - name: "🇺🇸 US-Trojan"
    type: trojan
    server: us.private.example
    port: 443
    password: secret_clash_password
    udp: false
rules:
  - DOMAIN-SUFFIX,guzzoni.apple.com,DIRECT
  - DOMAIN-SUFFIX,siri.apple.com,DIRECT
  - DOMAIN-SUFFIX,apple-relay.apple.com,🇺🇸 US-Trojan
`;
  const scrubbedClashFalse = scrubConfigSecrets(clashUdpFalse);
  assert(!scrubbedClashFalse.text.includes("secret_clash_password"));
  assert(!scrubbedClashFalse.text.includes("us.private.example"));
  assert(auditConfig(scrubbedClashFalse.text).findings.some((f) => f.id === "clash-node-udp-false"));

  const clashMissingUdp = clashUdpFalse.replace("    udp: false\n", "");
  assert(auditConfig(scrubConfigSecrets(clashMissingUdp).text).findings.some((f) => f.id === "clash-node-udp-missing"));

  const clashUdpTrue = clashUdpFalse.replace("udp: false", "udp: true");
  assert.equal(auditConfig(scrubConfigSecrets(clashUdpTrue).text).score, 100);
}

// 10. Apple-AI-Ext includes full OpenAI/Voice/Sora, Claude/Artifacts & Gemini/Lens without broad googleapis/gstatic
{
  const requiredExtDomains = [
    "chatgpt.livekit.cloud",
    "host.livekit.cloud",
    "turn.livekit.cloud",
    "oaistatsig.com",
    "chat.com",
    "sora.com",
    "claudeusercontent.com",
    "claude.com",
    "lens.google.com",
    "gemini.google.com",
    "generativelanguage.googleapis.com",
  ];
  const webSurgeExt = renderStandaloneRulesetContent("surge", "Apple-AI-Ext", "zh").content;
  const fileSurgeExt = fs.readFileSync(path.join(rootDir, "rules/surge/Apple-AI-Ext.list"), "utf8");

  for (const [label, content] of [
    ["web Apple-AI-Ext", webSurgeExt],
    ["file rules/surge/Apple-AI-Ext.list", fileSurgeExt],
  ]) {
    for (const domain of requiredExtDomains) {
      assert(content.includes(domain), `${label} missing ${domain}`);
    }
    assert(!content.includes("DOMAIN-SUFFIX,googleapis.com"), `${label} should omit broad googleapis.com suffix`);
    assert(!content.includes("DOMAIN-SUFFIX,gstatic.com"), `${label} should omit broad gstatic.com suffix`);
  }
}

console.log("PASS: All AppleFlow auditor, privacy scrubber & ruleset unit tests passed.");
