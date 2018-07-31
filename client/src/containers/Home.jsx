import React from "react";
import Highcharts from 'highcharts/highstock';
import {
  HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis, Title, Legend,
  AreaSplineSeries, Navigator, RangeSelector, Tooltip
} from 'react-jsx-highstock';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

// import SearchBar from "./SearchBar";
// import Parks from "./Parks";

class Home extends React.Component {
  componentDidMount() {
    console.log('cDM');
    this.props.api.getAllStocks()
      // .then((result) => console.log(result));
    // OR
    // load placeholder data
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.stock.stocks.length !== this.props.stock.stocks.length) {
  //     console.log('stocks array changed:');
  //     console.log(`${this.props.stock.stocks.length} => ${nextProps.stock.stocks.length}`);
  //     this.props.api.getAllStocks()
  //       // .then(() => this.forceUpdate());
  //   }
  // }

  render() {
    // let stocklist = "no stocks";
    // if (this.props.stock.stocks.length) {
    //   stocklist = this.props.stock.stocks.map((stock) => {
    //     return (
    //       <div key={stock._id}>
    //         <p>{stock._id}</p>
    //         <p>{stock.name}</p>
    //         <p>{stock.code}</p>
    //         <p>{stock.__v}</p>
    //         <button
    //           onClick={
    //             () => this.props.api.removeStock(stock._id)
    //             .then(() => this.props.api.getAllStocks())
    //           }
    //         >Remove</button>
    //         <hr />
    //       </div>
    //       );
    //   });
    // }
    const data = this.props.stock.stocks;
    return (
      <div className="splash">
        <h2 className="splash__header">
         Here's the chart
        </h2>
        <div className="chart">
          <HighchartsStockChart>
          <Chart zoomType="x" />

          <Title>Highstocks Example</Title>

          <Legend>
            <Legend.Title>Key</Legend.Title>
          </Legend>

          <RangeSelector>
            <RangeSelector.Button count={1} type="day">1d</RangeSelector.Button>
            <RangeSelector.Button count={7} type="day">7d</RangeSelector.Button>
            <RangeSelector.Button count={1} type="month">1m</RangeSelector.Button>
            <RangeSelector.Button type="all">All</RangeSelector.Button>
            <RangeSelector.Input boxBorderColor="#7cb5ec" />
          </RangeSelector>

          <Tooltip />

          <XAxis>
            <XAxis.Title>Time</XAxis.Title>
          </XAxis>

          <YAxis>
            <YAxis.Title>Price</YAxis.Title>
            <AreaSplineSeries id="profit" name="Profit" data={data} />
          </YAxis>

          <Navigator>
            <Navigator.Series seriesId="profit" />
          </Navigator>
        </HighchartsStockChart>

        </div>
        {this.props.stock.stocks.length ?
          this.props.stock.stocks.map((stock) => {
          return (
            <div key={stock._id}>
              <p>{stock._id}</p>
              <p>{stock.name}</p>
              <p>{stock.code}</p>
              <p>{stock.__v}</p>
              <button
                onClick={
                  () => this.props.api.removeStock(stock._id)
                  .then()
                }
              >Remove</button>
              <hr />
            </div>
            )}) : "no stocks"
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(withHighcharts(Home, Highcharts));
