import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Result = ({ request, response }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request:</Text>
      <Text style={styles.content}>{request}</Text>
      <Text style={styles.title}>Response:</Text>
      <Text style={styles.content}>{response}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default Result;
