import { Component } from 'react';
import '../../styles/PlayerCount.css'
import appConfig from '../../config/app-config.json';
import { LoopCircleLoading } from 'react-loadingg';
import PlayerCountCell from './PlayerCountCell';

class PlayerCount extends Component {
    constructor() {
        super();
        this.socketUrl = appConfig.endpoints.environment.development.socketUrl;
        this.apiUrl = appConfig.endpoints.environment.development.apiUrl;
        this.socket = null;
        this.state = {
            playerCountData: {},
            error: false,
            errorText: null
        }
    }

    async constructPlayerCountState(data, init) {
        let formattedPlayerCount = new Intl.NumberFormat('en-US');
        return new Promise((resolve, reject) => {
            let newState = {};
            for (let i = 0; i < data.length; i++) {
                newState[data[i].name] = data[i];
                if (init)
                    newState[data[i].name]["noise"] = 1;
                else
                newState[data[i].name]["noise"] = 0;
            }
            resolve(newState);
        });
    }

    async noiseModel(name, state) {
        if (name === "Dota 2")
            console.log("creating new interval");
        let timeout = setInterval(() => {
            let noise = this.getRandomInteger(-5, 5);
            state.noise = noise;
            state.playerCount = Number(state.playerCount) + noise;
            this.setState(prevState => ({
                playerCountData: {
                    ...prevState.playerCountData,
                    [name]: state,
                }
            }))
        }, this.getRandomInteger(2000, 10000));
        return timeout;
    }

    getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    async componentDidMount() {
        console.log(this.apiUrl + '/player-count');
        try {
            let response = await fetch(this.apiUrl + '/player-count');
            response = await response.json();
            console.log(response);
            // let newState = await this.constructPlayerCountState(response.data, true);
            this.setState({ playerCountData: response.data });

            this.socket = new WebSocket(this.socketUrl);
            this.socket.onopen = () => {
                console.log("socket connection established!");
            }

            this.socket.onmessage = async (res) => {
                // let newState = await this.constructPlayerCountState(JSON.parse(res.data), false);
                this.setState({ playerCountData: JSON.parse(res.data) })
            }

            this.socket.onclose = () => {
                console.log("socket connection closed");
                this.socket.close();
            }

            this.socket.onerror = (error) => {
                this.setState({ error: true, errorText: error }, () => this.socket.close());
            }
        } catch (error) {
            this.setState({ error: true, errorText: error.toString() }, () => this.socket !== null ? this.socket.close() : "");
        }
    }

    componentWillUnmount() {
        if (this.socket !== null) {
            this.socket.close();
        }
    }

    render() {
        let fields;
        let playerCountData = this.state.playerCountData;
        if (this.state.error) {
            return (
                <div className="playerCountOuterBody">
                    <div className="playerCountInnerBody">
                        <p>{this.state.errorText}</p>
                    </div>
                </div>
            )
        }
        if (Object.entries(playerCountData).length !== 0) {
            fields = Object.entries(playerCountData).map((value, index) => {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{value[1].name}</td>
                        <td>
                            <PlayerCountCell state={value[1]}></PlayerCountCell>
                        </td>
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