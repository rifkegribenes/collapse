export const DISMISS_MODAL = "DISMISS_MODAL";
export const SET_MODAL_ERROR = "SET_MODAL_ERROR";
export const SET_SPINNER = "SET_SPINNER";
export const SET_WINDOW_SIZE = "SET_WINDOW_SIZE";
export const CHANGE_STOCK_CLIENT = "CHANGE_STOCK_CLIENT";

export function setSpinner(spinnerClass) {
  return {
    type: SET_SPINNER,
    payload: spinnerClass
  };
}

export function setModalError(msg) {
  return {
    type: SET_MODAL_ERROR,
    payload: msg
  };
}

export function dismissModal() {
  return {
    type: DISMISS_MODAL
  };
}

export function setWindowSize(size) {
  return {
    type: SET_WINDOW_SIZE,
    payload: size
  };
}

export function changeStockClient(type, stock) {
  return {
    type: CHANGE_STOCK_CLIENT,
    payload: { type, stock }
  };
}
