// Slack slash command: /tminus [YYYY-MM-DD] [label]
// Replies in-channel with the days remaining until the date.
//
// Scope note: a slash command replies through the HTTP response, so this app
// needs only the `commands` scope. No chat:write, no channel reads.
const crypto = require("crypto");

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => { data += chunk; });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

// Slack signs every request; verify it when the secret is configured.
function signatureValid(raw, req) {
  const secret = process.env.SLACK_SIGNING_SECRET;
  if (!secret) return true;                       // not configured yet
  const ts = req.headers["x-slack-request-timestamp"];
  const sig = req.headers["x-slack-signature"];
  if (!ts || !sig) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 60 * 5) return false;   // replay guard
  const mine = "v0=" + crypto.createHmac("sha256", secret)
    .update(`v0:${ts}:${raw}`).digest("hex");
  const a = Buffer.from(mine), b = Buffer.from(sig);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function parseDate(token) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(token || "");
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null;
  return dt;
}

function reply(res, text, inChannel) {
  res.setHeader("Content-Type", "application/json");
  res.status(200).end(JSON.stringify({
    response_type: inChannel ? "in_channel" : "ephemeral",
    text
  }));
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const raw = await readRawBody(req);
  if (!signatureValid(raw, req)) return res.status(401).end("Bad signature");

  const params = new URLSearchParams(raw);
  const text = (params.get("text") || "").trim();
  const [dateToken, ...rest] = text.split(/\s+/);
  const label = rest.join(" ").slice(0, 60);

  if (!dateToken) {
    return reply(res, "Usage: `/tminus 2026-12-31 ship the word packs`", false);
  }

  const target = parseDate(dateToken);
  if (!target) {
    return reply(res, `\`${dateToken}\` isn't a date I can read. Use \`YYYY-MM-DD\`, e.g. \`/tminus 2026-12-31\`.`, false);
  }

  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const days = Math.round((target.getTime() - today) / 86400000);
  const pretty = `${target.getUTCDate()} ${MONTHS[target.getUTCMonth()]} ${target.getUTCFullYear()}`;
  const what = label ? ` — ${label}` : "";

  let line;
  if (days > 1)       line = `⏳ *T−${days} days* to ${pretty}${what}`;
  else if (days === 1) line = `⏳ *Tomorrow* — ${pretty}${what}`;
  else if (days === 0) line = `🚨 *Today* — ${pretty}${what}`;
  else                 line = `✅ ${pretty}${what} was *${Math.abs(days)} days* ago`;

  return reply(res, line, true);
};
