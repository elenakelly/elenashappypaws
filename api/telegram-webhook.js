// This endpoint receives button taps from Telegram (approve/reject)
// Set it as your webhook URL in Telegram:
// https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-vercel-domain.vercel.app/api/telegram-webhook

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const token  = process.env.TELEGRAM_BOT_TOKEN;
    const update = req.body;

    // Only handle button callbacks
    if (!update.callback_query) return res.status(200).end();

    const { id, data, message } = update.callback_query;

    // Acknowledge the button tap immediately
    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: id }),
    });

    if (data === 'reject') {
      // Edit the message to show it was rejected
      await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: message.chat.id,
          message_id: message.message_id,
          text: '❌ Review rejected and discarded.',
        }),
      });
      return res.status(200).end();
    }

    if (data.startsWith('approve:')) {
      const encoded = data.replace('approve:', '');
      const review  = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));

      // Send the approved review data back as a special message
      // The website checks for approved reviews stored in a shared endpoint
      // Since this is static, we store in a simple KV via Vercel Edge Config
      // For now: send it back as a formatted message so you can copy it
      const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
      await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: message.chat.id,
          message_id: message.message_id,
          text: `✅ *Review approved!*\n\nTo add it to your site, paste this into the RANGES section comment in index.html, or ask Claude to add it:\n\n👤 ${review.name}\n${stars}\n🐾 ${review.service} · ${review.date}\n💬 "${review.text}"`,
          parse_mode: 'Markdown',
        }),
      });
    }

    return res.status(200).end();
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
}

