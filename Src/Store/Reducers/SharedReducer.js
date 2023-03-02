import {
    MAIN_LOADER,
    CHANGE_INTERNET_STATUS,
    CHANGE_LOADER
} from '../Actions/type'
const initialState = {
    MainLoader: false,
    Internet:false,
    loader:false
}
export default (state = initialState, { type, payload }) => {
    switch (type) {
        case CHANGE_LOADER:
            return {
                ...state,
                loader: payload,
            };
        case CHANGE_INTERNET_STATUS:
            return {
                ...state,
                Internet: payload,
            };
        case MAIN_LOADER:
            return {
                ...state,
                MainLoader: payload,
            };
        default:
            return state;
    }
};