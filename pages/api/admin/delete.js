export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password, recordId } = req.body;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: 'Invalid password' });
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Stations/${recordId}`,
      {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}` }
      }
    );
    res.status(200).json({ success: response.ok });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}