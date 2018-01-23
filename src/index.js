export default class UpStore {
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
  dispatch = async (action, ...args) => {
    const completedAction = await action.apply(null, args);
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

export { Connect } from "./Connect";
