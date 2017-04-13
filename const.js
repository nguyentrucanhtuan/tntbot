'use strict';

// Wit.ai parameters
//const WIT_TOKEN = process.env.WIT_TOKEN;
const WIT_TOKEN = "KMY6WYXP3XYHQEUY5VQE2G3EZEU3IAEQ";
if (!WIT_TOKEN) {
  throw new Error('missing WIT_TOKEN');
}

// Messenger API parameters
//const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
const FB_PAGE_TOKEN = "EAAHwsu50wLoBAMay8ny7ZCmN7grBv4SXN2nmWnskKUXCTdcBMXWjnybN7RALineouL4Ui9ZClJGDgUQoprhqXReu9cCUuNyM0v0JuPEZBzyQqcgVrPYOSquJ9ZAs6LtKF5Y9QL27MxoI8BZAGw1B6fZCE11HDiFhK1vL6VIYqHOwZDZD";

//const FB_APP_SECRECT = process.env.FB_APP_SECRECT;

const FB_APP_SECRECT = "5a0c8ecb38855d9aba177211203764db";

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

if (!FB_VERIFY_TOKEN) {
  FB_VERIFY_TOKEN = "tntfbbotauto";
}





module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
  FB_APP_SECRECT: FB_APP_SECRECT,
};
