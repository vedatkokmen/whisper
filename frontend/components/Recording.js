import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { Audio } from "expo-av";

const Recording = ({ response, request, handleRequest, handleResponse }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);

  async function startRecording() {
    if (isRecording) {
      console.log("Already recording");
      return;
    }
    const newRecording = new Audio.Recording();
    try {
      await newRecording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
      console.log("Recording started");
    } catch (error) {
      console.log("Error starting recording:", error);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    const response = await fetch(uri);

    const blob = await response.blob();
    arrayBufferToBase64(blob).then((base64Data) => {
      base64ToServer(base64Data);
    });
    setIsRecording(false);
  }

  function arrayBufferToBase64(blob) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result.split(",")[1]);
      };
    });
  }

  const base64ToServer = async (base64Data) => {
    const response = await fetch("http://localhost:3000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audio: base64Data }),
    });
    const data = await response.json();
    console.log(data);
    setRequest(data.text);
    getAnswer(data.text);
  };

  const getAnswer = async (text) => {
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: text }],
      }),
    })
      .then((response) => response.json())
      .then((data) => setResponse(data.choices[0].message.content))
      .catch((error) => console.error(error));
  };

  return (
    <View>
      <Button
        title={isRecording ? "Stop Recording" : "Start Recording"}
        onPress={isRecording ? stopRecording : startRecording}
      />
    </View>
  );
};

export default Recording;
