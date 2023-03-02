const initialState = {
    PrimaryColor: "#00598E",
    secondayColor: "#9A999A",
    lightSecondayColor: "#CAD2D8",
    textPrimaryColor: "#343A40",
    textSecondayColor: "#637381",
    light: '#fff',
    grayDarkColor: '#707070',
    grayLightColor: '#F6F6F6',
    deleteColor: '#FE5F5F',
    CouponColor: '#4DC2F1',
    DiscountColor: '#FF70A6',
    TaxColor: '#FF9770',
    SuccessColor: '#4EB86E',
    DraftColor: '#F79706'
}
export default (state = initialState, { type, payload }) => {
    switch (type) {
        default:
            return state;
    }
};