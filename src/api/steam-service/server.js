// library dependencies
const express = require('express');

// object dependencies
const config = require('./config/config.json');
const apiPaths = require('./src/service/serviceEnums');
const ServiceDefinitions = require('./src/service/serviceDefinitions');

// configuration variables
const development = config.development;

// server variables
const app = express();
const PORT = process.env.PORT || development.port;
const serviceDefinitions = new ServiceDefinitions();

// api definitions
app.get(apiPaths.GET_PLAYER_COUNT, serviceDefinitions.getPlayerCount);
app.get(apiPaths.GET_ALL_GAMES, serviceDefinitions.getAllGames);

app.listen(PORT, async () => {
    try {
        await serviceDefinitions.init();
        console.log("Server running on port " + PORT);
    } catch (error) {
        console.log(error);
        process.exit(0);
    }
})