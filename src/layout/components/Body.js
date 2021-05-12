import { Toolbar } from "@material-ui/core";
import { Component } from "react";
import Home from '../pages/Home';

class Body extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <main className={this.props.appstyles.content}>
                <Toolbar></Toolbar>
                <Home></Home>
            </main>
        )
    }
}

export default Body;