// library dependencies
const express = require('express');

// object dependencies
const config = require('./config/config.json');
const apiPaths = require('./src/serviceEnums');
const serviceDefinitions = require('./src/serviceDefinitions');

// configuration variables
const development = config.development;

// server variables
const app = express();
const PORT = process.env.PORT || development.port;

// api definitions
app.get(apiPaths.GET_PLAYER_COUNT, serviceDefinitions.getPlayerCount);
app.get(apiPaths.GET_ALL_GAMES, serviceDefinitions.getAllGames);

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
})