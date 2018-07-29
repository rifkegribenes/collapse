import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import socketIOClient from "socket.io-client";
// import PropTypes from "prop-types";
import './App.css';

import Chart from './containers/Chart';
import AddStock from './containers/AddStock';
// import Header from "./containers/Header";
// import Home from "./containers/Home";
// import Footer from "./containers/Footer";
// import NotFound from "./containers/NotFound";
// import Spinner from "./containers/Spinner";
// import ModalSm from "./containers/ModalSm";

import * as apiActions from "./store/actions/apiActions";
import * as Actions from "./store/actions";

class App extends Component {

  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:3001"
    };
  }
  componentDidMount() {
    // const { endpoint } = this.state;
    // const socket = socketIOClient(endpoint);
    // socket.on("stocks", data => this.setState({ response: data }));
    // console.log(this.state.response);
  }

  // componentDidMount() {
  //   this.props.api.getAllStocks()
  //     // .then((result) => console.log(result));
  //   // OR
  //   // load placeholder data
  // }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.stock.stocks.length !== this.props.stock.stocks.length) {
    //   this.props.api.getAllStocks()
    // }

      // .then((result) => console.log(result));
    // OR
    // load placeholder data
  }

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
        <AddStock />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  appState: state.appState,
  stock: state.stock
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
