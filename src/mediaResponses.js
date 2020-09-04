const fs = require('fs'); // pull in the filesystem module
const path = require('path');

//Set up stream variable
const setUpStream = (file, start, end, response) => {
  const stream = fs.createReadStream(file, { start, end });

  stream.on('open', () => {
    stream.pipe(response);
  });

  stream.on('error', (streamErr) => {
    response.end(streamErr);
  });

  return stream;
};

//set up chunk of video to load and send
const setUpBytes = (request, stats) => {
  let { range } = request.headers;

  if (!range) {
    range = 'bytes=0-';
  }

  const positions = range.replace(/bytes=/, '').split('-');

  let start = parseInt(positions[0], 10);

  const total = stats.size;
  const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

  if (start > end) {
    start = end - 1;
  }

  const chunkSize = (end - start) + 1;

  const values = {
    positions,
    start,
    total,
    end,
    chunkSize,
  };

  return values;
};

//write to response head
const writeToHead = (response, values, contentType) => {
  response.writeHead(206, {
    'Content-Range': `bytes ${values.start} - ${values.end}/${values.total}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': values.chunkSize,
    'Content-Type': contentType,
  });
};

//load the file
const loadFile = (request, response, pathName, contentType) => {
  const file = path.resolve(__dirname, pathName);

  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }

    const values = setUpBytes(request, stats);

    writeToHead(response, values, contentType);

    const stream = setUpStream(file, values.start, values.end, response);

    return stream;
  });
};

//different functions to load the different media.
const getParty = (request, response) => {
  loadFile(request, response, '../client/party.mp4', 'video/mp4');
};

const getBling = (request, response) => {
  loadFile(request, response, '../client/bling.mp3', 'audio/mpeg');
};

const getBird = (request, response) => {
  loadFile(request, response, '../client/bird.mp4', 'video/mp4');
};

module.exports.getParty = getParty;
module.exports.getBling = getBling;
module.exports.getBird = getBird;
