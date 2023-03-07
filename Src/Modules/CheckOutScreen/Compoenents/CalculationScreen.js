import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP
} from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import Cross from '../../../Assets/Images/cross.svg';
import CustomePayingView from '../../../Component/CustomePayingView';
import { NumberFormat } from '../../../Confiq/Helper';
import { ChangePaymentType, UserPay } from '../../../Store/Actions/CartAction';
import HomeCustomeButton from '../../Home/Components/HomeCustomeButton';
import LocalizationContext from '../../../../LocalizationContext';

function CalculationScreen(props) {
  const [paymentSwtich, setPaymentSwitch] = React.useState(true);
  const [total, settotal] = useState(0)
  const [amountleft, setamountleft] = useState(0)
  const [change, setchange] = useState(0)
  const { t } = React.useContext(LocalizationContext);

  useEffect(() => {
    settotal(props?.Cart?.total)
    setchange(NumberFormat(props?.Cart.customerpay - props?.Cart?.total))
    if ((props?.Cart?.total - props?.Cart.customerpay) < 0) {
      setamountleft(0)
    } else {
      setamountleft(props?.Cart?.total - props?.Cart.customerpay)
    }
  }, [props?.Cart.customerpay, props?.Cart?.total])

  const pay = props?.Cart?.customerpay
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          marginTop: heightPercentageToDP('5%'),
        }}>
        <CustomePayingView
          title={t("Total Amount")}
          value={`${NumberFormat(total).replace(/\./g, ',')} TND`}
          color={colors.DraftColor}
        />
        <CustomePayingView
          title={t("Amount Pay")}
          value={props?.Cart.customerpay == '' ? '0 TND' : `${NumberFormat(props?.Cart.customerpay).replace(/\./g, ',')} TND`}
          color={colors.DiscountColor}
        />
        <CustomePayingView
          title={t("Amount Left")}
          value={`${NumberFormat(amountleft).replace(/\./g, ',')} TND`}
          color={colors.SuccessColor}
        />
        <CustomePayingView
          title={t("Change")}
          value={`${NumberFormat(change).replace(/\./g, ',')} TND`}
          color={colors.deleteColor}
        />
      </View>

      <View
        style={{
          justifyContent: 'center',
          width: widthPercentageToDP('45%'),
          alignSelf: 'center',
          marginVertical: heightPercentageToDP('2%'),
        }}>
        <Text
          style={{
            fontFamily: 'Poppins-SemiBold',
            color: colors.PrimaryColor,
            fontSize: heightPercentageToDP('2%'),
          }}>
          {t('Amount')}
        </Text>

        <View style={{
          backgroundColor: 'white',
          elevation: 5,
          height: heightPercentageToDP('7%'),
          padding: widthPercentageToDP('0.5%'),
          width: widthPercentageToDP('45%'),
          borderRadius: 2,
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Text style={{
            color: colors.PrimaryColor,
            fontFamily: 'Poppins-Regular',
            fontSize: heightPercentageToDP('2.5%'),
          }}>
            {(props?.Cart?.customerpay.toString()).replace(/\./g, ',')}
          </Text>
        </View>

        <View style={[styles.MainContainer]}>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              color: colors.PrimaryColor,
              fontSize: heightPercentageToDP('2.2%'),
              textAlign: 'center',
            }}>
            {`${t('Payment Method')}: `}
          </Text>

          <HomeCustomeButton
            onpress={() => {
              setPaymentSwitch(!paymentSwtich)
              props?.ChangePaymentType(!paymentSwtich)
            }}
            title={t('Cash')}
            style={[
              styles.fixedPercetageView,
              {
                borderColor: colors.PrimaryColor,
                borderWidth: paymentSwtich ? 0 : 1,
                padding: widthPercentageToDP('0.4%'),
                backgroundColor: paymentSwtich
                  ? colors.PrimaryColor
                  : colors.light,
              },
            ]}
            txtStyle={[
              styles.fixedPercetageText,
              {
                fontSize: heightPercentageToDP('2.2%'),
                color: paymentSwtich ? colors.light : colors.PrimaryColor,
              },
            ]}
          />
          <HomeCustomeButton
            onpress={() => {
              setPaymentSwitch(!paymentSwtich)
              props?.ChangePaymentType(!paymentSwtich)
            }}
            title={t('Credit Card')}
            style={[
              styles.fixedPercetageView,
              {
                marginHorizontal: widthPercentageToDP('0.5%'),
                padding: widthPercentageToDP('0.4%'),
                borderColor: colors.PrimaryColor,
                borderWidth: paymentSwtich ? 1 : 0,
                backgroundColor: paymentSwtich
                  ? colors.light
                  : colors.PrimaryColor,
              },
            ]}
            txtStyle={[
              styles.fixedPercetageText,
              {
                fontSize: heightPercentageToDP('2.2%'),
                color: paymentSwtich ? colors.PrimaryColor : colors.light,
              },
            ]}
          />
        </View>

        <FlatList
          data={[
            { id: 1, value: '1 TND', onPressAdd: () => { props?.UserPay(parseFloat(pay == '' ? 0 : pay) + 1) } },
            { id: 2, value: '5 TND', onPressAdd: () => { props?.UserPay(parseFloat(pay == '' ? 0 : pay) + 5) } },
            { id: 3, value: '10 TND', onPressAdd: () => { props?.UserPay(parseFloat(pay == '' ? 0 : pay) + 10) } },
            { id: 4, value: '50 TND', onPressAdd: () => { props?.UserPay(parseFloat(pay == '' ? 0 : pay) + 50) } },
          ]}
          numColumns={4}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => {
            return (
              <HomeCustomeButton
                onpress={item.onPressAdd}
                title={item.value}
                style={[
                  {
                    borderRadius: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: widthPercentageToDP('10.3%'),
                    flexDirection: 'row',
                    elevation: 5,
                    borderColor: colors.PrimaryColor,
                    backgroundColor: colors.PrimaryColor,
                    padding: widthPercentageToDP('0.4%'),
                    margin: widthPercentageToDP('0.5%'),
                  },
                ]}
                txtStyle={[
                  styles.fixedPercetageText,
                  {
                    color: colors.light,
                    fontSize: heightPercentageToDP('2.2%'),
                  },
                ]}
              />
            );
          }}
        />

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <FlatList
            data={[
              { id: 1, value: 1, onPressCount: () => { props?.UserPay(props?.Cart?.customerpay + '1') } },
              { id: 2, value: 2, onPressCount: () => { props?.UserPay(props?.Cart?.customerpay + '2') } },
              { id: 3, value: 3, onPressCount: () => { props?.UserPay(props?.Cart?.customerpay + '3') } },
              { id: 4, value: 4, onPressCount: () => { props?.UserPay(props?.Cart?.customerpay + '4') } },
              { id: 5, value: 5, onPressCount: () => { props?.UserPay(props?.Cart?.customerpay + '5') } },
              { id: 6, value: 6, onPressCount: () => { props?.UserPay(props?.Cart?.customerpay + '6') } },
              { id: 7, value: 7, onPressCount: () => { props?.UserPay(props?.Cart?.customerpay + '7') } },
              { id: 8, value: 8, onPressCount: () => { props?.UserPay(props?.Cart?.customerpay + '8') } },
              { id: 9, value: 9, onPressCount: () => { props?.UserPay(props?.Cart?.customerpay + '9') } },
              { id: 10, value: ',', onPressCount: () => { props?.UserPay(props?.Cart?.customerpay + '.') } },
              { id: 11, value: '0', onPressCount: () => { props?.UserPay(props?.Cart?.customerpay + '0') } },
              {
                id: 12, value: 'x', onPressCount: () => {
                  props?.UserPay(props?.Cart?.customerpay.toString().slice(0, -1))
                  if (props?.Cart?.customerpay.length == 1) {
                    props?.UserPay(0)
                  }
                }
              },
            ]}
            numColumns={3}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => {
              return (
                <HomeCustomeButton
                  onpress={item.onPressCount}
                  title={index == 11 ? null : item.value}
                  Icon={index == 11 ? Cross : null}
                  IconWidth={widthPercentageToDP('3%')}
                  IconHeight={heightPercentageToDP('3%')}
                  style={[
                    styles.fixedPercetageView,
                    {
                      borderColor: colors.PrimaryColor,
                      padding: widthPercentageToDP('1%'),
                      backgroundColor: colors.light,
                      margin: widthPercentageToDP('0.5%'),
                    },
                  ]}
                  txtStyle={[
                    styles.fixedPercetageText,
                    {
                      fontSize: heightPercentageToDP('3%'),
                      color: colors.PrimaryColor,
                    },
                  ]}
                />
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  CustomeInputView: {
    backgroundColor: 'white',
    elevation: 5,
    height: heightPercentageToDP('7%'),
    padding: widthPercentageToDP('0.5%'),
    fontSize: heightPercentageToDP('2.5%'),
    width: widthPercentageToDP('45%'),
    borderRadius: 2,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  MainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: heightPercentageToDP('3%'),
    marginBottom: heightPercentageToDP('3%'),
  },
  fixedPercetageView: {
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: widthPercentageToDP('14%'),
    flexDirection: 'row',
    elevation: 5,
  },
  fixedPercetageText: {
    fontFamily: 'Poppins-Medium',
  },
});
const mapStateToProps = ({ Cart }) => ({
  Cart
});

export default connect(mapStateToProps, {
  UserPay,
  ChangePaymentType
})(CalculationScreen);