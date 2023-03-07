import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import CustomHeader from '../../Component/CustomeHeader';
import CartItemsCompnentRight from '../Home/Components/CartItemsComponentRight';
import CalculationScreen from './Compoenents/CalculationScreen';
import LocalizationContext from '../../../LocalizationContext';
export default function Checkout(props) {
    const { t } = React.useContext(LocalizationContext);
    const { colors } = useTheme()
    const { tax, discount, total } = props?.route?.params
    return (
        <View style={{ flex: 1 }}>
            <CustomHeader title={t('Check Out')} navigation={props.navigation} />

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