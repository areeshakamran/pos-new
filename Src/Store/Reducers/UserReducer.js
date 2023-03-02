import {
    CHANGE_MASTER_LOGIN,
    CHANGE_CASHIERS
} from '../Actions/type'
const initialState = {
    masterLogin: false,
    cashiers: []
}
export default (state = initialState, { type, payload }) => {
    switch (type) {
        case CHANGE_MASTER_LOGIN:
            return {
                ...state,
                masterLogin: payload,
            };
        case CHANGE_CASHIERS:
            return {
                ...state,
                cashiers: payload,
            };
        default:
            return state;
    }
};