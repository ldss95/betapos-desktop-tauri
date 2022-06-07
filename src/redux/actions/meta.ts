const SET_META_DATA = 'SET_META_DATA';

const setMeta = (payload: any) => ({
	type: SET_META_DATA,
	payload
});

export { SET_META_DATA, setMeta };