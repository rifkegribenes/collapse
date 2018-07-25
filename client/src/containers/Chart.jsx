import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

// import SearchBar from "./SearchBar";
// import Parks from "./Parks";

class Chart extends React.Component {
  componentDidMount() {
    this.props.api.getAllStocks()
      // .then((result) => console.log(result));
    // OR
    // load placeholder data
  }

  render() {
    const stocks = this.props.stock.stocks.length ? [ ...this.props.stock.stocks ] : null;
    let stocklist = "no stocks";
    if (stocks) {
      stocklist = stocks.map((stock) => {
        return (
          <div key={stock._id}>
            <p>{stock._id}</p>
            <p>{stock.name}</p>
            <p>{stock.code}</p>
            <p>{stock.__v}</p>
            <button
              onClick={
                () => this.props.api.removeStock(stock._id)
              }
            >Remove</button>
            <hr />
          </div>
          );
      });
    }
    return (
      <div className="splash">
        <h2 className="splash__header">
         Here's the chart
        </h2>
        {stocklist}
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
