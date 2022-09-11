import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";

import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector } from "react-redux";
import MyListCol from "../components/MyListCol";

const Mylist = ({ navigation }) => {
  const { userData } = useSelector((state) => state.userReducer);
  const [myList, setMyList] = useState([]);
  const URL = "https://netflix-app-backend.herokuapp.com/api/users";
  useEffect(() => {
    const fetchList = async () => {
      const myList = [];
      try {
        return fetch(`${URL}/list`, {
          headers: {
            authorization: `Bearer ${userData.token}`,
          },
        })
          .then((response) => response.json())
          .then((result) => {
            for (const element of result.list) {
              myList.push(element.movie[0]);
            }
            setMyList(myList);
          });
      } catch (err) {
        console.log(err);
      }
    };
    fetchList();
  }, [userData.token]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          display: "flex",

          marginTop: 50,
          marginBottom: 50,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon style={styles.back} name="arrow-left" />
        </TouchableOpacity>
        <Text style={styles.header}>My List</Text>
      </View>
      <View>
        {myList.length > 0 ? (
          <MyListCol movies={myList} navigation={navigation} />
        ) : (
          <View
            style={{
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "gray",
                fontSize: 25,
                fontWeight: "bold",
                alignSelf: "center",
              }}
            >
              Your list is empty.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Mylist;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
  },

  header: {
    color: "white",
    fontSize: 20,
    marginLeft: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  back: {
    color: "white",
    marginTop: 10,
    marginLeft: 25,
    fontSize: 20,
  },
});
