import { useTheme } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import {
    heightPercentageToDP,
    widthPercentageToDP
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { connect } from 'react-redux';
import Delete from '../../Assets/Images/delete.svg';
import Loader from '../../Assets/Images/loader.svg';
import CustomHeader from '../../Component/CustomeHeader';
import { NumberFormat } from '../../Confiq/Helper';
import { deleteSale, MinusQuantity, ReturnSale } from '../../Store/Actions/SaleAction';
import HomeCustomeButton from '../Home/Components/HomeCustomeButton';

function ReturnOrders(props) {
    const { colors } = useTheme();
    const [returnField, setReturnField] = React.useState(true)
    const [subTotal, setSubTotal] = React.useState(true)
    const [returnAmount, setReturnAMount] = useState(0)
    const [DeletedItem, setDeleteditem] = useState([])
    const [returndiscount, setreturndiscount] = useState(0)
    const [totalqunatity, settotalquantity] = useState(0)
    const [returncoupon, setreturncoupon] = useState(0)
    const [orginaltotalAMount, setorginaltotalAMount] = useState(0)
    const [returnCouponDiscont, setreturnCouponDiscont] = useState(0)

    const [loader, setloader] = useState(false)

    const [returnProductshow, setreturnProductshow] = useState([])

    useEffect(() => {
        findavailableReturn()

    }, [])
    console.log("ddddddddddddddddddddd", returnAmount, typeof returnCouponDiscont)
    console.log(props?.route?.params?.coupon, typeof props?.route?.params?.coupon)
    console.log(props?.route?.params?.discount, typeof props?.route?.params?.discount)

    useEffect(() => {
        let total = 0
        for (let i = 0; i < returnProductshow.length; i++) {
            total = total + (parseFloat(returnProductshow[i].quantity) * parseFloat(returnProductshow[i].price_euro))

        }
        var deletedtotal = 0
        let deletedQuantity = 0
        for (let j = 0; j < DeletedItem.length; j++) {
            deletedtotal = deletedtotal + (parseFloat(DeletedItem[j].quantity) * parseFloat(DeletedItem[j].price_euro))
            deletedQuantity = deletedQuantity + DeletedItem[j].quantity

        }
        if (deletedQuantity != 0) {
            let dis = parseFloat(props?.route?.params?.discount)
            let conp = parseFloat(props?.route?.params?.coupon)
            console.log(orginaltotalAMount)
            let totalpercentageDiscontReturn = ((props?.route?.params?.DiscontandCoupon) / parseFloat(orginaltotalAMount)) * 100
            var returnDiscontCoupon = (totalpercentageDiscontReturn / 100) * deletedtotal
            setreturnCouponDiscont(returnDiscontCoupon)

            console.log("WW", totalpercentageDiscontReturn, returnDiscontCoupon)

            let peritemdiscount = props?.route?.params?.discount / totalqunatity
            let peritemcoupon = props?.route?.params?.coupon / totalqunatity
            var returndiscount = NumberFormat(deletedQuantity * peritemdiscount)
            var retuncouponamount = NumberFormat(deletedQuantity * peritemcoupon)
        }


        else {
            var returndiscount = 0
            var retuncouponamount = 0
            var returnDiscontCoupon = 0
            setreturnCouponDiscont(0)
        }
        setReturnAMount(NumberFormat(parseFloat(deletedtotal) - returnDiscontCoupon))
        setreturndiscount(returndiscount)
        setreturncoupon(retuncouponamount)
        setSubTotal(NumberFormat(total))

    }, [returnProductshow])

    const deleteSale = (item) => {
        let deleted = [...DeletedItem]
        var newArray = returnProductshow.filter(obj => obj.id != item.id)
        var newDeletedArray = returnProductshow.filter(obj => obj.id == item.id)
        deleted.push(newDeletedArray[0])
        setDeleteditem(deleted)
        setreturnProductshow(newArray)
    }

    const minusQuantity = (id, quantity) => {
        let available = [...returnProductshow]
        const findIndex = returnProductshow.findIndex(obj => obj.id == id)
        if (findIndex != -1) {
            let data = [...returnProductshow]
            if (quantity > 1) {
                var deletedItems = [...DeletedItem]
                let finddelete = DeletedItem.findIndex(obj => obj.id == id)
                if (finddelete != -1) {
                    deletedItems[finddelete].quantity = deletedItems[finddelete].quantity + 1
                } else {
                    let firsttimeMinus = { ...returnProductshow[findIndex] }
                    firsttimeMinus.quantity = 1
                    deletedItems.push(firsttimeMinus)
                }

                available[findIndex].quantity = quantity - 1
                setDeleteditem(deletedItems)
                setreturnProductshow(data)
            }
        }

    }

    const returnSale = () => {
        if (DeletedItem.length > 0) {
            setloader(true)
            props?.ReturnSale(DeletedItem, props?.navigation, returnAmount, () => setloader(false))
        } else {
            ToastAndroid.showWithGravityAndOffset(
                "Decrease or delete the return item",
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50
            )
        }
    }

    const findavailableReturn = () => {
        if (props.Sale.saleItems[0].return_sale_items.length > 0) {
            let remainingProduct = []
            for (let i = 0; i < props.Sale.saleItems[0].sale_items.length; i++) {
                let findProductInreturn = props.Sale.saleItems[0].return_sale_items.findIndex(obj => obj.server_productid == props.Sale.saleItems[0].sale_items[i].server_productid)
                if (findProductInreturn == -1) {
                    remainingProduct.push(props.Sale.saleItems[0].sale_items[i])
                } else {
                    let returnitem = { ...props.Sale.saleItems[0].return_sale_items[findProductInreturn] }
                    let ProductDetail = { ...props.Sale.saleItems[0].sale_items[i] }
                    if (ProductDetail.quantity > returnitem.quantity) {
                        ProductDetail['quantity'] = ProductDetail.quantity - returnitem.quantity
                        remainingProduct.push(ProductDetail)
                    } else {
                    }

                }
            }
            let totalqunatity = 0
            let orginaltotal = 0
            for (let i = 0; i < remainingProduct.length; i++) {
                console.log("FFFFFFFFFFFFFffffffffffffffffffffffffffff", remainingProduct[i].quantity, remainingProduct[i].price_euro)
                totalqunatity = totalqunatity + remainingProduct[i].quantity
                orginaltotal = orginaltotal + (remainingProduct[i].quantity * remainingProduct[i].price_euro)
            }
            settotalquantity(totalqunatity)
            setreturnProductshow(remainingProduct)
            setorginaltotalAMount(orginaltotal)
        } else {
            let totalqunatity = 0
            let orginaltotal = 0

            for (let i = 0; i < props.Sale.saleItems[0].sale_items.length; i++) {
                totalqunatity = totalqunatity + props.Sale.saleItems[0].sale_items[i].quantity
                orginaltotal = orginaltotal + (props.Sale.saleItems[0].sale_items[i].quantity * props.Sale.saleItems[0].sale_items[i].price_euro)
            }
            settotalquantity(totalqunatity)
            setreturnProductshow(props.Sale.saleItems[0].sale_items)
            setorginaltotalAMount(orginaltotal)

        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.grayLightColor }}>
            <CustomHeader title="Return Details" navigation={props.navigation} />
            {/* <ScrollView horizontal={false}> */}
                <ScrollView horizontal={true} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ flex: 1 }}>
                        <View
                            style={{
                                backgroundColor: 'white',
                                elevation: 5,
                                borderRadius: 2,
                                padding: widthPercentageToDP('1%'),
                                margin: heightPercentageToDP('5%'),
                            }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    padding: widthPercentageToDP('1%'),
                                    paddingHorizontal: widthPercentageToDP('5%'),
                                }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text
                                        style={{
                                            fontFamily: 'Poppins-SemiBold',
                                            color: colors.PrimaryColor,
                                            fontSize: heightPercentageToDP('2.2%'),
                                            width: widthPercentageToDP('8%'),
                                        }}>
                                        Order No.
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: 'Poppins-SemiBold',
                                            color: colors.PrimaryColor,
                                            fontSize: heightPercentageToDP('2.2%'),
                                        }}>
                                        #{props.Sale.saleItems[0].sale?.order_no ? props.Sale.saleItems[0].sale?.order_no : `${props.Sale.saleItems[0].sale?.id} Offline`}
                                    </Text>
                                </View>
                                <View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text
                                            style={{
                                                fontFamily: 'Poppins-SemiBold',
                                                color: colors.PrimaryColor,
                                                fontSize: heightPercentageToDP('2.2%'),
                                                width: widthPercentageToDP('8%'),
                                            }}>
                                            Date
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: 'Poppins-Regular',
                                                color: colors.PrimaryColor,
                                                fontSize: heightPercentageToDP('2.2%'),
                                            }}>
                                            {moment(props.Sale.saleItems[0].sale?.Created_At).format("MMM Do YY")}
                                        </Text>
                                    </View>


                                </View>
                            </View>

                            <View style={{ marginHorizontal: widthPercentageToDP('2%'), maxHeight: heightPercentageToDP('40%') }}>
                                <FlatList
                                    data={returnProductshow}
                                    keyExtractor={(item, index) => index}
                                    ListHeaderComponent={
                                        <DataTable>
                                            <DataTable.Header
                                                style={{
                                                    backgroundColor: colors.PrimaryColor,
                                                    borderRadius: 2,
                                                }}>
                                                <DataTable.Title
                                                    textStyle={[
                                                        styles.DataTableHeaderTextView,
                                                        {
                                                            color: colors.light,
                                                        },
                                                    ]}>
                                                    Item Description
                                                </DataTable.Title>
                                                <DataTable.Title
                                                    textStyle={[
                                                        styles.DataTableHeaderTextView,
                                                        {
                                                            color: colors.light,
                                                        },
                                                    ]}>
                                                    Price
                                                </DataTable.Title>
                                                <DataTable.Title
                                                    textStyle={[
                                                        styles.DataTableHeaderTextView,
                                                        {
                                                            color: colors.light,
                                                        },
                                                    ]}>
                                                    Quantity
                                                </DataTable.Title>
                                                <DataTable.Title
                                                    textStyle={[
                                                        styles.DataTableHeaderTextView,
                                                        {
                                                            color: colors.light,
                                                        },
                                                    ]}>
                                                    Total
                                                </DataTable.Title>

                                                {returnField ?
                                                    <DataTable.Title
                                                        textStyle={[
                                                            styles.DataTableHeaderTextView,
                                                            {
                                                                color: colors.light,
                                                            },
                                                        ]}>
                                                        Action
                                                    </DataTable.Title>
                                                    : null}

                                            </DataTable.Header>
                                        </DataTable>
                                    }
                                    renderItem={({ item, index }) => {
                                        return (
                                            <DataTable key={index}>
                                                <DataTable.Row
                                                    style={{
                                                        backgroundColor: 'rgba(128,173,199,0.2)',
                                                        marginTop: heightPercentageToDP('1%'),
                                                        borderRadius: 2,
                                                    }}>
                                                    <DataTable.Cell
                                                        textStyle={[
                                                            styles.DateCellTextView,
                                                            {
                                                                color: colors.PrimaryColor,
                                                                flex: 1,
                                                                width: widthPercentageToDP('8%')
                                                            },
                                                        ]}>
                                                        {item.name_fr}
                                                    </DataTable.Cell>
                                                    <DataTable.Cell
                                                        textStyle={[
                                                            styles.DateCellTextView,
                                                            {
                                                                color: colors.PrimaryColor,
                                                            },
                                                        ]}>
                                                        {item.price_euro.toFixed(2).toString().replace(/\./g, ',')}
                                                    </DataTable.Cell>
                                                    <DataTable.Cell
                                                        textStyle={[
                                                            styles.DateCellTextView,
                                                            {
                                                                color: colors.PrimaryColor,
                                                            },
                                                        ]}>
                                                        {item.quantity}
                                                    </DataTable.Cell>
                                                    <DataTable.Cell
                                                        textStyle={[
                                                            styles.DateCellTextView,
                                                            {
                                                                color: colors.PrimaryColor,
                                                            },
                                                        ]}>
                                                        {NumberFormat(item.price_euro * item.quantity).replace(/\./g, ',')}
                                                    </DataTable.Cell>

                                                    {returnField
                                                        ? <DataTable.Cell
                                                            textStyle={[
                                                                styles.DateCellTextView,
                                                                {
                                                                    color: colors.PrimaryColor,
                                                                    flexDirection: 'row',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                },
                                                            ]}>
                                                            <AntDesign
                                                                onPress={() => minusQuantity(item.id, item.quantity)}
                                                                name="minus"
                                                                color={colors.light}
                                                                size={heightPercentageToDP('3%')}
                                                                style={{
                                                                    backgroundColor: colors.PrimaryColor,
                                                                }}
                                                            />
                                                            <HomeCustomeButton
                                                                onpress={() => deleteSale(item)}
                                                                Icon={Delete}
                                                                IconWidth={widthPercentageToDP('3%')}
                                                                IconHeight={heightPercentageToDP('3%')}
                                                                style={{
                                                                    borderRadius: 2,
                                                                    marginLeft: widthPercentageToDP('0.5%'),
                                                                }}
                                                            />
                                                        </DataTable.Cell>
                                                        : null}
                                                </DataTable.Row>
                                            </DataTable>
                                        );
                                    }}
                                />
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    justifyContent: 'space-between',
                                    marginHorizontal: widthPercentageToDP('5%'),
                                    marginTop: heightPercentageToDP('1%'),
                                }}>
                                <HomeCustomeButton
                                    onpress={() => returnSale()
                                        // returnField
                                        //     ? () => { props?.ReturnSale() }
                                        //     : () => setReturnField(true)
                                    }
                                    title={returnField ? 'Place Return' : 'Return Items'}
                                    Icon={Loader}
                                    LoaderValue={loader}
                                    IconWidth={widthPercentageToDP('3%')}
                                    IconHeight={heightPercentageToDP('3%')}
                                    style={[
                                        styles.ViewStyle,
                                        {
                                            backgroundColor: colors.deleteColor,
                                        },
                                    ]}
                                    txtStyle={[
                                        styles.textStyle,
                                        {
                                            color: colors.light,
                                        },
                                    ]}
                                />

                                <View style={{ marginTop: heightPercentageToDP('2%') }}>
                                    <View
                                        style={[styles.MainRow, { marginTop: heightPercentageToDP('3%') }]}>
                                        <Text
                                            style={{
                                                fontFamily: 'Poppins-SemiBold',
                                                color: colors.PrimaryColor,
                                                fontSize: heightPercentageToDP('2.3%'),
                                                width: widthPercentageToDP('20%'),
                                            }}>
                                            {'SubTotal'}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: 'Poppins-SemiBold',
                                                color: colors.PrimaryColor,
                                                fontSize: heightPercentageToDP('2.3%'),
                                            }}>
                                            {subTotal != '' ? subTotal : props.route.params.item.total.toFixed(2).toString().replace(/\./g, ',')}
                                        </Text>
                                    </View>

                                    <View style={styles.MainRow}>
                                        <Text
                                            style={[
                                                styles.RightTextStyle,
                                                {
                                                    color: colors.PrimaryColor,
                                                    width: widthPercentageToDP('20%'),
                                                },
                                            ]}>
                                            {'Previous Coupon'}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.RightTextStyle,
                                                {
                                                    color: colors.PrimaryColor,
                                                },
                                            ]}>
                                            {props?.route?.params?.coupon.toString().replace(/\./g, ',')} TND
                                        </Text>
                                    </View>
                                    {/* {returncoupon > 0 ? (
                                        <View style={styles.MainRow}>
                                            <Text
                                                style={[
                                                    styles.RightTextStyle,
                                                    {
                                                        color: colors.PrimaryColor,
                                                        width: widthPercentageToDP('20%'),
                                                    },
                                                ]}>
                                                {'Return Coupon'}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.RightTextStyle,
                                                    {
                                                        color: colors.PrimaryColor,
                                                    },
                                                ]}>
                                                {returncoupon.toString().replace(/\./g, ',')} TND
                                            </Text>
                                        </View>
                                    ) : null} */}
                                    <View style={styles.MainRow}>
                                        <Text
                                            style={[
                                                styles.RightTextStyle,
                                                {
                                                    color: colors.PrimaryColor,
                                                    width: widthPercentageToDP('20%'),
                                                },
                                            ]}>
                                            {'Previous Discount'}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.RightTextStyle,
                                                {
                                                    color: colors.PrimaryColor,
                                                },
                                            ]}>
                                            {props?.route?.params?.discount.toString().replace(/\./g, ',')} TND
                                        </Text>
                                    </View>
                                    <View style={styles.MainRow}>
                                        <Text
                                            style={[
                                                styles.RightTextStyle,
                                                {
                                                    color: colors.PrimaryColor,
                                                    width: widthPercentageToDP('20%'),
                                                },
                                            ]}>
                                            {'Available Discount and Coupon'}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.RightTextStyle,
                                                {
                                                    color: colors.PrimaryColor,
                                                },
                                            ]}>
                                            {props?.route?.params?.DiscontandCoupon.toFixed(2).toString().replace(/\./g, ',')} TND
                                        </Text>
                                    </View>

                                    <View style={styles.MainRow}>
                                        <Text
                                            style={[
                                                styles.RightTextStyle,
                                                {
                                                    color: colors.PrimaryColor,
                                                    width: widthPercentageToDP('20%'),
                                                },
                                            ]}>
                                            {'Tax'}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.RightTextStyle,
                                                {
                                                    color: colors.PrimaryColor,
                                                },
                                            ]}>
                                            {props.Sale.saleItems[0].sale?.tax.toString().replace(/\./g, ',')} TND
                                        </Text>
                                    </View>
                                    {returnAmount > 0 ? (
                                        <View style={styles.MainRow}>
                                            <Text
                                                style={[
                                                    styles.RightTextStyle,
                                                    {
                                                        color: colors.PrimaryColor,
                                                        width: widthPercentageToDP('20%'),
                                                    },
                                                ]}>
                                                {'Return Amount'}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.RightTextStyle,
                                                    {
                                                        color: colors.PrimaryColor,
                                                    },
                                                ]}>
                                                {NumberFormat(returnAmount).replace(/\./g, ',')} TND
                                            </Text>
                                        </View>
                                    ) : null}
                                    {returnCouponDiscont > 0 ? (
                                        <View style={styles.MainRow}>
                                            <Text
                                                style={[
                                                    styles.RightTextStyle,
                                                    {
                                                        color: colors.PrimaryColor,
                                                        width: widthPercentageToDP('20%'),
                                                    },
                                                ]}>
                                                {'Return Discount and Coupon'}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.RightTextStyle,
                                                    {
                                                        color: colors.PrimaryColor,
                                                    },
                                                ]}>
                                                {NumberFormat(returnCouponDiscont).replace(/\./g, ',')} TND
                                            </Text>
                                        </View>
                                    ) : null}

                                    <View
                                        style={{
                                            borderColor: '#BFBFBF',
                                            borderWidth: 1,
                                            borderStyle: 'dotted',
                                            marginVertical: widthPercentageToDP('1%'),
                                        }}
                                    />

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                fontFamily: 'Poppins-SemiBold',
                                                color: colors.PrimaryColor,
                                                fontSize: heightPercentageToDP('2.2%'),
                                            }}>
                                            {'Total'}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: 'Poppins-SemiBold',
                                                color: colors.PrimaryColor,
                                                fontSize: heightPercentageToDP('2.2%'),
                                            }}>
                                            {/* {NumberFormat((parseFloat(subTotal) + parseFloat(props.Sale.saleItems[0].sale?.tax))
                                                - (props?.route?.params?.discount - returndiscount)
                                                - (props?.route?.params?.coupon - returncoupon)
                                            ).replace(/\./g, ',')} */}
                                            {NumberFormat((parseFloat(subTotal) + parseFloat(props.Sale.saleItems[0].sale?.tax))
                                                - ((parseFloat(props?.route?.params?.DiscontandCoupon)) - parseFloat(returnCouponDiscont))

                                            ).replace(/\./g, ',')}

                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            {/* </ScrollView> */}
        </View>
    )
}
const mapStateToProps = ({ Sale, Shared }) => ({
    Sale,
    Shared
});

export default connect(mapStateToProps, {
    deleteSale,
    MinusQuantity,
    ReturnSale
})(ReturnOrders);

const styles = StyleSheet.create({
    ViewStyle: {
        paddingVertical: heightPercentageToDP('1.3%'),
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: widthPercentageToDP('12%'),
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginVertical: heightPercentageToDP('1.5%'),
    },
    textStyle: {
        fontSize: heightPercentageToDP('2.2%'),
        fontFamily: 'Poppins-Medium',
    },
    DataTableHeaderTextView: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: heightPercentageToDP('2.2%'),
    },
    DateCellTextView: {
        fontFamily: 'Poppins-Regular',
        fontSize: heightPercentageToDP('2.2%'),
    },
    RightTextStyle: {
        fontFamily: 'Poppins-Regular',
        fontSize: heightPercentageToDP('2%'),
    },
    MainRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});