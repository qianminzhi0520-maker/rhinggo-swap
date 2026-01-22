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

    const text = await response.text();
    if (!response.ok) throw new Error(text);

    const data = JSON.parse(text);
    const records = data.records.map(r => r.fields);

    res.status(200).json(records);
  } catch (e) {
    console.error('API Error:', e.message);
    res.status(500).json({ error: e.message });
  }
}
