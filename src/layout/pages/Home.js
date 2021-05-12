import { Component } from 'react';
import PlayerCount from '../components/PlayerCount';
import Card from '@material-ui/core/Card';
import '../../styles/Home.css';

class Home extends Component {
    render() {
        return (
            <div className="playerCountOuterBody">
                <div className="playerCountInnerBody">
                    <Card className="playerCountCard">
                        <div className="inputDiv">
                            <input className="headerInput" placeholder="Search Game..."></input>
                        </div>
                        <PlayerCount></PlayerCount>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Home;