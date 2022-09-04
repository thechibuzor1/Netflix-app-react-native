import { combineReducers } from "redux";
import userReducer from "./userReducer";

let reducers = combineReducers({
  userReducer: userReducer,
});

const rootReducers = (state, action) => {
  return reducers(state, action);
};

export default rootReducers;
