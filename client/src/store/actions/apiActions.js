import { RSAA } from "redux-api-middleware";
import { BASE_URL } from "./apiConfig.js";

export const VIEW_STOCK_REQUEST = "VIEW_STOCK_REQUEST";
export const VIEW_STOCK_SUCCESS = "VIEW_STOCK_SUCCESS";
export const VIEW_STOCK_FAILURE = "VIEW_STOCK_FAILURE";
export const GET_ALL_STOCKS_REQUEST = "GET_ALL_STOCKS_REQUEST";
export const GET_ALL_STOCKS_SUCCESS = "GET_ALL_STOCKS_SUCCESS";
export const GET_ALL_STOCKS_FAILURE = "GET_ALL_STOCKS_FAILURE";
export const ADD_STOCK_REQUEST = "ADD_STOCK_REQUEST";
export const ADD_STOCK_SUCCESS = "ADD_STOCK_SUCCESS";
export const ADD_STOCK_FAILURE = "ADD_STOCK_FAILURE";
export const REMOVE_STOCK_REQUEST = "REMOVE_STOCK_REQUEST";
export const REMOVE_STOCK_SUCCESS = "REMOVE_STOCK_SUCCESS";
export const REMOVE_STOCK_FAILURE = "REMOVE_STOCK_FAILURE";

/*
* Function: viewStock- get a single stock by code
* @param {string} code
* This action dispatches additional actions as it executes:
*   VIEW_STOCK_REQUEST:
*     Initiates a spinner on the home page.
*   VIEW_STOCK_SUCCESS:
*     If stock successfully retrieved, hides spinner
*   VIEW_STOCK_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function viewStock(code) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/stock/view/${code}`,
      method: "GET",
      types: [
        VIEW_STOCK_REQUEST,
        VIEW_STOCK_SUCCESS,
        {
          type: VIEW_STOCK_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ]
    }
  };
}

/*
* Function: getAllStocks - return all stocks
* This action dispatches additional actions as it executes:
*   GET_ALL_STOCKS_REQUEST:
*     Initiates a spinner on the home page.
*   GET_ALL_STOCKS_SUCCESS:
*     If stocks array successfully retrieved, hides spinner
*   GET_ALL_STOCKS_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function getAllStocks() {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/stock/allstocks`,
      method: "GET",
      types: [
        GET_ALL_STOCKS_REQUEST,
        GET_ALL_STOCKS_SUCCESS,
        {
          type: GET_ALL_STOCKS_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ]
    }
  };
}

/*
* Function: viewStock- get a single stock by code
* @param {string} code
* This action dispatches additional actions as it executes:
*   ADD_STOCK_REQUEST:
*     Initiates a spinner on the home page.
*   ADD_STOCK_SUCCESS:
*     If stock successfully retrieved, hides spinner
*   ADD_STOCK_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function addStock(code) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/stock/add/${code}`,
      method: "PUT",
      types: [
        ADD_STOCK_REQUEST,
        ADD_STOCK_SUCCESS,
        {
          type: ADD_STOCK_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ]
    }
  };
}

/*
* Function: viewStock- get a single stock by code
* @param {string} code
* This action dispatches additional actions as it executes:
*   REMOVE_STOCK_REQUEST:
*     Initiates a spinner on the home page.
*   REMOVE_STOCK_SUCCESS:
*     If stock successfully retrieved, hides spinner
*   REMOVE_STOCK_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function removeStock(code) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/stock/remove/${code}`,
      method: "PUT",
      types: [
        REMOVE_STOCK_REQUEST,
        REMOVE_STOCK_SUCCESS,
        {
          type: REMOVE_STOCK_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ]
    }
  };
}