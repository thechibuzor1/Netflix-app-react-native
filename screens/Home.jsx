import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  BackHandler,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import axios from "../Axios";
import Axios from "axios";
import {
  trending,
  originals,
  action,
  horror,
  comedy,
  romance,
  documentaries,
  theatres,
  rated,
  popular,
  kids,
  best,
} from "../urls";
import RowPosts from "../components/RowPosts";
import { useSelector } from "react-redux";
import MyListRow from "../components/MyListRow";

const Home = ({ navigation }) => {
  const { userData } = useSelector((state) => state.userReducer);
  const [myList, setMyList] = useState([]);

  const [myHistory, setMyHistory] = useState([]);
  const URL = "https://netflix-app-backend.herokuapp.com/api/users";

  useEffect(() => {
    const fetchList = async () => {
      const myList = [];
      try {
        const result = await Axios.get(`${URL}/list`, {
          headers: {
            authorization: `Bearer ${userData.token}`,
          },
        });

        for (const element of result.data.list) {
          myList.push(element.movie[0]);
        }
        setMyList(myList); // set myList to the result of the axios request
      } catch (err) {
        console.log(err);
      }
    };
    const fetchHistory = async () => {
      const myHistory = [];
      try {
        const result = await Axios.get(`${URL}/history`, {
          headers: {
            authorization: `Bearer ${userData.token}`,
          },
        });
        for (const element of result.data.history) {
          myHistory.push(element.movie[0]);
        }
        setMyHistory(myHistory); // set myHistory to the result of the axios request
      } catch (err) {
        console.log(err);
      }
    };
    fetchList();
    fetchHistory();
  }, [userData.token]);

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

  return (
    <ScrollView style={styles.container}>
      <Banner navigation={navigation} url={trending} />
      <RowPosts
        navigation={navigation}
        url={trending}
        title={`Top Picks for ${userData.name}`}
      />
      {myList.length > 0 ? (
        <MyListRow navigation={navigation} movies={myList} title="My List" />
      ) : (
        <></>
      )}
      {myHistory.length > 0 ? (
        <MyListRow
          navigation={navigation}
          movies={myHistory}
          title="Watch it Again"
        />
      ) : (
        <></>
      )}
      <RowPosts
        navigation={navigation}
        url={originals}
        title="Only On Netflix"
      />
      <RowPosts navigation={navigation} url={popular} title="Popular" />
      <RowPosts navigation={navigation} url={horror} title="Horror" />
      <RowPosts navigation={navigation} url={action} title="Action" />
      <RowPosts navigation={navigation} url={comedy} title="Comedy" />
      <RowPosts navigation={navigation} url={best} title="Best of 2010" />
      <RowPosts navigation={navigation} url={kids} title="Popular With Kids" />
      <RowPosts navigation={navigation} url={romance} title="Romance" />
      <RowPosts navigation={navigation} url={rated} title="R rated" />
      <RowPosts
        navigation={navigation}
        url={documentaries}
        title="Documentaries"
      />
      <Text style={styles.footer}>The_chibuzor. Copyright &copy; 2022</Text>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
  footer: {
    alignSelf: "center",
    color: "gray",
    marginTop: 15,
    marginBottom: 15,
  },
});
