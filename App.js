import * as React from "react";
import { LogBox } from "react-native";
import 'react-native-gesture-handler';
import RootNavigation from "./navigation";

LogBox.ignoreAllLogs();

export default function App() {
  return <RootNavigation/>; 
  
}
