import React from "react";
import Highcharts from 'highcharts/js/highstock';
import {
  HighchartsStockChart, Chart, withHighcharts, XAxis, YAxis, Title,
  Subtitle, Legend, LineSeries, RangeSelector, Tooltip
} from 'react-jsx-highstock';

const StockChart = (props) => (
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
        {props.stocks.length ? props.getSeries(props.stocks) : null}
      </YAxis>

    </HighchartsStockChart>

  </div>
  );

export default(StockChart);