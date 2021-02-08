import React, { useReducer, useEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  ImageBackground,
  Image,
  Animated,
} from "react-native";

export default function Home() {
  //Set State
  const initialState = {
    QuoteReady: false,
    HideButton: false,
    Loading: false,
    Data: {},
    Title: null,
    Content: null,
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  /////////////

  const reducer = (state, action) => {
    if (action.type === "QuoteIsReady") {
      return { ...state, QuoteReady: true };
    } else if (action.type === "QuoteIsUnready") {
      return { ...state, QuoteReady: false };
    } else if (action.type === "HideButton") {
      return { ...state, HideButton: true };
    } else if (action.type === "UnhideButton") {
      return { ...state, HideButton: false };
    } else if (action.type === "ChangeLoadingStateTrue") {
      return { ...state, Loading: true };
    } else if (action.type === "ChangeLoadingStateFalse") {
      return { ...state, Loading: false };
    } else if (action.type === "SetData") {
      return { ...state, Data: action.payload };
    } else if (action.type === "SetTitle") {
      return { ...state, Title: action.payload };
    } else if (action.type === "SetContent") {
      return { ...state, Content: action.payload };
    } else {
      return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  //Get Data from API//////
  const getData = async () => {
    fetch("https://quoteserverbible.herokuapp.com/api", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        dispatch({
          type: "SetData",
          payload: data,
        });
      })
      .catch((err) => {
        console.error(err);
        //console.log("data not loaded");
      });
  };

  useEffect(() => {
    getData();
  }, []);

  //Animation///

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: true,
    }).start();
  };

  //////////

  const OnbtnPressed = (database) => {
    dispatch({
      type: "HideButton",
    });

    dispatch({
      type: "ChangeLoadingStateTrue",
    });

    const randomNumber = Math.floor(Math.random() * database.results.length);
    //console.log(randomNumber);
    dispatch({
      type: "SetTitle",
      payload: database.results[randomNumber].title,
    });
    dispatch({
      type: "SetContent",
      payload: database.results[randomNumber].content,
    });

    setTimeout(() => {
      fadeIn();
      dispatch({
        type: "QuoteIsReady",
      });
      dispatch({
        type: "ChangeLoadingStateFalse",
      });
    }, 3000);
  };

  ///////////

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate your Bible Quote</Text>

      {state.HideButton === false ? (
        <View style={{ margin: "10%" }}>
          <Button
            title="Generate Quote"
            onPress={() => {
              OnbtnPressed(state.Data);
            }}
          ></Button>
        </View>
      ) : null}

      {state.Loading === true ? (
        <Image
          source={require("../assets/loading.gif")}
          style={{
            width: 50,
            height: 50,

            justifyContent: "center",
          }}
        />
      ) : null}

      {state.QuoteReady === true ? (
        <View style={styles.quotebox}>
          <Animated.View
            style={[
              {
                opacity: fadeAnim, // Bind opacity to animated value
              },
            ]}
          >
            <Text style={{ fontWeight: "bold" }}>{state.Title}</Text>
            <Text>{state.Content}</Text>
          </Animated.View>
          <View style={{ margin: "10%" }}>
            <Button
              title="Back"
              onPress={async () => {
                dispatch({
                  type: "UnhideButton",
                });
                dispatch({
                  type: "QuoteIsUnready",
                });
              }}
            ></Button>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  title: { fontFamily: "OpenSans-BoldItalic" },
  quotebox: { width: "60%", margin: "5%" },
});
