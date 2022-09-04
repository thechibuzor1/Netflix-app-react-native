import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-paper";

export default function AuthScreen({ navigation }) {
  const { userData } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
  };

  const submitHandler = async () => {
    if (isSignup) {
      if (password !== confirmPassword) {
        alert("Passwords don't match.");
        return;
      }
      setLoading(true);
      try {
        return fetch(
          "https://netflixappbackend.herokuapp.com/api/users/signup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              password,
            }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            dispatch({
              type: "USER_SIGNIN",
              payload: data,
            });
            AsyncStorage.setItem("userData", JSON.stringify(data));
            console.log(data);
            setLoading(false);
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setName("");
            navigation.navigate("Watching", { data: data });
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      try {
        return fetch(
          "https://netflixappbackend.herokuapp.com/api/users/signin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        ).then((response) => {
          if (response.status === 200) {
            return response.json().then((data) => {
              dispatch({
                type: "USER_SIGNIN",
                payload: data,
              });
              AsyncStorage.setItem("userData", JSON.stringify(data));
              console.log(data);
              setLoading(false);
              setEmail("");
              setPassword("");

              navigation.navigate("Watching", { data });
            });
          } else {
            alert("Invalid Credentials");
          }
        });
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
  };

  /* useEffect(() => {
    if (userData) {
      navigation.navigate("Watching", {
        data: userData,
      });
    }
  }, []); */

  return (
    <View style={styles.container}>
      {loading ? (
        <View
          style={{
            backgroundColor: "black",
            position: "absolute",
            opacity: 0.6,
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <LottieView
            style={{ height: 200 }}
            source={require("../assests/loader.json")}
            autoPlay
            speed={3}
          />
        </View>
      ) : (
        <KeyboardAwareScrollView
          style={{ flex: 1, width: "100%" }}
          keyboardShouldPersistTaps="always"
        >
          <Image
            style={styles.logo}
            source={require("../assests/logo.svg.png")}
          />
          {isSignup && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setName(text)}
              value={name}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              activeUnderlineColor={"red"}
              theme={{ colors: { text: "white" } }}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setEmail(text)}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            activeUnderlineColor={"red"}
            theme={{ colors: { text: "white" } }}
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            secureTextEntry={passwordVisible}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            activeUnderlineColor={"red"}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            right={
              <TextInput.Icon
                color={"white"}
                name={passwordVisible ? "eye" : "eye-off"}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
            theme={{ colors: { text: "white" } }}
          />
          {isSignup && (
            <TextInput
              style={styles.input}
              activeUnderlineColor={"red"}
              placeholderTextColor="#aaaaaa"
              secureTextEntry={passwordVisible}
              placeholder="Confirm Password"
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              right={
                <TextInput.Icon
                  color={"white"}
                  name={passwordVisible ? "eye" : "eye-off"}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                />
              }
              theme={{ colors: { text: "white" } }}
            />
          )}
          <TouchableOpacity style={styles.button} onPress={submitHandler}>
            <Text style={styles.buttonTitle}>
              {isSignup ? "Create account" : "Log in"}
            </Text>
          </TouchableOpacity>
          <View style={styles.footerView}>
            <Text style={styles.footerText}>
              {isSignup
                ? "Already got an account? "
                : "Don't have an account? "}
              <Text onPress={switchMode} style={styles.footerLink}>
                {isSignup ? "Log in" : "Sign up"}
              </Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "center",
  },
  title: {},
  logo: {
    flex: 1,
    height: 35,
    width: 130,
    alignSelf: "center",
    margin: 30,
    marginTop: 100,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#1B1B1B",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
    color: "red",
  },
  button: {
    backgroundColor: "red",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#fff",
  },
  footerLink: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
});
