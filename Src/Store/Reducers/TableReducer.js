import {
    ALL_ONLINE_TABLES,
    ALL_BOOKED_TABLES,
    CURRENT_TABLE_BOOKED
} from '../Actions/type'

const initialState = {
    allTables: [],
    allBookedTables: [],
    currentTable: []
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case ALL_ONLINE_TABLES:
            return {
                ...state,
                allTables: payload,
            }
        case ALL_BOOKED_TABLES:
            return {
                ...state,
                allBookedTables: payload
            }
        case CURRENT_TABLE_BOOKED:
            return {
                ...state,
                currentTable: payload
            }
        default:
            return state;
    }
};