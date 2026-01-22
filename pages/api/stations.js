export default async function handler(req, res) {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return res.status(500).json({ error: 'Airtable config missing' });
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Stations`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    const data = await response.json();

    // 🔑 关键：字段统一在这里完成
    const stations = data.records.map(r => {
      const f = r.fields;
      return {
        name: f.name || f.Name || 'Station',
        lat: Number(f.lat ?? f.latitude),
        lng: Number(f.lng ?? f.longitude),
        battery_available: Number(f.battery_available ?? 0),
        battery_total: Number(f.battery_total ?? f.total ?? 0),
        phone: f.phone || f.Phone || ''
      };
    });

    res.status(200).json(stations);
  } catch (e) {
    console.error('API Error:', e.message);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
}
