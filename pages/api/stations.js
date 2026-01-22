export default async function handler(req, res) {
  const key = process.env.AIRTABLE_API_KEY;

  res.status(200).json({
    key_exists: !!key,
    key_length: key?.length,
    key_start: key?.slice(0, 5)
  });
}
