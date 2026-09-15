export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const token  = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return res.status(500).json({ error: 'Telegram not configured' });

    const body = req.body;
    let text;

    if (body.type === 'review') {
      const stars = '★'.repeat(Number(body.rating)) + '☆'.repeat(5 - Number(body.rating));
      const date  = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      text = `
⭐ *New review — Elena's Happy Paws*

👤 *Name:* ${body.name || '—'}
${stars} *(${body.rating}/5)*
🐾 *Service:* ${body.service || '—'}
📅 *Date:* ${date}
💬 *Review:* ${body.text || '—'}

➡️ Copy this to add it to your site, or ignore to discard it.
      `.trim();

    } else {
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

    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });

    const telegramData = await telegramRes.json();
    if (!telegramData.ok) {
      console.error('Telegram error:', JSON.stringify(telegramData));
      return res.status(500).json({ error: 'Telegram send failed', detail: telegramData });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal error' });
  }
}