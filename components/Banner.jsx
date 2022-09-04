import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "../Axios";
import { imageUrl } from "../constants";
import { trending } from "../urls";
import React, { useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";

const Banner = ({ navigation, ...prop }) => {
  const imgRef = useRef(null);
  const [movie, setMovie] = useState();
  useEffect(() => {
    let isMounted = true;
    new Promise((resolve, reject) => {
      resolve(axios.get(prop.url));
    }).then((response) => {
      if (isMounted) {
        setMovie(
          response.data.results[
            Math.floor(Math.random() * response.data.results.length)
          ]
        );
      }
    });
    //clean up
    return () => {
      isMounted = false;
    };
  }, [prop.url]);
  return (
    <View style={styles.banner}>
      <ImageBackground
        source={{
          uri: `${movie ? imageUrl + movie.poster_path : ""}`,
        }}
        style={styles.image}
        ref={imgRef}
      >
        <View style={styles.top}>
          <Image style={styles.logo} source={require("../assests/logo.png")} />
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate("Discover")}>
              <Icon style={styles.search} name="search" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Account")}>
              <Image
                style={styles.avatar}
                source={require("../assests/avatar.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.banner_buttons}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Movie", {
                  movie: movie,
                })
              }
            >
              <Text style={styles.button}>Play</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>
            {movie ? movie.overview.slice(0, 100) + "..." : ""}
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Banner;

const styles = StyleSheet.create({
  banner: {
    height: 700,
    width: "100%",
    color: "white",
    backgroundColor: "black",
  },
  top: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
    height: "88%",
  },
  search: {
    color: "white",
    fontSize: 25,
    marginRight: 15,
    fontWeight: "500",
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 5,
  },
  logo: {
    height: 40,
    width: 25,
  },
  image: {
    height: "100%",
    width: "100%",
    alignSelf: "center",
    resizeMode: "center",
    justifyContent: "center",
  },
  content: {
    position: "absolute",
    bottom: 50,
    left: "5%",
    right: "5%",
    color: "white",
  },
  title: {
    fontSize: 25,
    color: "white",
  },
  banner_buttons: {
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: "red",
    padding: 10,
    width: 100,
    textAlign: "center",
    alignSelf: "center",
    borderRadius: 5,
    marginRight: 10,
    color: "white",
  },
  list_button: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    color: "black",
  },
  description: {
    width: 400,
    color: "white",
    marginTop: 10,
    marginRight: 10,
  },
});
