import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers/reducers';
import { saveState, loadState } from './localStorage';

const store = createStore(
	reducers,
	loadState(),
	composeWithDevTools(applyMiddleware(thunk))
);

store.subscribe(() => {
	saveState(store.getState());
});

export default store;
