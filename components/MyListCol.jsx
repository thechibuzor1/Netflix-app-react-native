import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";

import { FlatGrid } from "react-native-super-grid";

const MyListCol = ({ navigation, ...props }) => {
  return (
    <View style={styles.container}>
      <FlatGrid
        itemDimension={130}
        data={props.movies}
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
export default MyListCol;

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
