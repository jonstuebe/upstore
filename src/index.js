import "regenerator-runtime";

import { Component } from "react";
import PropTypes from "prop-types";

export default class Store {
  constructor(initialState = {}, reducer) {
    if (!reducer) {
      this.reducer = (state, action) => {
        return state;
      };
    } else {
      if (typeof reducer === "object") {
        this.reducer = this.combineReducers(reducer);
      } else {
        this.reducer = reducer;
      }
    }
    this.state = initialState;
    this.listeners = [];
    return this;
  }
  getState = () => {
    return this.state;
  };
  combineReducers = reducers => {
    return (state, action) => {
      let newState = Object.assign({}, state);
      for (let reducer in reducers) {
        newState[reducer] = reducers[reducer](newState[reducer], action);
      }
      return newState;
    };
  };
  actions = actions => {
    for (let action in actions) {
      actions[action] = this.dispatch.bind(null, actions[action]);
    }
    return actions;
  };
  dispatch = async action => {
    const completedAction = await action();
    this.setState(this.reducer(this.state, completedAction));
  };
  setState = newState => {
    this.state = newState;
    if (this.listeners.length > 0) {
      this.listeners.forEach(listener => {
        listener(this.state);
      });
    }
    return this.state;
  };
  subscribe = listener => {
    this.listeners.push(listener);
  };
  unsubscribe = callback => {
    this.listeners = this.listeners.filter(listener => {
      if (listener === callback) {
        return false;
      }
      return true;
    });
  };
}

export class Connect extends Component {
  static propTypes = {
    filterState: PropTypes.func.isRequired,
    store: PropTypes.object.isRequired,
    render: PropTypes.func
  };
  constructor(props) {
    super(props);
    const { store, filterState } = props;
    this.state = filterState(store.getState());
  }
  componentDidMount() {
    this.props.store.subscribe(this.updateState);
  }
  componentWillUnmount() {
    this.props.store.unsubscribe(this.updateState);
  }
  updateState = newState => {
    this.setState(this.props.filterState(newState));
  };
  render() {
    const props = { state: this.state };
    if (this.props.render) {
      return this.props.render(props);
    }
    return this.props.children(props);
  }
}
