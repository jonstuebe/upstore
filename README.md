# Upstore

providerless state container with React bindings. Includes UMD build

[![version](https://img.shields.io/npm/v/upstore.svg?style=flat-square)](https://www.npmjs.com/package/@jonstuebe/upstore) [![build](https://travis-ci.org/jonstuebe/upstore.svg?branch=master)](https://www.npmjs.com/package/@jonstuebe/upstore)

## Install

### npm

```shell
npm i -s upstore
```

or

### yarn

```shell
yarn add upstore
```

## Usage

[see online at codesandbox](https://codesandbox.io/s/0o0okxlrjp)

### store.js

```javascript
import UpStore from "upstore";
import { get } from "axios";

const counterReducer = (counter, action) => {
  switch (action.type) {
    case "DECREMENT":
      counter--;
      return counter;
    case "INCREMENT":
      counter++;
      return counter;
    default:
      return counter;
  }
};
const fetchDataReducer = (data, action) => {
  switch (action.type) {
    case "FETCH_DATA":
      data = action.data;
  }
  return data;
};
const reducers = {
  counter: counterReducer,
  data: fetchDataReducer
};

const store = new UpStore({ counter: 0 }, reducers);

export const actions = store.actions({
  decrement: async () => {
    return {
      type: "DECREMENT"
    };
  },
  increment: () => {
    return {
      type: "INCREMENT"
    };
  },
  fetchData: async url => {
    const data = await get(url).then(response => response.data);
    return {
      type: "FETCH_DATA",
      data
    };
  }
});

export default store;
```

### App.js

```javascript
import React from "react";
import Counter from "./components/Counter";
import FetchData from "./components/FetchData";

export default () => (
  <div>
    <Counter />
    <FetchData />
  </div>
);
```

### components/Counter.js

```javascript
import React, { Fragment } from "react";

import store, { actions } from "../store";
import { Connect } from "upstore";

export default () => (
  <Fragment>
    <Connect
      store={store}
      filterState={state => {
        return { counter: state.counter };
      }}
    >
      {({ state }) => (
        <div>
          <h2>Counter Example</h2>
          <p>{state.counter}</p>
          <button onClick={actions.decrement}>decrement</button>
          <button onClick={actions.increment}>increment</button>
        </div>
      )}
    </Connect>
  </Fragment>
);
```

### components/FetchData.js

```javascript
import React, { Fragment } from "react";

import store, { actions } from "../store";
import { Connect } from "upstore";

export default () => (
  <Fragment>
    <Connect
      store={store}
      filterState={state => {
        return { data: state.data };
      }}
    >
      {({ state }) => {
        return (
          <div>
            <h2>Async Data Fetch Example</h2>
            <button
              onClick={actions.fetchData.bind(
                null,
                "https://www.reddit.com/r/mechanical_gifs.json"
              )}
            >
              fetch data
            </button>
            <pre>{JSON.stringify(state.data, null, 2)}</pre>
          </div>
        );
      }}
    </Connect>
  </Fragment>
);
```

## API

coming soon...
