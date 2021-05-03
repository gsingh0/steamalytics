import { Component } from 'react';
import '../../styles/PlayerCount.css'
import appConfig from '../../config/app-config.json';
import { LoopCircleLoading } from 'react-loadingg';
import PlayerCountCell from './PlayerCountCell';

class PlayerCount extends Component {
    constructor() {
        super();
        this.socketUrl = appConfig.endpoints.environment.development.socketUrl;
        this.socket = null;
        this.state = {
            playerCountData: {}
        }
    }

    async constructPlayerCountState(data) {
        return new Promise((resolve, reject) => {
            let newState = {};
            for (let i = 0; i < data.length; i++) {
                newState[data[i].name] = data[i];
            }
            resolve(newState);
        });
    }

    async noiseModel(name, state) {
        let timeout = setInterval(() => {
            state.playerCount = state.playerCount + this.getRandomInteger(-50, 50);
            this.setState(prevState => ({ 
                playerCountData: {
                    ...prevState.playerCountData,
                    [name]: state 
                } 
            }))
        }, this.getRandomInteger(2000, 10000));
        return timeout;
    }

    getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    componentDidMount() {
        this.socket = new WebSocket(this.socketUrl);
        this.socket.onopen = () => {
            console.log("socket connection established!");
        }

        this.socket.onmessage = async (res) => {
            let newState = await this.constructPlayerCountState(JSON.parse(res.data));
            this.setState({ playerCountData: newState })
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
        if (Object.entries(playerCountData).length !== 0) {
            fields = Object.entries(playerCountData).map((value, index) => {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{value[1].name}</td>
                        <PlayerCountCell state={value[1]} noiseModel={(name, state) => this.noiseModel(name, state)}></PlayerCountCell>
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
                            <LoopCircleLoading style={{}}></LoopCircleLoading>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default PlayerCount;