export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET")
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate")
    const { placeId, apiKey } = req.query
    if (!placeId || !apiKey) {
          return res.status(400).json({ error: "placeId et apiKey requis" })
        }
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&language=fr&key=${apiKey}`
    try {
          const response = await fetch(url)
          const data = await response.json()
          res.status(200).json(data)
        } catch (err) {
          res.status(500).json({ error: "Erreur proxy" })
        }
  }
