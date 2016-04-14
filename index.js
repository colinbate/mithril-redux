class _Provider {
  init (store, mithril, Component) {
    this.store = store;
    this.mithril = mithril;
    const comp = typeof Component === 'function' ? new Component() : Component;
    return comp;
  }
}

export const Provider = new _Provider();


function wrapView (comp, actionMap) {
  const origView = comp.view;
  comp.view = (ctrl, ...args) => {
    const nc = {...ctrl, ...actionMap};
    return origView(nc, ...args);
  };
}

const dispatchFactory = (creator, dispatch) => (...factoryArgs) => (...args) => dispatch(creator(...factoryArgs, ...args));

export const connect = (selector, actions) => (Component) => ({
  view (controller, props, children) {
    const {dispatch, getState} = Provider.store;
    let actionMap = {};
    if (typeof actions === 'function') {
      actionMap = actions(dispatch);
    } else if (typeof actions === 'object') {
      const actionKeys = Object.keys(actions);
      let k;
      for (k of actionKeys) {
        if (typeof actions[k] === 'function') {
          actionMap[k] = dispatchFactory(actions[k], dispatch);
        }
      }
    }
    const state = selector(getState());
    const comp = typeof Component === 'function' ? new Component() : Component;
    wrapView(comp, actionMap);
    return Provider.mithril.component(comp, {dispatch, ...state, ...actionMap}, children);
  }
});

export const redrawMiddleware = () => (next) => (action) => {
  next(action);
  if ((action.redraw || (action.meta && action.meta.redraw)) && Provider.mithril) {
    Provider.mithril.redraw();
  }
};
