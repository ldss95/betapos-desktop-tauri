import { combineReducers } from 'redux';

import session from './session';
import navbar from './navbar';
import cart from './cart';
import meta from './meta';
import common from './common'

export default combineReducers({
	session,
	navbar,
	cart,
	meta,
	common
});
