export default async function handler(req, res) {
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.setHeader("Access-Control-Allow-Methods", "GET")
      res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate")
      const { placeId, apiKey } = req.query
      if (!placeId || !apiKey) {
              return res.status(400).json({ error: "placeId et apiKey requis" })
      }
      try {
              // Places API (New) endpoint
        const url = `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,rating,userRatingCount,reviews&languageCode=fr&key=${apiKey}`
              const response = await fetch(url, {
                        headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,reviews" }
              })
              const newData = await response.json()
              // Normalize to legacy format for compatibility with Framer component
        if (newData.error) {
                  return res.status(200).json({ status: "ERROR", error_message: newData.error.message })
        }
              const reviews = (newData.reviews || []).map(r => ({
                        author_name: r.authorAttribution?.displayName || "Anonyme",
                        rating: r.rating,
                        text: r.text?.text || "",
                        relative_time_description: r.relativePublishTimeDescription || "",
                        profile_photo_url: r.authorAttribution?.photoUri || ""
              }))
              res.status(200).json({
                        result: {
                                    name: newData.displayName?.text || "",
                                    rating: newData.rating,
                                    user_ratings_total: newData.userRatingCount,
                                    reviews
                        },
                        status: "OK"
              })
      } catch (err) {
              res.status(500).json({ error: "Erreur proxy", details: err.message })
      }
}
