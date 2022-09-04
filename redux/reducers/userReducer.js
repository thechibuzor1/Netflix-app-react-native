let initialState = {
  userData: null,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case "USER_SIGNIN":
      return { ...state, userData: action.payload };
    case "USER_SIGNOUT":
      return { ...state };
    default:
      return state;
  }
}
