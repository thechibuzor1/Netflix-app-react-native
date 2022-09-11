import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { createRef, useEffect, useRef, useState } from "react";

const MyListRow = ({ navigation, ...props }) => {
  const imgRef = useRef([]);
  imgRef.current = props.movies.map((_, i) => imgRef.current[i] ?? createRef());
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>

      <FlatList
        data={props.movies}
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

export default MyListRow;

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
    borderRadius: 3,
    marginLeft: 20,
    alignSelf: "center",
  },
});
