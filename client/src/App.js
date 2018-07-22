import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import './App.css';

import Chart from './containers/Chart';
// import Header from "./containers/Header";
// import Home from "./containers/Home";
// import Footer from "./containers/Footer";
// import NotFound from "./containers/NotFound";
// import Spinner from "./containers/Spinner";
// import ModalSm from "./containers/ModalSm";

import * as apiActions from "./store/actions/apiActions";
import * as Actions from "./store/actions";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Collapse</h1>
        </header>
        <p className="App-intro">
          A front-row seat to the collapse of late capitalism. Featuring websockets so you can watch in real time with your friends.
        </p>
        <Chart />
      </div>
    );
  }
}

export default App;
