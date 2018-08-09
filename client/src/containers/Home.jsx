import React from "react";
import Highcharts from 'highcharts/js/highstock';
import {
  HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis, Title,
  Subtitle, Legend, LineSeries, RangeSelector, Tooltip
} from 'react-jsx-highstock';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReduxToastr from 'react-redux-toastr';
import { toastr } from 'react-redux-toastr';
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";

import Spinner from "./Spinner";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

const colors = [ "#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee" ];

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      input: ""
    }
  }

  componentDidMount() {
    this.getAllStocks();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stock.refresh && !this.props.stock.refresh) {
      this.getAllStocks(true);
    }

  }

  handleInput(e) {
    this.setState({
      input: e.target.value
    });
  }

  clearInput() {
    this.setState({
      input: ""
    });
  }

  getAllStocks(refresh) {
    this.props.api.getAllStocks()
      .then((result) => {
        console.log(this.props.stock.stocks);
        if (result.type === "GET_ALL_STOCKS_FAILURE") {
          toastr.error('Failed to fetch stocks', this.props.stock.errorMsg);
        }
        if (refresh) {
          this.props.actions.toggleRefresh();
        }
      });
  }

  addStock() {
    this.props.api.addStock(this.state.input)
    .then((result) => {
      console.log(result);
      if (result.type === "ADD_STOCK_FAILURE") {
        console.log(this.props.stock.errorMsg);
        toastr.error(`Failed to add ${this.state.input.toUpperCase()}, code not found.`);
        this.clearInput();
        } else {
        this.clearInput();
        this.getAllStocks();
      }
    });
  }

  removeStock(stockId) {
    this.props.api.removeStock(stockId)
      .then((result) => {
        this.clearInput();
        if (result.type === "REMOVE_STOCK_FAILURE") {
            toastr.error(`Failed to remove stock`, this.props.stock.errorMsg);
          } else {
            this.getAllStocks();
          }
      })
  }

  getSeries(chartData) {
    return chartData.map((data, i) => {
      if (data) {
        return (
          <LineSeries
            key={i}
            id={i}
            name={data.code}
            step
            compare={data.value}
            color={colors[i]}
            data={data.data.reverse().map(info => {
          return [
            (new Date(info[0])).getTime(),
            info[1]
          ];})}
          />
        )
      } else {
        return "";
      }
    })
  }

  render() {
    return (
      <div className="home">
        <Spinner cssClass={this.props.stock.spinnerClass} />
        <ReduxToastr position='bottom-center' transitionIn='bounceIn' transitionOut='fadeOut'/>
        <h2 className="header"> </h2>
        <div className="chart">
          <HighchartsStockChart
            margin={[120,60,100,60]}
            spacing={[40,0,20,40]}
          >
            <Chart
              zoomType="x"
              margin={[140,60,100,80]}
              spacing={[40,0,20,0]}
              height={500}
              plotOptions={{
                series: {
                  compare: 'value'
                }
              }}
            />

            <Title margin={60} >Collapse</Title>
            <Subtitle>A front-row seat to the collapse of late capitalism. Featuring websockets so you can watch in real time with your friends.</Subtitle>
            <Legend />

            <RangeSelector
              buttonPosition={{ y:-140 }}
              align="center"
            >
              <RangeSelector.Button count={7} type="day">7d</RangeSelector.Button>
              <RangeSelector.Button count={1} type="month">1m</RangeSelector.Button>
              <RangeSelector.Button count={6} type="month">6m</RangeSelector.Button>
              <RangeSelector.Button type="all">All</RangeSelector.Button>
            </RangeSelector>

            <Tooltip
              shared
            />

            <XAxis type='datetime'>
              <XAxis.Title margin={10}>Time</XAxis.Title>
            </XAxis>

            <YAxis
              margin={60}
              labels={{
                x:-10,
                formatter: function() {
                  return `${this.value > 0 ? ' + ' : ''}${this.value}%`
                }
              }}>
              <YAxis.Title margin={0} offset={0} x={-45}>Price</YAxis.Title>
              {this.props.stock.stocks.length ? this.getSeries(this.props.stock.stocks) : null}
            </YAxis>

          </HighchartsStockChart>

        </div>

        {this.props.stock.stocks.length ?
          <div className="row">
            <div className="card">
              <input
                className="add__input"
                type="text"
                placeholder="Stock code"
                value={this.state.input}
                onChange={(e) => this.handleInput(e)}
                />
              <button
                className="add__button"
                type="button"
                onClick={() => this.addStock()}
                >
                Add Stock
              </button>
            </div>
            {this.props.stock.stocks.map((stock, i) => {
              if (stock) {
                return (
                  <div key={i} className="card">
                    <div className="stock stock__code">{stock.code}</div>
                    <div className="stock stock__name">{stock.name}</div>
                    <button
                      className="stock__button"
                      aria-label="remove stock"
                      onClick={ () => this.removeStock(stock._id) }
                    >&times;</button>
                  </div>
                  )
              } else {
                return null;
              }
            })}
          </div> :
          <div className="empty">No stocks! <br /> Enter a code and click "Add Stock" to get started.</div>
        }

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

export default connect(mapStateToProps, mapDispatchToProps)(withHighcharts(Home, Highcharts));
