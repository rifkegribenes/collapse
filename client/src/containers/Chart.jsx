import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

// import SearchBar from "./SearchBar";
// import Parks from "./Parks";

class Chart extends React.Component {
  componentDidMount() {
    // load data OR
    // load placeholder data
  }

  render() {
    return (
      <div className="splash">
        <h2 className="splash__header">
         Here's the chart
        </h2>
        {this.props.stock.stocks.length ? this.props.stock.stocks : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
