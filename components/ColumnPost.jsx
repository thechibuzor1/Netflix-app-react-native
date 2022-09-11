import { Image, ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "../Axios";
import { FlatGrid } from "react-native-super-grid";

const ColumnPosts = ({ navigation, ...props }) => {
  const [movies, setMovies] = useState([]);
  const url = props.url;
  const movieUrl = `/movie/` + url;
  const tvUrl = `/tv/` + url;
  useEffect(() => {
    axios
      .get(movieUrl)
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch(() => {
        axios.get(tvUrl).then((response) => {
          setMovies(response.data.results);
        });
      });
  }, [movieUrl, tvUrl]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <FlatGrid
        itemDimension={130}
        data={movies}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            key={item.id}
            style={{
              marginBottom: 30,
            }}
            onPress={() =>
              navigation.navigate("Movie", {
                movie: item,
              })
            }
          >
            <MovieImage
              image={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/original${item.poster_path}`
                  : null
              }
              isSmall
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ColumnPosts;

const MovieImage = (props) => {
  return (
    <>
      <Image
        source={{
          uri: props.image,
        }}
        style={styles.poster}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
  items: {
    flex: 1,
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  poster: {
    height: 200,
    width: 130,
    borderRadius: 3,
    marginLeft: 20,
  },
});
