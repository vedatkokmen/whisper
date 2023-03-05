const express = require("express");
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");
const app = express();
const port = 3000;
const fs = require("fs");

app.use(express.json());
app.use(cors());

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// Route to handle the API call to the Whisper-1 model
app.post("/", async (req, res) => {
  try {
    const filePath = "./audio.wav";

    // check if the file exists
    if (fs.existsSync(filePath)) {
      // delete the file if it exists
      fs.unlinkSync(filePath);
    } else {
      console.log(`File ${filePath} does not exist.`);
    }

    const buffer = Buffer.from(req.body.audio, "base64");
    fs.writeFileSync("./audio.wav", buffer);

    const track = "./audio.wav"; //your path to source file

    // const response = await openai.createTranscription(
    //   fs.createReadStream(track),
    //   "whisper-1"
    // );
    // res.send(response.data);

    try {
      const response = await openai.createTranscription(
        fs.createReadStream(track),
        "whisper-1"
      );
      res.send(response.data);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error occurred while processing request");
    }
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
