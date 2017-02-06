'use strict';

// Wit.ai parameters
//const WIT_TOKEN = process.env.WIT_TOKEN;
const WIT_TOKEN = "KMY6WYXP3XYHQEUY5VQE2G3EZEU3IAEQ";
if (!WIT_TOKEN) {
  throw new Error('missing WIT_TOKEN');
}

// Messenger API parameters
//const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN;
const FB_PAGE_TOKEN = "EAAEAk3NaaAYBAFlKf7Dd2ehaZAoo3bnuYLfkKzZAAEqZBGwgYpAfSwiL7SESYuxfb1cZBIYyZCuLJmLIrwt3YdbU3OXQyC7ZCSKpZCdreqEsHd3zesdCstdnKfh5PKSTZBf3RgUCKlf0Pxl8z59Lhdyc3am0iRtLmPuDv7VSSZBuMrQZDZD";

//const FB_APP_SECRECT = process.env.FB_APP_SECRECT;

const FB_APP_SECRECT = "7091c96672b5baee5a13991ef64f8976";

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

if (!FB_VERIFY_TOKEN) {
  FB_VERIFY_TOKEN = "tlamhuynhsmartbot";
}





module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
  FB_APP_SECRECT: FB_APP_SECRECT,
};
