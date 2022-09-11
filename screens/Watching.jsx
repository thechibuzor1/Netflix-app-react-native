import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Alert,
} from "react-native";
import React, { useEffect }from "react";

const Watching = ({ route, navigation }) => {
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert("Hold on!", "Are you sure you want to leave???", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  const { data } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.Text}>Who's Watching?</Text>
      <TouchableOpacity
        style={{
          borderColor: "white",
          borderWidth: 1,
          width: 100,
        }}
        onPress={() => {
          navigation.navigate("Home");
        }}
      >
        <Image style={styles.image} source={require("../assests/avatar.png")} />
      </TouchableOpacity>
      <Text style={styles.Text_small}>{data.name}</Text>
    </View>
  );
};

export default Watching;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  Text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 50,
  },
  Text_small: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
  },
  image: {
    height: 100,
    width: 100,
  },
});
