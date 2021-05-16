import './App.css';
import AppStyles from './Appstyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './layout/components/Header';
import SDrawer from './layout/components/SDrawer';
import Body from './layout/components/Body';

export default function App() { // needed to make App.js function component in order to use hooks
  const appStyles = AppStyles();
  return (
    <div className="App">
      <Header appstyles={appStyles}></Header>
      <CssBaseline></CssBaseline>
      {/* <SDrawer appstyles={appStyles}></SDrawer> */}
      <Body appstyles={appStyles}></Body>
    </div>
  )
}



// return (
//   <div className="App">
//     <header className="App-header">
//       <img src={logo} className="App-logo" alt="logo" />
//       <p>
//         Edit <code>src/App.js</code> and save to reload.
//       </p>
//       <a
//         className="App-link"
//         href="https://reactjs.org"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         Learn React
//       </a>
//     </header>
//   </div>
// );