import {
    ALL_SALES,
    RETURN_SALES,
    SALES_DATE,
    SALES_ITEMS,
    DELETED_SALE_ITEMS
} from '../Actions/type'

const initialState = {
    sales: [],
    saleItems: [],
    saleDate: [],
    ReturnSale: [],
    DeleteSale: []
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case ALL_SALES:
            return {
                ...state,
                sales: payload,
            };
        case SALES_ITEMS:
            return {
                ...state,
                saleItems: payload,
            };
        case SALES_DATE:
            return {
                ...state,
                saleDate: payload,
            };
        case RETURN_SALES:
            return {
                ...state,
                ReturnSale: payload,
            }
        case DELETED_SALE_ITEMS:
            return {
                ...state,
                DeleteSale: payload,
            }
        default:
            return state;
    }
};