//API.AI
var apiai = require('apiai');
var apiai1 = apiai("3b8fd367360b4fa497f6313c199f2418"); //Access token here.

var userUtterance = 'live departures from waverley';

var requestAPIAI = apiai1.textRequest(userUtterance, {
sessionId: '12345'
});

requestAPIAI.on('response', function(response) {
console.log(response);
});

requestAPIAI.on('error', function(error) {
console.log(error);
});

requestAPIAI.end();