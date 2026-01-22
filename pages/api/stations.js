export default async function handler(req, res) {
  const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Stations`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    const text = await response.text();

    // 🔥 关键日志
    console.log('STATUS:', response.status);
    console.log('RAW:', text);

    res.status(200).send(text);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
