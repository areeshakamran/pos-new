import { StyleSheet, Text, Modal, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import {
    heightPercentageToDP,
    widthPercentageToDP,
} from 'react-native-responsive-screen';
import { useTheme } from '@react-navigation/native';
import CustomInput from '../Component/CustomInput'
import HomeCustomeButton from '../Modules/Home/Components/HomeCustomeButton';
import LocalizationContext from '../../LocalizationContext';

export default function CustomModal(props) {
    const { t } = React.useContext(LocalizationContext);
    const [fixedPercentageState, setFixedPercentageState] = React.useState(false)
    const { colors } = useTheme()
    const [value, setvalues] = useState(props?.value)

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
                    <Text style={{
                        fontFamily: 'Poppins-SemiBold',
                        color: colors.PrimaryColor,
                        fontSize: heightPercentageToDP('3.5%'),
                        textAlign: "center"
                    }}>
                        {props.title}
                    </Text>

                    {props.title == t('Apply Coupon') || props.title == t('Open Cash Adjustment')
                        ? null
                        :
                        <View style={{ marginVertical: heightPercentageToDP('1%') }}>
                            <Text style={{
                                fontFamily: 'Poppins-SemiBold',
                                color: colors.PrimaryColor,
                                fontSize: heightPercentageToDP('2.5%'),
                                textAlign: "center"
                            }}>
                                {props.type}
                            </Text>

                            <View style={[styles.MainContainer]}>
                                <HomeCustomeButton
                                    onpress={() => setFixedPercentageState(!fixedPercentageState)}
                                    title={t('Fixed')}
                                    style={[styles.fixedPercetageView, {
                                        borderColor: colors.PrimaryColor,
                                        borderWidth: fixedPercentageState ? 0 : 1,
                                        backgroundColor: fixedPercentageState ? colors.PrimaryColor : colors.light,
                                    }]}
                                    txtStyle={[styles.fixedPercetageText, {
                                        color: fixedPercentageState ? colors.light : colors.PrimaryColor,
                                    }]}
                                />
                                <HomeCustomeButton
                                    onpress={() => setFixedPercentageState(!fixedPercentageState)}
                                    title={t('Percentage')}
                                    style={[styles.fixedPercetageView, {
                                        marginHorizontal: widthPercentageToDP('0.5%'),
                                        borderColor: colors.PrimaryColor,
                                        borderWidth: fixedPercentageState ? 1 : 0,
                                        backgroundColor: fixedPercentageState ? colors.light : colors.PrimaryColor,
                                    }]}
                                    txtStyle={[styles.fixedPercetageText, {
                                        color: fixedPercentageState ? colors.PrimaryColor : colors.light,
                                    }]}
                                />
                            </View>
                        </View>
                    }

                    <CustomInput
                        keyboarType={props?.keyboarType}
                        placeholder={props?.PlaceholderTitle}
                        style={[styles.CustomeInputView, {
                            color: colors.PrimaryColor,
                        }]}
                        value={value}
                        onChangeText={(text) => setvalues(text)}
                    />

                    <View
                        style={[styles.MainContainer]}>
                        <HomeCustomeButton
                            onpress={props?.onModalClose}
                            onPressIn={props.title == t('Open Cash Adjustment') ? () => console.log('Open Cash Adjustment') : () => props?.setValue(value, fixedPercentageState)}
                            title={t('Apply')}
                            style={[styles.ViewStyle, {
                                backgroundColor: colors.SuccessColor,
                            }]}
                            txtStyle={[styles.textStyle, {
                                color: colors.light,
                            }]}
                        />
                        <HomeCustomeButton
                            onpress={props?.onModalClose}
                            title={t('Cancel')}
                            style={[styles.ViewStyle, {
                                backgroundColor: colors.deleteColor,
                            }]}
                            txtStyle={[styles.textStyle, {
                                color: colors.light,
                            }]}
                        />
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
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