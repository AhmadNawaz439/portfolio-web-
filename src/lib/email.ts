// Sends contact-form messages to your inbox using Resend (https://resend.com).
// Needs RESEND_API_KEY and CONTACT_TO_EMAIL in .env.local. If they're missing,
// nothing is sent and messages are still saved in the dashboard.

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function notifyNewMessage(msg: { name: string; email: string; message: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <h2 style="margin:0 0 12px">New message from your portfolio</h2>
      <p style="margin:0 0 4px"><b>Name:</b> ${escape(msg.name)}</p>
      <p style="margin:0 0 16px"><b>Email:</b> <a href="mailto:${escape(msg.email)}">${escape(msg.email)}</a></p>
      <div style="padding:14px 16px;background:#f4f4f5;border-radius:8px;white-space:pre-wrap">${escape(msg.message)}</div>
      <p style="color:#71717a;font-size:12px;margin-top:16px">Press Reply to answer ${escape(msg.name)} directly.</p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: msg.email,
        subject: `New portfolio message from ${msg.name}`,
        html,
      }),
    });
    if (!res.ok) console.error("Resend email failed:", res.status, await res.text());
  } catch (err) {
    // The message is already saved, so a failed email never breaks the form.
    console.error("Resend email failed:", err);
  }
}
