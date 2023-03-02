import {
    CHANGE_CATEGORY,
    CHANGE_PRODUCT,
    CHANGE_PAGENUMBER,
    CHANGE_NEXTPAGE,
    CHANGE_CATEGORYID,
    CHANGE_TEMP_PRODUCT,
    CHANGE_FEATURE_STATUS
} from '../Actions/type'
const initialState = {
    Category: [],
    Product: [],
    pageNumber: 1,
    NextPage: true,
    catid: 'all',
    tempProduct: [],
    featureStatus: true
}
export default (state = initialState, { type, payload }) => {
    switch (type) {
        case CHANGE_FEATURE_STATUS:
            return {
                ...state,
                featureStatus: payload,
            };
        case CHANGE_TEMP_PRODUCT:
            return {
                ...state,
                tempProduct: payload,
            };
        case CHANGE_CATEGORYID:
            return {
                ...state,
                catid: payload,
            };
        case CHANGE_NEXTPAGE:
            return {
                ...state,
                NextPage: payload,
            };
        case CHANGE_PAGENUMBER:
            return {
                ...state,
                pageNumber: payload,
            };
        case CHANGE_PRODUCT:
            return {
                ...state,
                Product: payload,
            };
        case CHANGE_CATEGORY:
            return {
                ...state,
                Category: payload,
            };
        default:
            return state;
    }
};