import UpStore from "../src";
import counterReducer from "./helpers/counterReducer";
import { increment, unknown } from "./helpers/actions";

describe("store", () => {
  it("exposes public API", () => {
    const store = new UpStore();
    const methods = Object.keys(store);

    expect(methods.length).toBe(10);
    expect(methods).toContain("getState");
    expect(methods).toContain("combineReducers");
    expect(methods).toContain("actions");
    expect(methods).toContain("dispatch");
    expect(methods).toContain("setState");
    expect(methods).toContain("subscribe");
    expect(methods).toContain("unsubscribe");
    expect(methods).toContain("reducer");
    expect(methods).toContain("state");
    expect(methods).toContain("listeners");
  });

  it("passes the initial state", () => {
    const store = new UpStore({ counter: 5 });
    expect(store.getState()).toEqual({ counter: 5 });
  });

  it("applies the reducer to the previous state", async () => {
    const reducers = { counter: counterReducer };
    const store = new UpStore({ counter: 5 }, reducers);

    await store.dispatch(increment);
    await store.dispatch(increment);

    expect(store.getState()).toEqual({ counter: 7 });
  });

  it("subscription sends up to date state changes", async () => {
    const reducers = { counter: counterReducer };
    const store = new UpStore({ counter: 5 }, reducers);
    const listenerA = jest.fn();

    store.subscribe(listenerA);

    await store.dispatch(increment);
    expect(listenerA.mock.calls[0][0]).toEqual({ counter: 6 });
    expect(listenerA.mock.calls.length).toBe(1);
    await store.dispatch(increment);
    expect(listenerA.mock.calls[1][0]).toEqual({ counter: 7 });
    expect(listenerA.mock.calls.length).toBe(2);
  });

  it("does not mutate state when unknown action is called", async () => {
    const reducers = { counter: counterReducer };
    const store = new UpStore({ counter: 5 }, reducers);

    await store.dispatch(unknown);

    expect(store.getState()).toEqual({ counter: 5 });
  });

  it("unsubcribe only removes one listener", async () => {
    const reducers = { counter: counterReducer };
    const store = new UpStore({ counter: 5 }, reducers);
    const listenerA = jest.fn();
    const listenerB = jest.fn();

    store.subscribe(listenerA);
    store.subscribe(listenerB);

    await store.dispatch(increment);
    expect(listenerA.mock.calls.length).toBe(1);
    expect(listenerB.mock.calls.length).toBe(1);

    store.unsubscribe(listenerB);

    await store.dispatch(increment);
    await store.dispatch(increment);

    expect(listenerA.mock.calls.length).toBe(3);
    expect(listenerB.mock.calls.length).toBe(1);
  });

  it("no reducer is provided", async () => {
    const store = new UpStore({ counter: 5 });

    await store.dispatch(increment);
    await store.dispatch(increment);

    expect(store.getState()).toEqual({ counter: 5 });
  });

  it("single reducer is provided", async () => {
    const store = new UpStore({ counter: 5 }, (state, action) => {
      switch (action.type) {
        case "INCREMENT":
          return {
            counter: state.counter + 1
          };
        default:
          return state;
      }
    });

    await store.dispatch(increment);
    await store.dispatch(increment);

    expect(store.getState()).toEqual({ counter: 7 });
  });

  it("create dispatch bound actions", async () => {
    const reducers = { counter: counterReducer };
    const store = new UpStore({ counter: 5 }, reducers);
    const actions = store.actions({ increment });

    await actions.increment();

    expect(store.getState()).toEqual({ counter: 6 });
  });
});
