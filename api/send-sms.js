// Vercel Serverless Function - Real SMS
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error: 'Faqat POST'});
  const { phone, name, bizName, gLink } = req.body;
  if (!process.env.ESKIZ_EMAIL || !process.env.ESKIZ_PASSWORD) {
    return res.json({ success: true, demo: true });
  }
  try {
    const tokenRes = await fetch('https://notify.eskiz.uz/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: process.env.ESKIZ_EMAIL, password: process.env.ESKIZ_PASSWORD })
    });
    const tokenData = await tokenRes.json();
    const token = tokenData.data?.token;
    const text = `Assalomu alaykum, ${name}! ${bizName} dan tashakkur! Google da izoh qoldiring: ${gLink}`;
    const smsRes = await fetch('https://notify.eskiz.uz/api/message/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ mobile_phone: phone.replace(/[^0-9]/g, ''), message: text, from: '4546' })
    });
    const smsData = await smsRes.json();
    return res.json({ success: true, data: smsData });
  } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
}
