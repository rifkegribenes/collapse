import update from "immutability-helper";

import {
  TOGGLE_REFRESH
} from "../actions";
import {
  GET_ALL_STOCKS_REQUEST,
  GET_ALL_STOCKS_SUCCESS,
  GET_ALL_STOCKS_FAILURE,
  ADD_STOCK_REQUEST,
  ADD_STOCK_SUCCESS,
  ADD_STOCK_FAILURE,
  REMOVE_STOCK_REQUEST,
  REMOVE_STOCK_SUCCESS,
  REMOVE_STOCK_FAILURE,
} from "../actions/apiActions";

const INITIAL_STATE = {
  errorMsg: "",
  spinnerClass: "spinner__hide",
  stocks: [],
  refresh: false
};

function stock(state = INITIAL_STATE, action) {
  let error;

  switch (action.type) {

    case GET_ALL_STOCKS_REQUEST:
    case ADD_STOCK_REQUEST:
    case REMOVE_STOCK_REQUEST:
      return Object.assign({}, state, {
        spinnerClass: "spinner__show",
        errorMsg: "",
        refresh: false
      });

    case ADD_STOCK_SUCCESS:
    case "server/addStock":  // called from socket
    case "server/removeStock":  // called from socket
    case REMOVE_STOCK_SUCCESS:
    case TOGGLE_REFRESH:

      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        refresh: { $set: false }
      });

   case 'getallStocks': // called from socket
      console.log(action.payload);
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        refresh: true
      });

    case GET_ALL_STOCKS_SUCCESS:
      console.log(action.payload);
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        stocks: [...action.payload],
        refresh: false
      });

    case GET_ALL_STOCKS_FAILURE:
    case REMOVE_STOCK_FAILURE:
    case ADD_STOCK_FAILURE:
      console.log(action.payload);
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      console.log(error);
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        errorMsg: error
      });

    default:
      return state;
  }
}

export default stock;
