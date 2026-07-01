// Cloudflare Pages Function — replaces the old AWS Lambda (lambda/handler.js).
// Served same-origin at https://chat.nano.org/getInvite?captcha=<token>.
//
// Verifies the reCAPTCHA token, then creates a single-use (max 1 use, 10-min)
// Discord invite and 302-redirects the visitor to it.
//
// Secrets are Cloudflare Pages environment variables (NOT baked into anything):
//   RECAPTCHA_SECRET     reCAPTCHA secret key for chat.nano.org
//   DISCORD_TOKEN        Discord bot token (bot needs Create Invite permission)
//   DISCORD_CHANNEL_ID   target channel id for invites
const text = (body, status) =>
  new Response(body, { status, headers: { 'Content-Type': 'text/plain' } })

export async function onRequestGet(context) {
  const { request, env } = context
  const captcha = new URL(request.url).searchParams.get('captcha')
  if (!captcha) return text('No captcha specified.', 401)

  // Verify reCAPTCHA
  const captchaRes = await (await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: env.RECAPTCHA_SECRET,
      response: captcha,
      remoteip: request.headers.get('CF-Connecting-IP') || ''
    })
  })).json()

  if (!captchaRes.success) {
    let msg = 'Captcha not valid. Please retry.'
    if (captchaRes['error-codes']) msg += ' Error(s): ' + captchaRes['error-codes'].join(', ')
    return text(msg, 401)
  }

  // Create a single-use Discord invite
  const discordReq = await fetch(
    `https://discord.com/api/channels/${env.DISCORD_CHANNEL_ID}/invites`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': env.DISCORD_TOKEN },
      body: JSON.stringify({ max_uses: 1, max_age: 600, unique: true })
    }
  )
  const discordRes = await discordReq.json()

  if (discordReq.status < 200 || discordReq.status >= 400) {
    return text(`Discord returned error ${discordRes.code}: ${discordRes.message}`, 500)
  }
  if (!discordRes.code) return text('No invite code received from Discord.', 500)

  return Response.redirect('https://discord.gg/' + discordRes.code, 302)
}
