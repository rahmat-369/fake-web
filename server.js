import express from "express";

const app = express();
app.use(express.json());

const BASE = "https://kayzzidgf.my.id/api/maker";

/* =========================
   FAKE CALL (POST)
========================= */
app.post("/api/fakecall", async (req, res) => {
  try {
    const { nama, waktu, image } = req.body;

    if (!nama || !waktu || !image) {
      return res.status(400).json({
        status: false,
        message: "nama, waktu, image wajib diisi"
      });
    }

    const params = new URLSearchParams({
      nama,
      waktu,
      image,
      apikey: "FreeLimit"
    });

    const response = await fetch(`${BASE}/fakecall?${params}`);
    const buffer = Buffer.from(await response.arrayBuffer());

    res.set("Content-Type", "image/png");
    res.send(buffer);

  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
});

/* =========================
   FAKE DEV (POST)
========================= */
app.post("/api/fakedev", async (req, res) => {
  try {
    const { username, image, verified } = req.body;

    if (!username || !image) {
      return res.status(400).json({
        status: false,
        message: "username dan image wajib"
      });
    }

    const params = new URLSearchParams({
      text: username,
      image,
      verified: verified === false ? "false" : "true",
      apikey: "FreeLimit"
    });

    const response = await fetch(`${BASE}/fakedev?${params}`);
    const buffer = Buffer.from(await response.arrayBuffer());

    res.set("Content-Type", "image/png");
    res.send(buffer);

  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
}); 
