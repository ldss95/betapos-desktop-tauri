import { SET_SHOP_DATA } from '../actions/shop';

const initialState = { id: null, prefix: null, address: null, name: null };

const shop = (state = initialState, action: any) => {
	switch (action.type) {
		case SET_SHOP_DATA:
			return { ...action.payload };
		default:
			return state;
	}
};

export default shop;
