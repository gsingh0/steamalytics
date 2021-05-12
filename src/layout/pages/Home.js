import { Component } from 'react';
import PlayerCount from '../components/PlayerCount';
import Card from '@material-ui/core/Card';
import '../../styles/Home.css';

class Home extends Component {
    render() {
        return (
            <div className="playerCountOuterBody">
                <div className="playerCountInnerBody">
                    <PlayerCount></PlayerCount>
                </div>
            </div>
        )
    }
}

export default Home;