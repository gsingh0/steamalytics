import { Component } from 'react';
import PlayerCount from '../components/PlayerCount';
import Header from '../components/Header';

class Home extends Component {
    render() {
        return (
            <div>
                <Header></Header>
                <PlayerCount></PlayerCount>
            </div>
        )
    }
}

export default Home;