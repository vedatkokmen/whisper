import React from "react";
import { StyleSheet, Text, View } from "react-native";
const styles = StyleSheet.create({
  assistant: {
    backgroundColor: "#333",
    color: "#ECE5DD",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginLeft: 10,
    alignSelf: "flex-start",
    maxWidth: "50%",
  },
  user: {
    backgroundColor: "#555",
    color: "#ECE5DD",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginLeft: 10,
    alignSelf: "flex-end",
    maxWidth: "50%",
  },
  messageContainer: {
    marginBottom: 10,
    padding: 5,
  },
});

const ChatMessage = ({ message, isUser }) => {
  const messageStyle = isUser ? styles.user : styles.assistant;

  return (
    <View style={styles.messageContainer}>
      <Text style={messageStyle}>{message}</Text>
    </View>
  );
};

export default ChatMessage;
