import { TOGGLE_MENU } from '../actions/navbar';

const initialState = { isVisible: false };

const navbar = (state = initialState, action: any) => {
	switch (action.type) {
		case TOGGLE_MENU:
			return { isVisible: !state.isVisible };
		default:
			return state;
	}
};

export default navbar;
