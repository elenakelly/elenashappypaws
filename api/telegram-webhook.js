export default async function handler(req, res) {
  // Health check — confirms the function is live
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, message: 'Telegram webhook is live' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token  = process.env.TELEGRAM_BOT_TOKEN;
    const update = req.body;

    if (!update.callback_query) return res.status(200).json({ ok: true });

    const { id, data, message } = update.callback_query;

    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: id }),
    });

    if (data === 'reject') {
      await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: message.chat.id,
          message_id: message.message_id,
          text: '❌ Review rejected and discarded.',
        }),
      });
      return res.status(200).json({ ok: true });
    }

    if (data.startsWith('approve:')) {
      const encoded = data.replace('approve:', '');
      const review  = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
      const stars   = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

      await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: message.chat.id,
          message_id: message.message_id,
          text: `✅ *Review approved!*\n\n👤 ${review.name}\n${stars}\n🐾 ${review.service} · ${review.date}\n💬 "${review.text}"\n\nSend this to Claude to add it to your site!`,
          parse_mode: 'Markdown',
        }),
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
}