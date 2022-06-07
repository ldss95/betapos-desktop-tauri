const SET_SESSION_DATA = 'SET_SESSION_DATA';
const SET_SHIFT = 'SET_SHIFT';
const LOGOUT = 'LOGOUT';
const VALIDATE_2FA = 'VALIDATE_2FA';

const setSession = (payload: any) => ({
	type: SET_SESSION_DATA,
	payload
});

const setShift = (payload: any) => ({
	type: SET_SHIFT,
	payload
});

const validate2FA = () => ({ type: VALIDATE_2FA })

const logOut = () => ({ type: LOGOUT });

export {
	SET_SESSION_DATA,
	LOGOUT,
	SET_SHIFT,
	VALIDATE_2FA,
	setSession,
	logOut,
	setShift,
	validate2FA
};
