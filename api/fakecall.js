import fetch from "node-fetch";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Upload ke uguu
    const form = new FormData();
    form.append("files[]", buffer, "image.png");

    const upload = await fetch("https://uguu.se/upload.php", {
      method: "POST",
      body: form
    });

    const json = await upload.json();
    const imageUrl = json.files[0].url;

    const params = new URLSearchParams({
      nama: req.query.nama,
      waktu: req.query.waktu,
      image: imageUrl,
      apikey: "FreeLimit"
    });

    const api = await fetch(
      `https://kayzzidgf.my.id/api/maker/fakecall?${params}`
    );

    const img = Buffer.from(await api.arrayBuffer());

    res.setHeader("Content-Type", "image/png");
    res.send(img);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
                          }
