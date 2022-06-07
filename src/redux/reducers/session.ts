import { LOGOUT, SET_SESSION_DATA, SET_SHIFT, VALIDATE_2FA } from '../actions/session';

const initialState = { isLoggedIn: false };

const session = (state = initialState, action: any) => {
	switch (action.type) {
		case SET_SESSION_DATA:
			return { ...action.payload };
		case LOGOUT:
			return { isLoggedIn: false };
		case SET_SHIFT:
			return { ...state, shift: action.payload };
		case VALIDATE_2FA:
			return { ...state, isLoggedIn: true }
		default:
			return state;
	}
};

export default session;
