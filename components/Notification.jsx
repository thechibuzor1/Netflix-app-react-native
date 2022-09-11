import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Notification(prop) {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("../assests/logo.png")} />
      <Text style={styles.text}>{prop.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    zIndex: 999,
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 20,
    height: 60,
  },
  logo: {
    borderRadius: 20,
    marginLeft: 20,
    height: 35,
    width: 30,
    backgroundColor: "black",
  },
  text: {
    color: "black",
    marginLeft: 10,
    marginRight: 15,
    fontWeight: "500",
  },
});
