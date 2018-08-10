import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Home from './containers/Home';
import github from "./img/github-white.svg";

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
        <div className="footer">
          <div className="footer__wrap">
            <a
              href="https://github.com/rifkegribenes/collapse"
              rel="noopener noreferrer"
              target="_blank"
              className="footer__link"
            >
              <img src={github} className="footer__icon" alt="github" />
            </a>
          </div>
        </div>
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
