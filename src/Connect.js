import { Component } from "react";
import PropTypes from "prop-types";

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
