import { Component } from "react";

class PlayerCountCell extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.timeout = this.props.noiseModel(this.props.state.name, this.props.state);
    }

    componentWillUnmount() {
        clearInterval(this.timeout);
        console.log("timeout for " + this.props.state.name + " cleared!");
    }
    
    render() {
        return (<td>{this.props.state.playerCount}</td>)
    }
}

export default PlayerCountCell;