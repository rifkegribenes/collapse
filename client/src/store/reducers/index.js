import { combineReducers } from "redux";
import stock from "../reducers/stock";
import {reducer as toastrReducer} from 'react-redux-toastr';

const rootReducer = combineReducers({
  stock,
  toastr: toastrReducer
});

export default rootReducer;