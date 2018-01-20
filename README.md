# Upstore

providerless state container with React bindings. Includes UMD build

## Install

```shell
npm i -s upstore
```

## Usage

### store.js

```javascript
import UpStore from "upstore";

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
const reducers = {
  counter: counterReducer
};

const store = new UpStore({ counter: 0 }, reducers);

export const actions = store.actions({
  decrement: async () => {
    await fetch("https://www.reddit.com/r/mechanical_gifs.json");
    return {
      type: "DECREMENT"
    };
  },
  increment: () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          type: "INCREMENT"
        });
      }, 250);
    });
  }
});

export default store;
```

### App.js

```javascript
import React from "react";
import Counter from "./components/Counter";

export default () => (
  <div>
    <Counter />
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
        <Fragment>
          {state.counter}
          <button onClick={actions.decrement}>decrement</button>
          <button onClick={actions.increment}>increment</button>
        </Fragment>
      )}
    </Connect>
  </Fragment>
);
```

## API

coming soon...
