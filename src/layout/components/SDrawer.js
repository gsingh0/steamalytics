import { Component } from "react";
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import HomeIcon from '@material-ui/icons/Home';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { StylesProvider } from '@material-ui/core/styles';

import '../../styles/SDrawer.css';

class SDrawer extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <StylesProvider injectFirst>
                <Drawer
                    className={this.props.appstyles.drawer}
                    variant="permanent"
                    classes={{
                        paper: this.props.appstyles.drawerPaper
                    }}
                >
                    <Toolbar></Toolbar>
                    <div className={this.props.appstyles.drawerContainer}>
                        <List>
                            <ListItem button key="Home">
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Home"></ListItemText>
                            </ListItem>
                            <ListItem button key="Charts">
                                <ListItemIcon>
                                    <InsertChartIcon />
                                </ListItemIcon>
                                <ListItemText primary="Charts"></ListItemText>
                            </ListItem>
                        </List>
                    </div>
                </Drawer>
            </StylesProvider>
        )
    }
}

export default SDrawer;