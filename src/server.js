const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const mediaHandler = require('./mediaResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  console.log(request.url);

  switch (request.url) {
    case '/': // base, go to index
      htmlHandler.getIndex(request, response);
      break;
    case '/page2': // got to page 2 with bling
      htmlHandler.getPage2(request, response);
      break;
    case '/page3': // go to page 3 with bird
      htmlHandler.getPage3(request, response);
      break;
    case '/party.mp4': // load party.mp4
      mediaHandler.getParty(request, response);
      break;
    case '/bling.mp3': // load bling.mp3
      mediaHandler.getBling(request, response);
      break;
    case '/bird.mp4': // load bird.mp4
      mediaHandler.getBird(request, response);
      break;
    default: // default, go to index with party
      htmlHandler.getIndex(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
