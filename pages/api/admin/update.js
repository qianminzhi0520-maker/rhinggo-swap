export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password, recordId, ...updates } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Invalid password' });
  }

  const fields = {};
  if (updates.name) fields.name = String(updates.name);
  if (updates.lat) fields.lat = parseFloat(updates.lat);
  if (updates.lng) fields.lng = parseFloat(updates.lng);
  if (updates.phone) fields.phone = String(updates.phone);
  if (updates.battery_total) fields.battery_total = parseInt(updates.battery_total);
  if (updates.battery_available) fields.battery_available = parseInt(updates.battery_available);

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Stations/${recordId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fields })
      }
    );
    res.status(response.ok ? 200 : 500).json(await response.json());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}