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

    async constructPlayerCountState(data) {
        let formattedPlayerCount = new Intl.NumberFormat('en-US');
        return new Promise((resolve) => {
            let newState = {};
            for (let i = 0; i < data.length; i++) {
                newState[data[i].name] = data[i];
                newState[data[i].name]["noise"] = 0;
                // newState[data[i].name].playerCount = formattedPlayerCount.format(newState[data[i].name].playerCount);
            }
            resolve(newState);
        });
    }

    async noiseModel(name, state) {
        let timeout = setInterval(() => {
            // let formattedPlayerCount = new Intl.NumberFormat('en-US');
            // console.log(formattedPlayerCount.format(Number(state.playerCount) + this.getRandomInteger(-25, 25)));
            let noise = this.getRandomInteger(-5, 5);
            state.noise = noise;
            state.playerCount = Number(state.playerCount) + noise;
            // console.log(state.playerCount);
            this.setState(prevState => ({
                playerCountData: {
                    ...prevState.playerCountData,
                    [name]: state,
                }
            }))
        }, this.getRandomInteger(10000, 15000));
        return timeout;
    }

    getRandomInteger(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    componentDidMount() {
        console.log(this.apiUrl + '/player-count');
        fetch(this.apiUrl + '/player-count')
            .then(async (response) => {
                console.log(response); // error rendering 
                let newState = await this.constructPlayerCountState(JSON.parse(response.data));
                this.setState({ playerCountData: newState }) 
            })
            .then(() => {
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

                this.socket.onerror = (error) => {
                    this.setState({ error: true, errorText: error }, () => this.socket.close());
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({ error: true, errorText: error }, () => this.socket!== null? this.socket.close() : "");
            })
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
            <div className="playerCountOuterBody">
                <div className="playerCountInnerBody">
                    <p>{this.errorText}</p>
                </div>
            </div>
        }
        if (Object.entries(playerCountData).length !== 0) {
            fields = Object.entries(playerCountData).map((value, index) => {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{value[1].name}</td>
                        <td>
                            <PlayerCountCell state={value[1]} noiseModel={(name, state) => this.noiseModel(name, state)}></PlayerCountCell>
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