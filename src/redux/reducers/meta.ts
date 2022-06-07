import { SET_META_DATA } from '../actions/meta';

const initialState = {};

const meta = (state = initialState, action: any) => {
	switch (action.type) {
		case SET_META_DATA:
			return { ...action.payload };
		default:
			return state;
	}
};

export default meta;
