/*
    Defines the base API connection URL
    Single source of truth used in multiple API actions.
*/

/* ================================= SETUP ================================= */

const prodUrl = "https://collapse-of-late-capitalism.herokuapp.com"; // NO TRAILING SLASH
const devUrl = "http://localhost:3001"; // server url for local install

/* ================================ EXPORTS ================================ */

// ENVIRONMENT is a global variable defined by weback.config.js
// defaults to DEVELOPMENT

// export const BASE_URL = devUrl;
// export const BASE_URL = prodUrl;
const BASE_URL = (process.env.ENVIRONMENT === 'PRODUCTION' ? prodUrl : devUrl);

export default BASE_URL;
