import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import ChatMessage from "./ChatMessage";

const Chat = ({ messages, isTyping }) => {
  return (
    <View>
      {messages.map((message, index) => {
        return (
          <View key={message.id}>
            <ChatMessage
              message={message.message}
              isUser={message.role === "user"}
            />
            {isTyping && index === messages.length - 1 && (
              <ChatMessage
                message="Assistant is typing..."
                //  isUser={message.role}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

export default Chat;
