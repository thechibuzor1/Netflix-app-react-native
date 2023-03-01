import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
} from "react-native";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import { TextInput } from "react-native-paper";
import ToastManager, { Toast } from "toastify-react-native";

const Account = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { userData } = useSelector((state) => state.userReducer);
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  const URL = "https://netflix-clone-backend-uoju.onrender.com/api/users";
  const signOut = async () => {
    await AsyncStorage.removeItem("userData");
    navigation.navigate("Auth");
  };
  const [modal, setModal] = useState(false);

  const validateEmail = (email) => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const submitHandler = async () => {
    if (!validateEmail(email)) {
      alert("Invalid Email Format!");
      return;
    }
    if (password.length < 6) {
      alert("Password must be a minimum 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${URL}/profile`,
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      dispatch({
        type: "USER_SIGNIN",
        payload: data,
      });
      AsyncStorage.setItem("userData", JSON.stringify(data));
      setLoading(false);
      console.log(data);
      setModal(false);
      Toast.success("Profile update sucessfull");
    } catch (err) {
      Toast.error(err);
      setLoading(false);
    }
    setLoading(false);
  };
  const accountModal = () => {
    return (
      <>
        <View style={styles.modalContainer}>
          <ToastManager
            position="bottom"
            positionValue={0}
            style={{
              backgroundColor: "black",
            }}
          />
          <View style={styles.accountContainer}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setModal(false);
                }}
              >
                <Icon style={styles.Modalback} name="arrow-left" />
              </TouchableOpacity>
              <Text style={styles.modalHeading}>Edit Account Info</Text>
            </View>

            <KeyboardAwareScrollView
              style={{ flex: 1, width: "100%" }}
              keyboardShouldPersistTaps="always"
            >
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
              <TextInput
                style={styles.input}
                activeUnderlineColor={"red"}
                placeholder="E-mail"
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setEmail(text)}
                value={email}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
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
              <TouchableOpacity style={styles.button} onPress={submitHandler}>
                <Text style={styles.buttonTitle}>Save Changes</Text>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </>
    );
  };
  return (
    <>
      <Modal
        animationType="slide"
        visible={modal}
        transparent={true}
        onRequestClose={() => setModal(false)}
      >
        {accountModal()}
      </Modal>

      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            display: "flex",

            marginTop: 50,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Icon style={styles.back} name="arrow-left" />
          </TouchableOpacity>
          <Text style={styles.header}>Profile & More</Text>
        </View>
        <View style={styles.body}>
          <Image
            style={styles.avatar}
            source={require("../assests/avatar.png")}
          />
          <Text
            style={{
              color: "white",
              alignSelf: "center",
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 30,
            }}
          >
            {userData.name}
          </Text>
          <TouchableOpacity
            style={styles.section}
            onPress={() => navigation.navigate("MyList")}
          >
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
                marginBottom: 15,
              }}
            >
              <Icon style={styles.listIcon} name="list" />
              <Text style={styles.text}>My List</Text>
            </View>
            <Icon style={styles.goIcon} name="angle-right" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.section}
            onPress={() => setModal(true)}
          >
            <View
              style={{
                flexDirection: "row",
                marginTop: 15,
                marginBottom: 15,
              }}
            >
              <Icon style={styles.accountIcon} name="user" />
              <Text style={styles.text}>Account</Text>
            </View>
            <Icon style={styles.goIcon} name="angle-right" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => signOut()}>
            <Text
              style={{
                color: "gray",
                alignSelf: "center",
                marginTop: 15,
                fontSize: 15,
              }}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {loading && (
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
      )}
    </>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "black",
  },
  avatar: {
    height: 250,
    width: 250,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 15,
    borderColor: "white",
    borderWidth: 3,
    borderRadius: 5,
  },
  body: {
    marginTop: 30,
  },
  text: {
    color: "white",
    fontSize: 20,
    marginLeft: 10,
  },
  header: {
    color: "white",
    fontSize: 20,
    marginLeft: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  listIcon: {
    color: "white",
    fontSize: 20,
    marginLeft: 30,
    marginTop: 5,
  },
  accountIcon: {
    color: "white",
    fontSize: 20,
    marginLeft: 30,
    marginTop: 5,
    marginRight: 5,
  },
  section: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1B1B1B",
    borderRadius: 5,
    width: "95%",
    alignSelf: "center",
    marginBottom: 15,
  },
  goIcon: {
    marginRight: 30,
    color: "gray",

    fontSize: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  back: {
    color: "white",
    marginTop: 10,
    marginLeft: 25,
    fontSize: 20,
  },
  Modalback: {
    color: "white",
    marginLeft: 5,
    fontSize: 20,
    marginRight: 20,
  },
  accountContainer: {
    borderRadius: 5,
    backgroundColor: "#1B1B1B",
    padding: 16,
    height: 480,
    borderWidth: 1,
    justifyContent: "center",
  },
  modalHeading: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 20,
    color: "red",
    alignSelf: "center",
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
    color: "white",
    backgroundColor: "#1B1B1B",
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
});
