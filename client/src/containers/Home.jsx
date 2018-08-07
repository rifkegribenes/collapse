import React from "react";
import Highcharts from 'highcharts/js/highstock';
import {
  HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis, Title,
  Subtitle, Legend, LineSeries, Navigator, RangeSelector, Tooltip
} from 'react-jsx-highstock';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Spinner from "./Spinner";
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

  constructor(props) {
    super(props);
    this.state = {
      input: ""
    }
  }

  componentDidMount() {
    this.props.api.getAllStocks()
      .then(() => {
        console.log(this.props.stock.stocks);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stock.refresh && !this.props.stock.refresh) {
      this.props.api.getAllStocks()
      .then(() => {
        console.log(this.props.stock.stocks);
        this.props.actions.toggleRefresh();
      });
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

  getSeries(chartData) {
    // console.log(chartData);
    return chartData.map((data, i) => {
      if (data) {
        return (
          <LineSeries
            key={i}
            id={i}
            name={data.code}
            step
            color={colors[i]}
            data={data.data}
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
        <h2 className="header">
        </h2>
        <div className="chart">
          <HighchartsStockChart>
          <Chart
            zoomType="x"
          />

          <Title>Collapse</Title>
          <Subtitle>A front-row seat to the collapse of late capitalism. Featuring websockets so you can watch in real time with your friends.</Subtitle>
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

          <Tooltip shared />

          <XAxis>
            <XAxis.Title>Time</XAxis.Title>
          </XAxis>

          <YAxis>
            <YAxis.Title>Price</YAxis.Title>
            {this.props.stock.stocks.length ? this.getSeries(this.props.stock.stocks) : null}
          </YAxis>

          <Navigator />
{/*            <Navigator.Series seriesId="profit" />
          </Navigator>*/}
        </HighchartsStockChart>

        </div>
        <div className="row">
          {this.props.stock.stocks.length ?
            this.props.stock.stocks.map((stock) => {
              if (stock) {
                return (
                  <div key={stock._id} className="card">
                    <div className="stock stock__code">{stock.code}</div>
                    <div className="stock stock__name">{stock.name}</div>
                    <button
                      className="stock__button"
                      aria-label="remove stock"
                      onClick={
                        () => this.props.api.removeStock(stock._id)
                          .then(() => {
                            this.props.api.getAllStocks()
                            .then(() => {
                              console.log('removed');
                              console.log(this.props.stock.stocks);
                              this.clearInput();
                            })
                          })
                        }
                    >&times;</button>
                  </div>
                  )
              } else {
                return null;
              }
            }) : "no stocks"
          }
        </div>
        <div className="add">
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
            onClick={() => {
              console.log('add');
              this.props.api.addStock(this.state.input)
                .then((result) => {
                  console.log(result);
                  this.props.api.getAllStocks()
                  .then((result) => {
                    console.log('added');
                    console.log(this.props.stock.stocks);
                    this.clearInput();
                  })
                })
              }}
            >
            Add
          </button>
        </div>
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
