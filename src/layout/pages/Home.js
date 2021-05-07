import { Component } from 'react';
import PlayerCount from '../components/PlayerCount';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../../styles/Home.css';

class Home extends Component {
    render() {
        return (
            <div className="homeBackground">
                <Header></Header>
                <PlayerCount></PlayerCount>
                <Footer></Footer>
            </div>
        )
    }
}

export default Home;