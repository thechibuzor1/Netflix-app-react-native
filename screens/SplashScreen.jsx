import React, { useState, useEffect } from "react";
import { ActivityIndicator, View, StyleSheet, Image } from "react-native";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";

export default function SplashScreen({ navigation }) {
  const [animating, setAnimating] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      AsyncStorage.getItem("userData").then((user) => {
        if (user) {
          const userData = JSON.parse(user);
          console.log(userData);
          dispatch({
            type: "USER_SIGNIN",
            payload: userData,
          });
          setAnimating(false);
          navigation.navigate("Watching", { data: userData });
        } else {
          setAnimating(false);
          navigation.navigate("Auth");
        }
      });
    }, 4500);
  }, []);
  return (
    <View style={styles.container}>
      <LottieView
        style={{ height: 200 }}
        source={require("../assests/swoop.json")}
        autoPlay
      />
      <ActivityIndicator
        animating={animating}
        color="#ffffff"
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
});
