// Recebe o contato do portfólio e entrega no Telegram.
// Configuração (Vercel → Settings → Environment Variables):
//   TELEGRAM_BOT_TOKEN — token do bot criado no @BotFather
//   TELEGRAM_CHAT_ID   — seu id de usuário (pegue com o @userinfobot)
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method' });

  const token = process.env.TELEGRAM_BOT_TOKEN || '';
  const chatId = process.env.TELEGRAM_CHAT_ID || '';
  if (!token || !chatId) return res.status(503).json({ ok: false, configured: false });

  const b = req.body || {};
  const honeypot = String(b.website || '').trim();
  if (honeypot) return res.status(200).json({ ok: true }); // bot: finge sucesso

  const nome = String(b.nome || '').trim().slice(0, 80);
  const meio = b.meio === 'email' ? 'E-mail' : 'WhatsApp';
  const contato = String(b.contato || '').trim().slice(0, 120);
  const mensagem = String(b.mensagem || '').trim().slice(0, 2000);
  if (!nome || !contato || mensagem.length < 5) return res.status(400).json({ ok: false, error: 'validacao' });

  const text = [
    '📩 Novo contato do portfólio',
    '',
    `Nome: ${nome}`,
    `Responde por: ${meio} — ${contato}`,
    '',
    'Projeto:',
    mensagem,
  ].join('\n');

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!r.ok) throw new Error('telegram');
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ ok: false, error: 'telegram' });
  }
};
