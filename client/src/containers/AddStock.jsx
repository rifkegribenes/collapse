import React from "react";

const AddStock = (props) => (
  <div className="card">
    <input
      className="add__input"
      type="text"
      placeholder="Stock code"
      value={props.input}
      onChange={(e) => props.handleInput(e)}
      />
    <button
      className="add__button"
      type="button"
      onClick={() => props.addStock()}
      >
      Add Stock
    </button>
  </div>
);

export default(AddStock);