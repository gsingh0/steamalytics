import { Component } from 'react';
import socketIOClient from 'socket.io-client';
import io from 'socket.io/client-dist/socket.io'
import { GET_PLAYER_COUNT } from '../../enum/steamServicePathsEnum';
import appConfig from '../../config/app-config.json';

class PlayerCount extends Component {
    constructor() {
        super();
        this.socketUrl = appConfig.endpoints.environment.development.socketUrl;
        this.socket = null;
        this.state = {
            playerCountData: []
        }
    }

    componentDidMount() {
        this.socket = new WebSocket(this.socketUrl);
        this.socket.onopen = () => {
            console.log("socket connection established!");
        }

        this.socket.onmessage = (res) => {
            this.setState({ playerCountData: JSON.parse(res.data) })
        }

        this.socket.onclose = () => {
            console.log("socket connection closed")
        }
    }

    componentWillUnmount() {
        this.socket.close();
    }

    render() {
        let fields;
        let playerCountData = this.state.playerCountData;
        if (playerCountData.length !== 0) {
            fields = playerCountData.map((value) => {
                return <p>Game: {value.name} ; Player Count: {value.playerCount}</p> 
            })
            return (
                fields
            )
        } else {
            return (
                <p>Loading...</p>
            )
        }
    }
}

export default PlayerCount;