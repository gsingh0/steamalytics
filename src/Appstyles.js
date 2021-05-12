import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const AppStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
        width: drawerWidth,
        // flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        zIndex: 0
    },
    drawerCounter: {
        overflow: 'auto'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    }
}));

export default AppStyles;
