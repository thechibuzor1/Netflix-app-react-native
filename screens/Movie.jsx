import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { imageUrl, API_KEY } from "../constants";
import axios from "../Axios";
import YoutubePlayer from "react-native-youtube-iframe";
import { Video, AVPlaybackStatus } from "expo-av";
import Icon from "react-native-vector-icons/FontAwesome";
import ColumnPosts from "../components/ColumnPost";
import Axios from "axios";
import { useSelector } from "react-redux";
import Notification from "../components/Notification";

export default function Movie({ route, navigation }) {
  const { userData } = useSelector((state) => state.userReducer);
  const { movie } = route.params;
  const img_url = imageUrl + movie.backdrop_path;
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [activeTab, setActive] = useState("similar");
  const [urlId, setUrlId] = useState("");
  const similarUrl = `${movie.id}//similar?api_key=${API_KEY}&language=en-US&page=1`;
  const [inList, setInlist] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowNotif(false);
    }, 3000);
  }, [showNotif]);

  const URL = "https://netflix-app-backend.herokuapp.com/api/users";
  const fetchCheck = async () => {
    try {
      const result = await Axios.post(
        `${URL}/checklist`,
        {
          title: movie.title || movie.name,
        },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      setInlist(result.data.InLIst);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchCheck();
  }, [movie]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve(
      axios.get(`/movie/${movie.id}/videos?api_key=${API_KEY}&language=en-US`)
    )
      .then((response) => {
        if (isMounted) {
          setUrlId(response.data.results[0].key);
        }
      })
      .catch(() => {
        Promise.resolve(
          axios.get(`/tv/${movie.id}/videos?api_key=${API_KEY}&language=en-US`)
        ).then((response) => {
          if (isMounted) {
            setUrlId(response.data.results[0].key);
          }
        });
      });

    //clean up
    return () => {
      isMounted = false;
    };
  }, [movie.id]);

  const addToList = (movie) => {
    try {
      Axios.post(
        `${URL}/list`,
        {
          movie: movie,
          title: movie.title || movie.name,
        },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const removeFromList = (movie) => {
    try {
      Axios.delete(`${URL}/list/${movie.title || movie.name}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
    } catch (err) {
      console.log(err);
    }
  };
  const addToHistory = (movie) => {
    try {
      Axios.post(
        `${URL}/history`,
        {
          movie: movie,
          title: movie.title || movie.name,
        },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      backgroundColor: "black",
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
    search: {
      color: "white",
      fontSize: 20,
      marginRight: 15,
      marginTop: 5,
      fontWeight: "500",
    },
    video: {
      width: "100%",
      height: 400,
    },
    button: {
      backgroundColor: "white",
      marginLeft: 30,
      marginRight: 30,
      height: 48,
      marginTop: 20,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonTitle: {
      color: "black",
      fontSize: 16,
      fontWeight: "bold",
    },
    poster: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignSelf: "center",
    },
    playpause: {
      color: "black",
      marginRight: 5,
      marginTop: 5,
    },
    description: {
      color: "white",
      marginLeft: 30,
      marginRight: 30,
      marginTop: 15,
    },
    Title: {
      color: "white",
      fontSize: 30,
      fontWeight: "bold",
    },
    descContent: {
      marginTop: 5,
      color: "white",
      fontSize: 15,
    },
    Type: {
      marginTop: 5,
      color: "white",
      fontSize: 10,
      fontWeight: "bold",
      marginRight: 5,
    },
    date: {
      color: "white",
      fontSize: 15,
      marginTop: 5,
      fontWeight: "bold",
    },
    List: {},
    add: {
      backgroundColor: "transparent",
      marginLeft: 30,
      marginRight: 30,
      height: 70,
      marginTop: 20,
      width: "15%",
      borderRadius: 50,
    },
    remove: {
      backgroundColor: "transparent",
      marginLeft: 30,
      marginRight: 30,
      height: 70,
      marginTop: 20,
      width: "15%",
      borderRadius: 50,
    },
    addText: {
      color: "white",
      alignSelf: "center",
      fontSize: 10,
    },
    moreBtn: {
      flexDirection: "row",
      marginTop: 20,
    },
    similarBtn: {
      backgroundColor: activeTab === "similar" ? "red" : "black",
      marginLeft: 30,
      marginRight: 10,
      height: 50,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    trailerBtn: {
      backgroundColor: activeTab === "trailer" ? "red" : "black",
      marginLeft: 30,
      marginRight: 10,
      height: 50,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    similarTxt: {
      color: "white",
      marginLeft: 10,
      marginRight: 10,
    },
    trailer: {
      marginTop: 30,
    },
  });
  return (
    <View style={styles.container}>
      {showNotif && (
        <Notification
          text={inList ? "Added to My  List" : "Removed from My List"}
        />
      )}

      <View
        style={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "space-between",
          marginTop: 40,
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon style={styles.back} name="arrow-left" />
        </TouchableOpacity>
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Video
          ref={video}
          style={styles.video}
          posterSource={{
            uri: img_url,
          }}
          usePoster={true}
          posterStyle={styles.poster}
          source={require("../assests/Rick.mp4")}
          resizeMode="contain"
          isLooping
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />

        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              addToHistory(movie);
              status.isPlaying
                ? video.current.pauseAsync()
                : video.current.playAsync();
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Text style={styles.playpause}>
                {status.isPlaying ? (
                  <Icon name="pause" />
                ) : (
                  <Icon name="play" />
                )}
              </Text>
              <Text style={styles.buttonTitle}>
                {status.isPlaying ? "Pause" : "Play"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.description}>
          <Text style={styles.Title}>{movie.title || movie.name}</Text>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Text style={styles.Type}>{movie.media_type}</Text>
            <Text style={styles.Type}>{movie.original_language}</Text>
          </View>

          <Text style={styles.descContent}>{movie.overview}</Text>
          <Text style={styles.date}>
            Release Date: {movie.release_date || movie.first_air_date}
          </Text>
        </View>
        <View style={styles.List}>
          {inList ? (
            <TouchableOpacity
              style={styles.remove}
              onPress={() => {
                setShowNotif(true);
                setInlist(!inList);
                removeFromList(movie);
              }}
            >
              <Icon
                style={{
                  fontSize: 30,
                  fontWeight: "300",
                  alignSelf: "center",
                  color: "white",
                }}
                name="check"
              />
              <Text style={styles.addText}>My List</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.add}
              onPress={() => {
                setShowNotif(true);
                setInlist(!inList);
                addToList(movie);
              }}
            >
              <Icon
                style={{
                  fontSize: 30,
                  fontWeight: "300",
                  alignSelf: "center",
                  color: "white",
                }}
                name="plus"
              />
              <Text style={styles.addText}>My List</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.moreBtn}>
          <TouchableOpacity
            style={styles.similarBtn}
            onPress={() => setActive("similar")}
          >
            <Text style={styles.similarTxt}>More like this</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.trailerBtn}
            onPress={() => {
              setActive("trailer");
            }}
          >
            <Text style={styles.similarTxt}>Trailer & more</Text>
          </TouchableOpacity>
        </View>
        {activeTab === "similar" && (
          <ColumnPosts
            navigation={navigation}
            url={similarUrl}
            title="Similar Watch"
          />
        )}
        {activeTab === "trailer" && (
          <View style={styles.trailer}>
            <YoutubePlayer
              height={300}
              play={true}
              videoId={urlId.toString()}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
