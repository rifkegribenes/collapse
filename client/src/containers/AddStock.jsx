import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";

// import SearchBar from "./SearchBar";
// import Parks from "./Parks";

class AddStock extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      input: ""
    }
  }

  componentDidMount() {

  }

  addStock(stock) {
    this.props.api.addStock(stock)
    .then(() => this.props.api.getAllStocks());
  }

  handleInput(e) {
    this.setState({
      input: e.target.value
    });
  }

  render() {
    return (
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
          onClick={() => this.addStock(this.state.input)}
          >
          Add
        </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddStock);
