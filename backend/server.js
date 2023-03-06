const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

app.use(express.json());
app.use(cors());

const API_TOKEN = "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"; // Replace with your API token
async function transcribeAudio() {
  const form = new FormData();
  form.append("model", "whisper-1");
  form.append("file", fs.createReadStream("./audio.wav"));

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      form,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          ...form.getHeaders(),
        },
      }
    );
    console.log(response.data);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to transcribe audio");
  }
}

// Route to handle the API call to the Whisper-1 model
app.post("/", async (req, res) => {
  try {
    // Overwrite existing file or create a new one
    const buffer = Buffer.from(req.body.audio, "base64");
    fs.writeFileSync("./audio.wav", buffer);

    const response = await transcribeAudio();
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
