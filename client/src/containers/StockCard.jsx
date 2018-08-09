import React from "react";

const StockCard = (props) => (
  <div key={props.stock._id} className="card">
    <div className="stock stock__code">{props.stock.code}</div>
    <div className="stock stock__name">{props.stock.name}</div>
    <button
      className="stock__button"
      aria-label="remove stock"
      onClick={ () => props.removeStock(props.stock._id) }
    >&times;</button>
  </div>
  );

export default StockCard;