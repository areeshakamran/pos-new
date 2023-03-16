import { StyleSheet, Text, Modal, TouchableOpacity, View, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import {
    heightPercentageToDP,
    widthPercentageToDP,
} from 'react-native-responsive-screen';
import { useTheme } from '@react-navigation/native';
import HomeCustomeButton from './HomeCustomeButton';
import { addModifiers } from '../../../Store/Actions/CartAction';
import store from '../../../Store';
import { AddtoCart } from '../../../Store/Actions/CartAction';

export default function ModifiersModal(props) {
    const [variationsValue, setVariationValue] = React.useState([])
    const { colors } = useTheme()

    const MultipleSelectionVaraitions = (item) => {
        let varaitionArray = [...variationsValue]
        if (varaitionArray.length > 0) {
            let indexValue = variationsValue.findIndex(obj => obj.id == item.id)
            if (indexValue == -1) {
                varaitionArray.push(item)
                setVariationValue(varaitionArray)
            }
            else {
                let RemoveValue = varaitionArray.filter(obj => obj.id != item.id)
                setVariationValue(RemoveValue)
            }
        }
        else {
            setVariationValue([item])
        }
    }

    useEffect(() => {
        if (props?.item?.ModifiersAdded) {
            setVariationValue(props?.item?.ModifiersAdded)
        } else {
            setVariationValue([])
        }
        if (props?.inProduct) {
            let index = store.getState().Cart.cart.findIndex(obj => obj.id == props?.item?.id)
            if (index != -1) {
                setVariationValue(store.getState().Cart.cart[index].ModifiersAdded)
            }
        }

    }, [props?.item, store.getState().Cart.cart])

    const AddtoCartftn = () => {
        if (props?.inProduct) { //modifiers pop up open in centeral view before adding to cart by long press the cart 
            let data = { ...props?.item }
            data.ModifiersAdded = variationsValue
            store.dispatch(AddtoCart(data))
            setVariationValue([])
        } else {
            store.dispatch(addModifiers(variationsValue, props?.item))
        }
    }
    return (
        <Modal
            visible={props.modalVisible}
            transparent={true}>
            <TouchableOpacity
                onPress={props.onModalClose}
                activeOpacity={1}
                style={[styles.MainContainer1]}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={props.style}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginVertical: heightPercentageToDP('2%'),
                            marginHorizontal: widthPercentageToDP('2%')
                        }}>
                        <Text style={{
                            fontFamily: 'Poppins-SemiBold',
                            color: colors.PrimaryColor,
                            fontSize: heightPercentageToDP('2.7%'),
                            textAlign: "center"
                        }}>
                            {props?.item?.name_fr}
                        </Text>

                        <Text style={{
                            fontFamily: 'Poppins-Regular',
                            color: colors.PrimaryColor,
                            fontSize: heightPercentageToDP('2.2%'),
                            textAlign: "center"
                        }}>
                            {props?.item?.price_euro} TND
                        </Text>
                    </View>

                    <View style={{ borderBottomColor: 'silver', borderBottomWidth: 1, marginHorizontal: widthPercentageToDP('2%') }} />

                    <FlatList
                        data={props?.value}
                        keyExtractor={(item, index) => index}
                        ListHeaderComponent={
                            <Text style={{
                                fontFamily: 'Poppins-SemiBold',
                                color: colors.PrimaryColor,
                                fontSize: heightPercentageToDP('2.2%'),
                                marginHorizontal: widthPercentageToDP('2%'),
                                marginBottom: heightPercentageToDP('1%'),
                                marginTop: heightPercentageToDP('2%')
                            }}>
                                Select Variation
                            </Text>
                        }
                        ListEmptyComponent={
                            <Text style={{
                                fontFamily: 'Poppins-Regular',
                                color: 'silver',
                                fontSize: heightPercentageToDP('2.5%'),
                                textAlign: "center"
                            }}>
                                No Modifiers Available!
                            </Text>
                        }
                        renderItem={({ item, index }) => {
                            if (variationsValue.length > 0) var include = variationsValue.findIndex(ob => ob.id == item.id)
                            else var include = -1
                            return (
                                <View
                                    key={index}
                                    style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: heightPercentageToDP('1%'), marginHorizontal: widthPercentageToDP('2%') }}>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <Text style={{
                                            fontFamily: 'Poppins-Regular',
                                            color: colors.PrimaryColor,
                                            fontSize: heightPercentageToDP('2%'),
                                            textAlign: "center",

                                        }}>
                                            {item?.name}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{
                                            fontFamily: 'Poppins-Regular',
                                            color: colors.PrimaryColor,
                                            fontSize: heightPercentageToDP('2%'),
                                            textAlign: "center",
                                            alignSelf: "center",
                                            marginRight: widthPercentageToDP('0.5')
                                        }}>
                                            {item?.price} TND
                                        </Text>
                                        <HomeCustomeButton
                                            onpress={() => MultipleSelectionVaraitions(item)}
                                            title="Add"
                                            style={[
                                                styles.ViewStyle,
                                                {
                                                    backgroundColor: include == -1 ? 'white' : colors.SuccessColor,
                                                    borderColor: include == -1 ? colors.PrimaryColor : colors.SuccessColor,
                                                    borderWidth: 1,
                                                    width: widthPercentageToDP('6')
                                                },
                                            ]}
                                            txtStyle={[
                                                styles.textStyle,
                                                {
                                                    // color: colors.parseInt,
                                                    color: include == -1 ? colors.PrimaryColor : "#fff",
                                                    fontSize: heightPercentageToDP('2%'),
                                                },
                                            ]}
                                        />
                                    </View>

                                </View>
                            )
                        }}
                    />

                    <HomeCustomeButton
                        onpress={props.onModalClose}
                        onPressIn={() => AddtoCartftn()}
                        title={'Add to Chart'}
                        style={{
                            padding: widthPercentageToDP('0.5%'),
                            borderRadius: 4,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            backgroundColor: colors.PrimaryColor,
                            width: widthPercentageToDP('28%'),
                            marginVertical: widthPercentageToDP('1%')
                        }}
                        txtStyle={{
                            fontFamily: 'Poppins-SemiBold',
                            color: colors.light,
                            fontSize: heightPercentageToDP('2.2%'),
                        }}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal >
    )
}

const styles = StyleSheet.create({
    MainContainer1: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: "center",
        justifyContent: "center"
    },
    MainContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: heightPercentageToDP('1%')
    },
    ViewStyle: {
        padding: widthPercentageToDP('0.5%'),
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: widthPercentageToDP('12%'),
        flexDirection: 'row',
        margin: widthPercentageToDP('0.5%'),
        elevation: 5,
    },
    textStyle: {
        fontSize: heightPercentageToDP('2.6%'),
        fontFamily: 'Poppins-Medium',
        marginHorizontal: widthPercentageToDP('1%')
    },
    fixedPercetageView: {
        padding: widthPercentageToDP('0.4%'),
        borderRadius: 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: widthPercentageToDP('10%'),
        flexDirection: 'row',
        elevation: 5,
    },
    fixedPercetageText: {
        fontSize: heightPercentageToDP('2%'),
        fontFamily: 'Poppins-Medium',
    },
    CustomeInputView: {
        marginTop: heightPercentageToDP('2%'),
        backgroundColor: "white",
        elevation: 5,
        height: heightPercentageToDP('7%'),
        padding: widthPercentageToDP('0.5%'),
        fontSize: heightPercentageToDP('2.5%'),
        width: widthPercentageToDP('21%'),
        borderRadius: 2,
        fontFamily: 'Poppins-Regular',
        textAlign: 'center'
    }
})