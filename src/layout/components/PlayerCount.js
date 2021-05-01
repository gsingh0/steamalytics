import { Component } from 'react';
import socketIOClient from 'socket.io-client';
import io from 'socket.io/client-dist/socket.io'
import { GET_PLAYER_COUNT } from '../../enum/steamServicePathsEnum';
import appConfig from '../../config/app-config.json';

class PlayerCount extends Component {
    constructor() {
        super();
        let socketUrl = appConfig.endpoints.environment.development.socketUrl;
        this.socket = new WebSocket(socketUrl);
        this.state = {
            msg: ""
        }
    }

    componentDidMount() {
        this.socket.onopen = () => {
            console.log("socket connection established!");
        }

        this.socket.onmessage = async (res) => {
            this.setState({ msg: res.data })
        }

        this.socket.onclose = () => {
            console.log("socket connection closed")
        }
    }

    render() {
        if (this.state.msg.length != 0) {
            return (
                <p>Welcome {this.state.msg}</p>
            )
        } else {
            return (
                <p>Loading...</p>
            )
        }
    }
}

export default PlayerCount;