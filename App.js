//import { StatusBar } from "expo-status-bar";
import React, {
  useReducer,
  useEffect,
  useState,
  componentDidMount,
} from "react";
import AppLoading from "expo-app-loading";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  Platform,
} from "react-native";
import * as Font from "expo-font";

import admob, {
  AdsConsent,
  MaxAdContentRating,
  InterstitialAd,
  RewardedAd,
  BannerAd,
  TestIds,
  BannerAdSize,
} from "@react-native-firebase/admob";
//AdMob//

import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  setTestDeviceIDAsync,
} from "expo-ads-admob";

import ApiKeys from "./constants/ApiKeys";
import * as firebase from "firebase";

//import Constants from "expo-constants";

//import { UMP } from "react-native-ad-consent";

///////

/////

import Home from "./components/Home";

export default function App() {
  //Firebase//
  const startFirebase = () => {
    //console.log("firebase initing");
    firebase.initializeApp(ApiKeys.FirebaseConfig);
  };
  //Handle Font
  const getFonts = async () => {
    await Font.loadAsync({
      "OpenSans-BoldItalic": require("./assets/fonts/OpenSans-BoldItalic.ttf"),
      "OpenSans-talic": require("./assets/fonts/OpenSans-Italic.ttf"),
      "OpenSans-Bold": require("./assets/fonts/OpenSans-Bold.ttf"),
    });
  };

  const [fontsLoaded, setFontsLoaded] = useState(false);

  const showEnvironment = () => {
    alert(
      "You are in developer environment:" +
        __DEV__ +
        " with the id of: " +
        adUnitID
    );
  };

  useEffect(() => {
    //showEnvironment();
    startFirebase();
  }, []);

  //Consent

  //Production key//

  const testID = "ca-app-pub-3940256099942544/6300978111";
  const productionID = "ca-app-pub-3054208868832572/2235492939";
  const adUnitID = !__DEV__ ? productionID : testID;

  const bannerError = (e) => {
    alert(e);
  };

  ////////////////

  ////
  if (fontsLoaded) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("./assets/background.jpg")}
          style={styles.background}
        >
          <Home />

          <AdMobBanner
            bannerSize="smartBanner"
            adUnitID={adUnitID}
            servePersonalizedAds={false} // true or false
            onDidFailToReceiveAdWithError={(e) => {
              bannerError(e);
            }}
          />
        </ImageBackground>
      </View>
    );
  } else {
    return (
      <AppLoading
        startAsync={getFonts}
        onFinish={() => setFontsLoaded(true)}
        onError={() => console.log("error")}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
});
