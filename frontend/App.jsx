import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import Chat from "./components/Chat";
import { FontAwesome } from "@expo/vector-icons";
import db, { getChats } from "./firebase";
export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [request, setRequest] = useState("");
  const [response, setResponse] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      message: "Hello, how can I help you?",
    },
  ]);
  const requestPermission = async () => {
    // Request microphone permission
    const { status } = await Audio.requestPermissionsAsync();

    // Check if permission is granted
    if (status !== "granted") {
      alert("Microphone permission is required to use this feature.");
      return false;
    }

    return true;
  };

  const checkPermission = async () => {
    // Get microphone permission status
    const { status } = await Audio.getPermissionsAsync();

    // Check if permission is granted
    if (status !== "granted") {
      alert("Microphone permission is required to use this feature.");
      return false;
    }

    return true;
  };

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
      sendAudioToServer(base64Data);
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

  const sendAudioToServer = async (base64Data) => {
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
    addMessageToConversation({
      id: Math.random(Math.random() * 1000),
      role: "user",
      message: data.text,
    });
    getChatbotResponse(data.text);
  };

  const getChatbotResponse = async (text) => {
    setIsTyping(true);
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
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
    });

    const data = await resp.json();
    console.log(data);
    setResponse(data.choices[0].text);
    setIsTyping(false);
    addMessageToConversation({
      id: Math.random(Math.random() * 1000),
      role: data.choices[0].message.role,
      message: data.choices[0].message.content.replace(/\n\n/g, ""),
    });
  };

  const addMessageToConversation = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <View style={styles.container}>
      <Chat messages={messages} isTyping={isTyping} />
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={styles.buttonContainer}
      >
        <FontAwesome
          name="microphone"
          size={36}
          color={isRecording ? "red" : "white"}
        />
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 50,
    backgroundColor: "#1E1E1E",
    justifyContent: "flex-start",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    right: 40,
    backgroundColor: "#EC578D",
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
