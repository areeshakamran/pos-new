import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { useTheme } from '@react-navigation/native';
import CustomHeader from '../../Component/CustomeHeader';
import CartItemsCompnentRight from '../Home/Components/CartItemsComponentRight';
import CalculationScreen from './Compoenents/CalculationScreen';

export default function Checkout(props) {
    const { colors } = useTheme()
    const { tax, discount, total } = props?.route?.params
    return (
        <View style={{ flex: 1 }}>
            <CustomHeader title='Checkout' navigation={props.navigation} />

            <View style={{ flexDirection: "row", flex: 1 }}>
                <View
                    style={[styles.Viewsss, {
                        width: widthPercentageToDP('30%'),
                        backgroundColor: colors.light,
                        padding: widthPercentageToDP('1%')
                    }]}>
                    <CartItemsCompnentRight
                        navigation={props?.navigation}
                        tax={tax}
                        discount={discount}
                        discountorginal={props?.route?.params?.discountorginal}
                        discointtype={props?.route?.params?.discointtype}
                        firstadd={props?.route?.params?.firstadd}

                    />
                </View>
                <View
                    style={[{
                        width: widthPercentageToDP('70%'),
                        backgroundColor: colors.grayLightColor
                    }]}>
                    <CalculationScreen
                        total={total}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Viewsss: {
        elevation: 5,
    }
})