import {
    CHANGE_CART,
    CHANGE_COUPON,
    CHANGE_CUSTOMER_PAY,
    CHANGE_TOTAL,
    CHANGE_PAYMENT_TYPE,
    CHANGE_COUPON_TYPE,
    CHANGE_TAX
} from '../Actions/type'

const initialState = {
    cart: [],
    coupons: 0,
    tax:0,
    paymenttype: true,  // true for Cash and false for Credit Card
    customerpay: '',
    total: '',
    coupontype:''
}
export default (state = initialState, { type, payload }) => {
    switch (type) {
        case CHANGE_TAX:
            return {
                ...state,
                tax: payload,
            };
        case CHANGE_COUPON_TYPE:
            return {
                ...state,
                coupontype: payload,
            };
        case CHANGE_PAYMENT_TYPE:
            return {
                ...state,
                paymenttype: payload,
            };
        case CHANGE_TOTAL:
            return {
                ...state,
                total: payload,
            };
        case CHANGE_CUSTOMER_PAY:
            return {
                ...state,
                customerpay: payload,
            };
        case CHANGE_COUPON:
            return {
                ...state,
                coupons: payload,
            };
        case CHANGE_CART:
            return {
                ...state,
                cart: payload,
            };

        default:
            return state;
    }
};