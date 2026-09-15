export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const token  = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return res.status(500).json({ error: 'Telegram not configured' });

    const body = req.body;
    let text, reply_markup;

    if (body.type === 'review') {
      // ── REVIEW SUBMISSION ──
      const stars = '★'.repeat(Number(body.rating)) + '☆'.repeat(5 - Number(body.rating));
      text = `
⭐ *New review waiting for approval*

👤 *Name:* ${body.name || '—'}
${stars} *(${body.rating}/5)*
🐾 *Service:* ${body.service || '—'}
💬 *Review:* ${body.text || '—'}

Approve to show it on your website, or reject to discard it.
      `.trim();

      // Encode review data as base64 so we can store it in the callback
      const reviewData = Buffer.from(JSON.stringify({
        name:    body.name,
        rating:  Number(body.rating),
        service: body.service,
        text:    body.text,
        date:    new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      })).toString('base64');

      reply_markup = {
        inline_keyboard: [[
          { text: '✅ Approve', callback_data: `approve:${reviewData}` },
          { text: '❌ Reject',  callback_data: 'reject' },
        ]],
      };

    } else {
      // ── INQUIRY SUBMISSION ──
      text = `
🐾 *New inquiry — Elena's Happy Paws*

👤 *Name:* ${body.name || '—'}
📧 *Email:* ${body.email || '—'}
📅 *Dates:* ${body.dates || '—'}
🐕 *Service:* ${body.service || '—'}
💬 *About pet:* ${body.message || '—'}

↩️ Reply at: ${body.email || '—'}
      `.trim();
    }

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown', ...(reply_markup ? { reply_markup } : {}) }),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
