import React from "react";
import Highcharts from 'highcharts/highstock';
import {
  HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis, Title, Legend,
  LineSeries, Navigator, RangeSelector, Tooltip
} from 'react-jsx-highstock';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

const colors = [
  '#6740b4',
  '#2c98f0',
  '#f05830',
  '#febf2e',
  '#50ad55'
];

class Home extends React.Component {
  componentDidMount() {
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
  //
  getSeries(chartData) {
    console.log(chartData);
    return chartData.map((data, i) => {
      return (
        <LineSeries
          key={i}
          id={i}
          name={data.stockCode}
          step
          color={colors[i]}
          data={data.stockData}
        />
      )
    })
  }

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
    let data = [];
    if (this.props.stock.stocks.length) {
      console.log(this.props.stock.stocks);
      data = this.props.stock.stocks.map((stock) => {
        this.props.api.viewStock(stock.code)
          .then(() => {
            console.log(this.props.stock.currentStock.stockData)
            return this.props.stock.currentStock.stockData;
          });
      });
    }
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
            {data ? this.getSeries(data) : null}
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
