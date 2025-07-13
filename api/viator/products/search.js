export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.VIATOR_API_KEY;
  const url = 'https://api.viator.com/partner/products/search';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'exp-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept-Language': 'en-US'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy Error', message: err.message });
  }
}
