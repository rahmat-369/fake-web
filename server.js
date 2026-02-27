import express from "express";
import cors from "cors";
import multer from "multer";
import fetch from "node-fetch";
import FormData from "form-data";

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

async function uploadToUguu(file) {
  const form = new FormData();
  form.append("files[]", file.buffer, file.originalname);

  const res = await fetch("https://uguu.se/upload.php", {
    method: "POST",
    body: form
  });

  const json = await res.json();
  if (!json?.files?.[0]?.url) throw new Error("Upload gambar gagal");
  return json.files[0].url;
}

/* ==============================
   FAKE CALL
============================== */
app.post("/api/fakecall", upload.single("image"), async (req, res) => {
  try {
    const { nama, waktu } = req.body;
    if (!nama || !waktu || !req.file)
      return res.status(400).json({ message: "Data tidak lengkap" });

    const imageUrl = await uploadToUguu(req.file);

    const params = new URLSearchParams({
      nama,
      waktu,
      image: imageUrl,
      apikey: "FreeLimit"
    });

    const api = await fetch(
      `https://kayzzidgf.my.id/api/maker/fakecall?${params}`
    );

    const buffer = Buffer.from(await api.arrayBuffer());

    res.set("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ==============================
   FAKE DEV
============================== */
app.post("/api/fakedev", upload.single("image"), async (req, res) => {
  try {
    const { username, verified } = req.body;

    if (!username || !req.file)
      return res.status(400).json({ message: "Data tidak lengkap" });

    const imageUrl = await uploadToUguu(req.file);

    const params = new URLSearchParams({
      text: username,
      image: imageUrl,
      verified: verified === "false" ? "false" : "true",
      apikey: "FreeLimit"
    });

    const api = await fetch(
      `https://kayzzidgf.my.id/api/maker/fakedev?${params}`
    );

    const buffer = Buffer.from(await api.arrayBuffer());

    res.set("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
