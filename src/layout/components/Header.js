import { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { StylesProvider } from '@material-ui/core/styles';
import '../../styles/Header.css';


class Header extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <StylesProvider injectFirst>
                <AppBar className={this.props.appstyles.appBar}>
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            Steamalytics
                        </Typography>
                    </Toolbar>
                </AppBar>
            </StylesProvider>
        )
    }
}

export default Header;