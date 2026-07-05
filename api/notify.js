export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, dates, service, message } = req.body;

    // Read token and chat ID from Vercel environment variables (never hardcoded)
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return res.status(500).json({ error: 'Telegram credentials not configured' });
    }

    const text = `
🐾 *New inquiry — Elena's Happy Paws*

👤 *Name:* ${name || 'Not provided'}
📧 *Email:* ${email || 'Not provided'}
📅 *Dates:* ${dates || 'Not provided'}
🐕 *Service:* ${service || 'Not provided'}
💬 *About pet:* ${message || 'Not provided'}

↩️ Reply at: ${email || '—'}
    `.trim();

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
        }),
      }
    );

    const telegramData = await telegramRes.json();

    if (!telegramData.ok) {
      console.error('Telegram error:', telegramData);
      return res.status(500).json({ error: 'Telegram send failed' });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error('Function error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
