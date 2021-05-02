import { Component } from 'react';
import '../../styles/Header.css';

class Header extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="headerOuterBar">
                <div className="headerInnerBar">
                    <div className="titleDiv">
                        <p className="titleText">Steamalytics</p>
                    </div>
                    <div className="inputDiv">
                        <input className="headerInput" placeholder="Search Game..."></input>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;