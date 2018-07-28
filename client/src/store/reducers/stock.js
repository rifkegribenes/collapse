import update from "immutability-helper";

import {
  DISMISS_MODAL,
  SET_MODAL_ERROR,
  SET_SPINNER
} from "../actions";
import {
  VIEW_STOCK_REQUEST,
  VIEW_STOCK_SUCCESS,
  VIEW_STOCK_FAILURE,
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
  modal: {
    class: "modal__hide",
    type: "",
    title: "",
    text: ""
  },
  stocks: [],
  currentStock: {
    stockId: "",
    stockCode: "",
    stockData: []
  }
};

function stock(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {

    case VIEW_STOCK_REQUEST:
    case GET_ALL_STOCKS_REQUEST:
    case ADD_STOCK_REQUEST:
    case REMOVE_STOCK_REQUEST:
      return Object.assign({}, state, {
        spinnerClass: "spinner__show",
        modal: {
          class: "modal__hide",
          text: ""
        },
        errorMsg: ""
      });

    /*
    * Toggle spinner class (for social auth done with href
    * rather than API call)
    */
    case SET_SPINNER:
      return Object.assign({}, state, {
        spinnerClass: `spinner__${action.payload}`
      });

    /*
    *  Called From: <App />
    *  Payload: Error Message
    *  Purpose: Hide spinner,
    *  Display error message in modal. Generic, called from various components
    */
    case SET_MODAL_ERROR:
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__show" },
          text: { $set: error },
          title: { $set: action.payload.title },
          type: { $set: "modal__error" },
          buttonText: { $set: action.payload.buttonText },
          action: { $set: action.payload.action },
          modalDanger: { $set: action.payload.modalDanger }
        }
      });

    /*
    *  Called from: <App />
    *  Payload: None
    *  Purpose: update state to dismiss the modal box
    */
    case DISMISS_MODAL:
      return Object.assign({}, state, {
        modal: {
          text: "",
          class: "modal__hide",
          type: "",
          title: ""
        }
      });

    case VIEW_STOCK_SUCCESS:
    case ADD_STOCK_SUCCESS:
    case REMOVE_STOCK_SUCCESS:

      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__hide" }
        }
      });

    /*
    *  Called from: <App />
    *  Payload: array of stock objects
    *  Purpose: Display stocks
    */

    case GET_ALL_STOCKS_SUCCESS:
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__hide"
        },
        stocks: [...action.payload]
      });

    /*
    *  Called from: <App />
    *  Payload: Error message
    *  Purpose: Display error message
    */

    case GET_ALL_STOCKS_FAILURE:
    case VIEW_STOCK_FAILURE:
    case REMOVE_STOCK_FAILURE:
    case ADD_STOCK_FAILURE:
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          type: "modal__error",
          text: error,
          buttonText: "Try again"
        }
      });

    default:
      return state;
  }
}

export default stock;
