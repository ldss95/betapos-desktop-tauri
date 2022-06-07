import { combineReducers } from 'redux';

import shop from './shop';
import session from './session';
import navbar from './navbar';
import cart from './cart';
import meta from './meta';

export default combineReducers({
	shop,
	session,
	navbar,
	cart,
	meta
});
