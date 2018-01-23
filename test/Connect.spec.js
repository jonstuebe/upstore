import React, { Component } from "react";
import { shallow, mount } from "enzyme";

import UpStore, { Connect } from "../src";
import counterReducer from "./helpers/counterReducer";
import { increment } from "./helpers/actions";

describe("Connect", () => {
  it("basic render and passes initialState", () => {
    const reducers = { counter: counterReducer };
    const store = new UpStore({ counter: 5 }, reducers);
    const actions = store.actions({ increment });

    const wrapper = shallow(
      <Connect
        store={store}
        filterState={state => {
          return { counter: state.counter };
        }}
      >
        {({ state }) => <div>{state.counter}</div>}
      </Connect>
    );
    expect(wrapper.text()).toEqual("5");
  });
  it("basic render and passes initialState with render prop", () => {
    const reducers = { counter: counterReducer };
    const store = new UpStore({ counter: 5 }, reducers);
    const actions = store.actions({ increment });

    const wrapper = shallow(
      <Connect
        store={store}
        filterState={state => {
          return { counter: state.counter };
        }}
        render={({ state }) => <div>{state.counter}</div>}
      />
    );
    expect(wrapper.text()).toEqual("5");
  });
  it("lifecycle methods are called", async () => {
    const reducers = { counter: counterReducer };
    const store = new UpStore({ counter: 5 }, reducers);
    const actions = store.actions({ increment });
    const didMount = jest.fn();
    const willUnmount = jest.fn();

    class Foo extends Component {
      constructor(props) {
        super(props);
        this.componentWillUnmount = willUnmount;
        this.componentDidMount = didMount;
      }
      render() {
        return <div>{this.props.children}</div>;
      }
    }

    const wrapper = mount(
      <Connect
        store={store}
        filterState={state => {
          return { counter: state.counter };
        }}
        render={({ state }) => <Foo>{state.counter}</Foo>}
      />
    );

    expect(willUnmount.mock.calls.length).toBe(0);
    expect(didMount.mock.calls.length).toBe(1);
    wrapper.unmount();
    expect(willUnmount.mock.calls.length).toBe(1);

    wrapper.mount();
    expect(didMount.mock.calls.length).toBe(2);
  });
  it("after action fired counter increments", async () => {
    const reducers = { counter: counterReducer };
    const store = new UpStore({ counter: 5 }, reducers);
    const actions = store.actions({ increment });

    const wrapper = mount(
      <Connect
        store={store}
        filterState={state => {
          return { counter: state.counter };
        }}
        render={({ state }) => <div>{state.counter}</div>}
      />
    );

    expect(wrapper.find("div").text()).toEqual("5");

    await actions.increment();
    wrapper.mount();

    expect(wrapper.find("div").text()).toEqual("6");
  });
});
