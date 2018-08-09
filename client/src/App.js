import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import PropTypes from "prop-types";

import Home from './containers/Home';

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

  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    return (
      <div className="app">
        <Home />
      </div>
    );
  }
}
const mapStateToProps = state => ({
  stock: state.stock
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
