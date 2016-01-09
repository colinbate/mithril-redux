# Mithril Redux

This package provides utilites for working with Redux within a Mithril application. Similar to `react-redux`.

It does not rely on you using the `mjsx` Babel plugin.

## Usage

Install with:

    npm install --save mithril-redux

Unfortunately there isn't a UMD version available at this time.

## API

### `Provider.init(store, mithril, component)`

When you are mounting your app, you should call this function to initialize the link between your store and Mithril.

The parameters are the Redux store, then the mithril (`m`) object, and then an optional mithril component. If the component is a function is it instantiated and returned, otherwise it is returned as-is.

#### Example

```js
import m from 'mithril';
import {Provider} from 'mithril-redux';
import configStore from './store';
import Root from './root';

const store = configStore({name: 'World', age: 30});

m.mount(document.body, Provider.init(store, m, Root));
```

### `connect(selector, actions)(component)`

Used to turn your Mithril components into Redux-aware Mithril components. Works similar to `connect` from `react-redux`.

* `selector` - A function which maps the full state to the parts needed.
* `actions` - An object listing action creators to be injected into the controller. Or, a function which returns the said object map.
* `component` - The Mithril component to connect.

#### Example

```js
import {connect} from 'mithril-redux';
import {incrementAge, decrementAge, resetAge} from './actions';
// ...
export const AgeBox = connect((state) => ({age: state.age}), {
  inc: incrementAge,
  dec: decrementAge,
  reset: resetAge
})(_AgeBox);
```

### `redrawMiddleware`

Adds the ability for actions to specify that they need to cause a redraw. Useful for anything async where Mithril doesn't naturally redraw.

Trigger it by setting the `redraw` property on the action to `true`;

#### Example (Setup)

```js
import { createStore, applyMiddleware } from 'redux';
import { redrawMiddleware } from 'mithril-redux';
import rootReducer from './reducers';

export default function configureStore(initialState) {
  const createModifiedStore = applyMiddleware(
    redrawMiddleware
  )(createStore);
  return createModifiedStore(rootReducer, initialState);
```

See https://github.com/colinbate/mithril-redux-starter for a sample useage.