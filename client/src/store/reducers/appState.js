import update from "immutability-helper";

import {
  DISMISS_MODAL,
  SET_MODAL_ERROR,
  SET_SPINNER,
  SET_WINDOW_SIZE
} from "../actions";

const INITIAL_STATE = {
  spinnerClass: "spinner__hide",
  modal: {
    class: "modal__hide",
    text: "",
    title: "",
    type: ""
  },
  windowSize: {
    width: window.innerWidth,
    height: window.innerHeight
  }
};

/*
*  This is the appState reducer.  It is meant to hold global settings
*  spinnerClass: string - css class applied while API is loading
*/
function appState(state = INITIAL_STATE, action) {
  let error;
  switch (action.type) {

    /*
    * This action is issued from <App/> component.
    * When the client window is resized, this action will be dispatched.
    * The action payload contains the window width and height
    */
    case SET_WINDOW_SIZE:
      return Object.assign({}, state, { windowSize: action.payload });

    /*
    * Toggle spinner class (for social auth done with href
    * rather than API call)
    */
    case SET_SPINNER:
      return Object.assign({}, state, {
        spinnerClass: `spinner__${action.payload}`
      });

    /*
    *  Called From: <VerifyEmail />
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
          type: { $set: "modal__error" }
        }
      });

    /*
    *  Called from: <VerifyEmail />
    *  Payload: None
    *  Purpose: dismiss modal
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

    default:
      return state;
  }
}

export default appState;
