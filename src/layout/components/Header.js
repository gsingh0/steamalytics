import { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { StylesProvider } from '@material-ui/core/styles';
import '../../styles/Header.css';
import { Button, ButtonGroup, Divider } from '@material-ui/core';

class Header extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <StylesProvider injectFirst>
                <AppBar className={this.props.appstyles.appBar}>
                    <div className="outerToolBar">
                        <Toolbar>
                            <Typography variant="h6" noWrap>
                                Steamalytics
                        </Typography>
                            <Divider></Divider>
                            <ButtonGroup variant="text" color="inherit" aria-label="text primary button group" className="headerButtonGroup">
                                <Button>Home</Button>
                                <Button>Charts</Button>
                                <Button>About</Button>
                            </ButtonGroup>
                        </Toolbar>
                    </div>
                </AppBar>
            </StylesProvider>
        )
    }
}

export default Header;