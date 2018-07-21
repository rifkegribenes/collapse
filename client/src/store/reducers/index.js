import { combineReducers } from "redux";
import appState from "../reducers/appState";
import stock from "../reducers/stock";

const rootReducer = combineReducers({
  appState,
  stock
});

export default rootReducer;