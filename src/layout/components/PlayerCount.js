import { Component } from 'react';
import '../../styles/PlayerCount.css'
import appConfig from '../../config/app-config.json';
import { CircleLoading } from 'react-loadingg';

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
            fields = playerCountData.map((value, index) => {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{value.name}</td>
                        <td>{value.playerCount}</td>
                    </tr>
                )
            })
            return (
                <div className="playerCountOuterBody">
                    <div className="playerCountInnerBody">
                        <table>
                            <thead>
                                <tr>
                                    <td>No.</td>
                                    <td>Game</td>
                                    <td>Player Count</td>
                                </tr>
                                {fields}
                            </thead>
                        </table>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="playerCountOuterBody">
                    <div className="playerCountInnerBody">
                        <div className="playerCountLoadingIcon">
                            <CircleLoading style={{}}></CircleLoading>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default PlayerCount;