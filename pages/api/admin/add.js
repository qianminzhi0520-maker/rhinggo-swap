export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password, name, lat, lng, phone, battery_total, battery_available } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Invalid admin password' });
  }

  const fields = {
    name: String(name || ''),
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    phone: String(phone || ''),
    battery_total: parseInt(battery_total) || 0,
    battery_available: parseInt(battery_available) || 0
  };

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Stations`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields })
      }
    );
    const result = await response.json();
    res.status(response.ok ? 200 : 500).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}