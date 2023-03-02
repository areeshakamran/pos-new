import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { useTheme } from '@react-navigation/native';
import Back from '../Assets/Images/back.svg'

export default function CustomHeader(props) {
    const { colors } = useTheme()

    return (
        <View style={[styles.Viewsss, {
            height: heightPercentageToDP('10%'),
            backgroundColor: colors.light,
            alignItems: "center",
            flexDirection: "row",
            paddingHorizontal: widthPercentageToDP('1%')
        }]}>
            <TouchableOpacity
                onPressOut={props?.onPressOut}
                onPress={() => props.navigation.goBack()}>
                <Back width={widthPercentageToDP('2%')} height={heightPercentageToDP('3.5%')} />
            </TouchableOpacity>
            <Text style={{
                fontFamily: 'Poppins-SemiBold',
                color: colors.PrimaryColor,
                fontSize: heightPercentageToDP('3%'),
                marginLeft: widthPercentageToDP('1%')
            }}>{props.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    Viewsss: {
        elevation: 10,
        zIndex: 1,
    }
})