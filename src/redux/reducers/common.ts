import {
    SET_CANCEL_TICKET_ID,
    SHOW_CANCEL_TICKET,
    HIDE_CANCEL_TICKET
} from '../actions/common';

interface StateProps {
    cancelTicketId: string | null;
    showCancelTicket: boolean;
}
const initialState: StateProps = {
    cancelTicketId: null,
    showCancelTicket: false
}

const common = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_CANCEL_TICKET_ID:
            return {
                ...state,
                cancelTicketId: action.payload.ticketId
            };
        case SHOW_CANCEL_TICKET:
            return {
                ...state,
                showCancelTicket: true
            };
        case HIDE_CANCEL_TICKET:
            return {
                ...state,
                cancelTicketId: null,
                showCancelTicket: false
            };
        default:
            return state;
    }
}

export default common;
