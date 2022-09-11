import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  discover,
  upcoming,
  genre,
  discover_Tv,
  nowPlaying,
  topRated,
  popularTv,
  topRatedTv,
  airingToday,
  onTheAir,
  genreTv,
} from "../urls";
import RowPosts from "../components/RowPosts";
import axios from "../Axios";
import LottieView from "lottie-react-native";
import { API_KEY } from "../constants";

const Discover = ({ navigation }) => {
  const [genreListMovie, setGenreListMovie] = useState([]);
  const [genreListTv, setGenreListTv] = useState([]);
  const [searchText, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState("movie");
  const [searchUrl, setSearchUrl] = useState(``);
  const [searchTvUrl, setSearchTvUrl] = useState(``);
  const [searchActorId, setSearchActorId] = useState(``);
  const [searchActor, setSearchActor] = useState([]);

  const searchPeople = (prop) => {
    setSearchActor([]);
    axios
      .get(`search/person?api_key=${API_KEY}&language=en-US&query=${prop}`)
      .then((res) => {
        if (res.data.results.length !== 0) {
          setSearchActor(res.data.results);
          setSearchActorId(res.data.results[0].id);
          setLoading(false);
        }
      });
  };

  const handleSearch = (prop) => {
    setResults([]);

    if (prop.length > 0) {
      setLoading(true);
      searchPeople(prop);
      axios
        .get(`search/movie?api_key=${API_KEY}&language=en-US&query=${prop}`)
        .then((res) => {
          if (res.data.results.length !== 0) {
            setResults(res.data.results);
            setSearchUrl(
              `search/movie?api_key=${API_KEY}&language=en-US&query=${prop}`
            );
            setSearchTvUrl(
              `search/tv?api_key=${API_KEY}&language=en-US&query=${prop}`
            );
            setLoading(false);
          } else {
            setLoading(false); // if no results found
          }
        });
    }
  };

  useEffect(() => {
    handleSearch(searchText);
  }, [searchText]);

  useEffect(() => {
    axios
      .get(genre) // get genre list
      .then((res) => {
        setGenreListMovie(res.data.genres);
      });
    axios
      .get(genreTv) // get genre list
      .then((res) => {
        setGenreListTv(res.data.genres);
      });
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
          marginTop: 40,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon style={styles.back} name="arrow-left" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Account")}>
          <Image
            style={styles.avatar}
            source={require("../assests/avatar.png")}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <View style={styles.inputField}>
            <Icon style={styles.search} name="search" />

            <TextInput
              style={styles.input}
              placeholder="Search Tv shows or Movie"
              placeholderTextColor="#aaaaaa"
              onChangeText={(text) => setSearch(text)}
              value={searchText}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            />
          </View>
          {searchText.length !== 0 ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Icon style={styles.closeSeach} name="close" />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </View>
      {searchText.length !== 0 ? (
        <ScrollView>
          {results.length !== 0 && (
            <>
              <RowPosts
                title="Search Results: Movies"
                /* url={`/${result.media_type || "movie"}/${
              result.title || result.name
            }`} */
                url={searchUrl}
                navigation={navigation}
              />
              <RowPosts
                title="Search Results: TV Shows"
                /* url={`/${result.media_type || "movie"}/${
              result.title || result.name
            }`} */
                url={searchTvUrl}
                navigation={navigation}
              />
            </>
          )}
          {searchActor.length !== 0 && (
            <>
              <RowPosts
                title="Search Results: Actor"
                url={`/discover/movie?api_key=${API_KEY}&with_people=${searchActorId}&sort_by=popularity.desc`}
                navigation={navigation}
              />
            </>
          )}
          {results.length === 0 && searchActor.length === 0 && (
            <View>
              <Text
                style={{
                  color: "gray",
                  marginTop: 20,
                  fontSize: 20,
                  alignSelf: "center",
                }}
              >
                Sigh... No Results Were Found.
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <>
          <Text style={styles.discoverTxt}>Discover</Text>
          <View style={styles.switch}>
            <TouchableOpacity onPress={() => setActive("movie")}>
              <Text
                style={
                  active === "movie"
                    ? styles.switchActive
                    : styles.switchInActive
                }
              >
                Movies
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActive("tv")}>
              <Text
                style={
                  active === "tv" ? styles.switchActive : styles.switchInActive
                }
              >
                Tv Shows
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {active === "movie" && (
              <View style={styles.movieDiscover}>
                <RowPosts
                  navigation={navigation}
                  url={discover}
                  title="Discover Movies"
                />
                <RowPosts
                  navigation={navigation}
                  url={upcoming}
                  title="Upcoming Movies"
                />
                <RowPosts
                  navigation={navigation}
                  url={nowPlaying}
                  title="Now Playing"
                />
                <RowPosts
                  navigation={navigation}
                  url={topRated}
                  title="Top Rated"
                />
                {genreListMovie.map((genre, index) => (
                  <View key={index}>
                    <RowPosts
                      navigation={navigation}
                      url={`discover/movie?api_key=${API_KEY}&with_genres=${genre.id}`}
                      title={genre.name}
                    />
                  </View>
                ))}
              </View>
            )}
            {active === "tv" && (
              <View style={styles.tvDiscover}>
                <RowPosts
                  navigation={navigation}
                  url={discover_Tv}
                  title="Discover Tv Shows"
                />
                <RowPosts
                  navigation={navigation}
                  url={topRatedTv}
                  title="Top Rated"
                />
                <RowPosts
                  navigation={navigation}
                  url={popularTv}
                  title="Popular"
                />
                <RowPosts
                  navigation={navigation}
                  url={airingToday}
                  title="Airing Today"
                />
                <RowPosts
                  navigation={navigation}
                  url={onTheAir}
                  title="On Air"
                />
                {genreListTv.map((genre) => (
                  <RowPosts
                    navigation={navigation}
                    url={`discover/tv?api_key=${API_KEY}&with_genres=${genre.id}`}
                    title={genre.name}
                  />
                ))}
              </View>
            )}
            <Text style={styles.footer}>
              The_chibuzor. Copyright &copy; 2022
            </Text>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default Discover;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
  },
  footer: {
    alignSelf: "center",
    color: "gray",
    marginTop: 15,
    marginBottom: 15,
  },
  header: {
    marginTop: 30,
    flexDirection: "row",
  },
  inputField: {
    flexDirection: "row",
    marginLeft: 15,
  },
  input: {
    color: "white",
    width: "85%",
  },
  search: {
    color: "white",
    marginRight: 10,
    marginTop: 7,
    marginLeft: 5,
  },
  closeSeach: {
    color: "white",
    marginRight: 10,
    marginTop: 7,
    marginLeft: 15,
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 5,
    marginRight: 25,
  },
  back: {
    color: "white",
    marginTop: 5,
    marginLeft: 25,
    fontSize: 20,
  },
  switch: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  switchActive: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },
  switchInActive: {
    color: "gray",
    fontSize: 25,
    fontWeight: "bold",
  },
  discoverTxt: {
    color: "red",
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },
});
