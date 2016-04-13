import _ from 'lodash/fp';

class _Provider {
	init( store, mithril, Component ) {
		this.store = store; 		//eslint-disable-line
		this.mithril = mithril; //eslint-disable-line
		const comp = _.isFunction( Component ) ? new Component() : Component;
		return comp;
	}
}

export const Provider = new _Provider;

function actionMapper( actions, dispatch ) {

	if ( _.isFunction( actions ) ) {
		return actions( dispatch );
	} else if ( _.isObject( actions ) ) {
		return _.flow(
			_.keys,
			_.filter( _.isFunction ),
			_.map( mappedAction => ( ...factoryArgs ) => ( ...args ) => dispatch( mappedAction( ...factoryArgs, ...args ) ) )
		)( actions );
	}
}

export const connect = ( selector, actions ) => ( Component ) => {
	return {
		view( controller, props, children ) {
			const { dispatch, getState } = Provider.store;

			const state = selector( getState() );
			const comp = _.isFunction( Component ) ? new Component() : Component;
			const actionMap = actionMapper( actions, dispatch );
			const origView = comp.view;
			const c = {
				...comp,
				view: ( ctrl, ...args ) => origView( { ...ctrl, ...actionMap }, ...args )
			};
			return Provider.mithril.component( c, { dispatch, ...state, ...actionMap }, children );
		}
	};
};

export const redrawMiddleware = () => ( next ) => ( action ) => {
	next( action );
	if ( action.meta.redraw && Provider.mithril ) {
		Provider.mithril.redraw();
	}
};
