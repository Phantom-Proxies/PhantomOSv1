const url = require('url');
const myURL = window.location.href;

const parsedURL = url.parse(myURL, true);
const queryParams = parsedURL.query;
console.log(queryParams.request);