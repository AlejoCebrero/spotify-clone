const axios = require('axios');

const searchExternalSongs = async (term) => {
  const response = await axios.get('https://itunes.apple.com/search', {
    params: {
      term,
      media: 'music',
      limit: 10
    }
  });

  const songs = response.data.results.map(item => ({
    title: item.trackName,
    artist: item.artistName,
    album: item.collectionName,
    duration: Math.round(item.trackTimeMillis / 1000),
    genre: item.primaryGenreName
  }));

  return songs;
};

module.exports = searchExternalSongs;