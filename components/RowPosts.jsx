import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { createRef, useEffect, useRef, useState } from "react";
import axios from "../Axios";
import { TouchableOpacity } from "react-native-gesture-handler";

const RowPosts = ({ navigation, ...props }) => {
  const [movies, setMovies] = useState([]);
  const imgRef = useRef([]);

  useEffect(() => {
    let isMounted = true;
    new Promise((resolve, reject) => {
      resolve(axios.get(props.url));
    }).then((response) => {
      if (isMounted) {
        setMovies(response.data.results);
      }
    });
    //clean up
    return () => {
      isMounted = false;
    };
  }, [props.url]);
  imgRef.current = movies.map((_, i) => imgRef.current[i] ?? createRef());
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <FlatList
        data={movies}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            key={item.id}
            style={{ alignItems: "center" }}
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
              Propref={(x) => (imgRef.current[index] = x)}
            />
          </TouchableOpacity>
        )}
        horizontal={true}
        scrollEnabled
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default RowPosts;

const MovieImage = (props) => {
  return (
    <>
      <Image
        source={{
          uri: props.image,
        }}
        style={styles.poster}
        ref={props.Propref}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    height: 300,
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
    borderRadius: 5,
    marginLeft: 7,
    alignSelf: "center",
  },
});
