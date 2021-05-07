// library dependencies
const express = require('express');
const cors = require('cors');

// object dependencies
const config = require('./config/config.json');
const apiPaths = require('./src/service/serviceEnums');
const ServiceDefinitions = require('./src/service/serviceDefinitions');
const SocketManager = require('./src/socket/socketManager');

// configuration variables
const development = config.development;

// server variables
const app = express();
const PORT = process.env.PORT || development.port;
var serviceDefinitions = new ServiceDefinitions();
var socketManager = null;

// api middleware
app.use(cors());

// api definitions
app.get(apiPaths.GET_PLAYER_COUNT, serviceDefinitions.getPlayerCount);
app.get(apiPaths.GET_ALL_GAMES, serviceDefinitions.getAllGames);

// api initialization
async function init() {
    const server = app.listen(PORT, () => console.log("Server running on port " + PORT));
    await serviceDefinitions.init();
    socketManager = new SocketManager(server, serviceDefinitions.steamApiInterface);
    await socketManager.init();
}

init();