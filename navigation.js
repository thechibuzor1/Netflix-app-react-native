import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import Home from "./screens/Home";
import SplashScreen from "./screens/SplashScreen";
import { Provider as ReduxProvider } from "react-redux";
import configureStore from "./redux/store";
import AuthScreen from "./screens/Auth";
import Watching from "./screens/Watching";
import Movie from "./screens/Movie";
import Discover from "./screens/Discover";
import Account from "./screens/Account";
import Mylist from "./screens/Mylist";

const store = configureStore();

export default function RootNavigation() {
  const Stack = createStackNavigator();

  const screenOptions = {
    headerShown: false,
    animationEnabled: false,
  };
  return (
    <ReduxProvider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={screenOptions}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Watching" component={Watching} />
          <Stack.Screen name="Movie" component={Movie} />
          <Stack.Screen name="Discover" component={Discover} />
          <Stack.Screen name="Account" component={Account} />
          <Stack.Screen name="MyList" component={Mylist} />
        </Stack.Navigator>
      </NavigationContainer>
    </ReduxProvider>
  );
}
