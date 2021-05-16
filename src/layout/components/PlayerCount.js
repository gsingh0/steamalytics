import { Component } from 'react';
import '../../styles/PlayerCount.css'
import Card from '@material-ui/core/Card';
import appConfig from '../../config/app-config.json';
import CircularProgress from '@material-ui/core/CircularProgress';
import PlayerCountCell from './PlayerCountCell';

class PlayerCount extends Component {
    constructor() {
        super();
        this.socketUrl = appConfig.endpoints.environment.development.socketUrl;
        this.apiUrl = appConfig.endpoints.environment.development.apiUrl;
        this.socket = null;
        this.state = {
            searchText: "",
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

    handleSearchFilter(text) {
        let filteredSearch = this.state.playerCountData.filter(data => {
            return data.name.toLowerCase().includes(text);
        });
        this.setState({ playerCountData: filteredSearch });
    }

    async componentDidMount() {
        console.log(this.apiUrl + '/player-count');
        try {
            // let response = await fetch(this.apiUrl + '/player-count');
            // response = await response.json();
            // // let newState = await this.constructPlayerCountState(response.data, true);
            // this.setState({ playerCountData: response.data });

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
                <Card className="playerCountCard" variant="outlined">
                    <p>{this.state.errorText}</p>
                </Card>
            )
        }
        if (Object.entries(playerCountData).length !== 0) {
            fields = Object.entries(playerCountData).map((value, index) => {
                if (value[1].name.toLowerCase().includes(this.state.searchText.toLowerCase())) {
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{value[1].name}</td>
                            <td style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="fadeinout-placeholder"></div>
                                <PlayerCountCell state={value[1]}></PlayerCountCell>
                            </td>
                        </tr>
                    )
                }
            })
            return (
                <Card className="playerCountCard" variant="outlined">
                    <div className="inputDiv">
                        <input className="headerInput" placeholder="Search Game..." onChange={(text) => this.setState({ searchText: text.target.value })}></input>
                    </div>
                    <div className="tableDiv">
                        <table>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Game</th>
                                    <th style={{ display: 'flex', alignItems: 'center' }}><div className="fadeinout"></div> Player Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )
        } else {
            return (
                <Card className="playerCountCardLoading" variant="outlined">
                    <CircularProgress className="playerCountLoadingIcon"></CircularProgress>
                </Card>
            )
        }
    }
}

export default PlayerCount;