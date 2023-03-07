import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { useTheme } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Draft from '../../../Assets/Images/draft.svg';
import Delete from '../../../Assets/Images/delete.svg';
import HomeCustomeButton from './HomeCustomeButton';
import ModifiersModal from './ModifiersModal';
import CustomModal from '../../../Component/CustomModal';
import { connect } from 'react-redux';
import { NumberFormat } from '../../../Confiq/Helper';
import LocalizationContext from '../../../../LocalizationContext';
import {
  DeleteAllCart,
  IncreaseAndMinusQuantity,
  DeleteItemFromCart,
  ChangeTotal,
  payamount,
  VerifyCoupons,
  zeroCoupon,
} from '../../../Store/Actions/CartAction';
import {
  DraftAPI,
  AddDraftToOffDrafts,
} from '../../../Store/Actions/DraftAction';

function CartItemsCompnentRight(props) {
  const { colors } = useTheme();
  const [modiefiersModal, setModifierModal] = React.useState(false);
  const [CouponModal, setCouponModal] = React.useState(false);
  const [DiscountModal, setDiscountModal] = React.useState(false);
  const [TaxModal, setTaxModal] = React.useState(false);
  const [DraftLoader, setDraftLoader] = React.useState(false);
  const [CheckOutLoader, setCheckOutLoader] = React.useState(false);
  const [ValueCheck, setValueCheck] = React.useState(false);
  const [discountOrginalValue, setdiscountOrginalValue] = useState(props?.discountorginal)
  const [discounttype, setdiscounttype] = useState(props?.discointtype)
  const [firstadd, setfirstadd] = useState(props?.firstadd)

  const [Total, setTotal] = useState(0);
  const [tax, settax] = useState(props?.tax);
  const [discount, setdiscount] = useState(props?.discount);
  const [item, setitem] = useState({});
  const [couponamountstate, setcouponamountstate] = useState(0)
  const [remainingSubTotal, setremainingSubTotal] = useState(0)
  const { t } = React.useContext(LocalizationContext);

  const [modifiers, setmodifiers] = useState([]);
  const Clickable = str => {
    if (str == 'Coupon') {
      if (props?.Cart.cart.length > 0) {
        if (props?.Shared?.Internet) {
          setCouponModal(!CouponModal);
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'Please connect to Internet to Apply Connect',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }

      } else {
        ToastAndroid.showWithGravityAndOffset(
          'Add Items in Cart',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
    } else if (str == 'Discount') {
      if (props?.Cart.cart.length > 0) {
        setDiscountModal(!DiscountModal);
      } else {
        ToastAndroid.showWithGravityAndOffset(
          'Add Items in Cart',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
    } else if (str == 'Tax') {
      setTaxModal(!TaxModal);
    } else {
      setModifierModal(!modiefiersModal);
    }
  };

  const CulculateSubTotal = () => {
    let total = 0;
    for (let i = 0; i < props?.Cart?.cart.length; i++) {
      total =
        props?.Cart?.cart[i].quantity * props?.Cart?.cart[i].price_euro + total;
      if (props?.Cart?.cart[i]?.ModifiersAdded) {
        for (let j = 0; j < props?.Cart?.cart[i]?.ModifiersAdded.length; j++) {
          total = total + props?.Cart?.cart[i]?.ModifiersAdded[j].price;
        }
      }
    }
    return NumberFormat(total);
  };



  useEffect(() => {
    calculateDiscountAndCoupon()
  }, [props?.Cart?.cart, props?.Cart?.coupontype]);

  function calculateDiscountAndCoupon() {

    const total = parseFloat(CulculateSubTotal());

    const taxapplied = (props?.Cart?.tax / 100) * parseFloat(total);
    settax(NumberFormat(taxapplied));
    // var orginalTotal = parseFloat(NumberFormat(total)) + parseFloat(NumberFormat(taxapplied))
    var orginalTotal = parseFloat(NumberFormat(total))
    if (firstadd == 'coupon') {
      if (props?.Cart?.coupontype == '%') {
        var couponamount = (props?.Cart?.coupons / 100) * orginalTotal;
      } else {
        var couponamount = props?.Cart?.coupons;
      }
      var withCoupon = parseFloat(orginalTotal) - parseFloat(couponamount)

      if (discounttype == '%') {
        var discountamount = (discountOrginalValue / 100) * withCoupon
      } else {
        var discountamount = discountOrginalValue;
      }
    } else {
      if (discounttype == '%') {
        var discountamount = (discountOrginalValue / 100) * orginalTotal
      } else {
        var discountamount = discountOrginalValue;
      }
      var withDiscount = parseFloat(orginalTotal) - parseFloat(discountamount)
      if (props?.Cart?.coupontype == '%') {
        var couponamount = (props?.Cart?.coupons / 100) * withDiscount;
      } else {
        var couponamount = props?.Cart?.coupons;
      }
    }
    let discount = discountamount == '' ? 0 : discountamount
    let coupon = couponamount == '' ? 0 : couponamount
    if (coupon > 0 && (discounttype == '' || discounttype == null)) {
      setfirstadd('coupon')
    }
    setcouponamountstate(coupon)
    setdiscount(discount)
    var totals = (total) + (taxapplied) - (discountamount) - (couponamount);
    setTotal(totals);
    props?.ChangeTotal(totals);
    if (totals == 0) {
      props.navigation.navigate('Main');
    }
    if (props.Cart.cart.length == 0) {
      setdiscount(0);
      setdiscountOrginalValue(0)
      setdiscounttype('')
      setTotal(0);
      setfirstadd('')
    }
    if (parseFloat(totals) < parseFloat(discount)) {
      setValueCheck(false);
    } else {
      setValueCheck(true);
    }
  }

  const removediscountcoupon = () => {
    const total = parseFloat(CulculateSubTotal());
    const taxapplied = (props?.Cart?.tax / 100) * total;
    settax(NumberFormat(taxapplied));
    let totals = total + parseFloat(taxapplied);
    setTotal(totals);
    props?.ChangeTotal(totals);
    props?.zeroCoupon();
    setdiscount(0);
  };
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: widthPercentageToDP('0.5%'),
          marginBottom: heightPercentageToDP('1%'),
        }}>
        <Text
          style={{
            color: colors.PrimaryColor,
            fontSize: heightPercentageToDP('2%'),
            fontFamily: 'Poppins-SemiBold',
          }}>
          {t('Cart Items')}
        </Text>

        <HomeCustomeButton
          onpress={async () => {
            await props?.DeleteAllCart(), setdiscount(0);
            settax(0);
            setTotal(0);
            ToastAndroid.showWithGravityAndOffset(
              'Cart Items are Cleared',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );
          }}
          Icon={Delete}
          IconWidth={widthPercentageToDP('3%')}
          IconHeight={heightPercentageToDP('3%')}
          style={{
            backgroundColor: 'transparent',
          }}
        />
      </View>

      <FlatList
        data={props?.Cart.cart}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              onLongPress={
                // item?.modifiers.length > 0 ?
                () => {
                  Clickable('Modifiers'),
                    setmodifiers(item?.modifiers),
                    setitem(item);
                }
              }
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: widthPercentageToDP('25%'),
                  backgroundColor: colors.light,
                  elevation: 5,
                  marginHorizontal: widthPercentageToDP('0.2%'),
                  borderRadius: 2,
                  marginVertical: heightPercentageToDP('0.1%'),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginHorizontal: widthPercentageToDP('0.5%'),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        width: widthPercentageToDP('3%'),
                        fontFamily: 'Poppins-Bold',
                        textAlign: 'center',
                        color: colors.PrimaryColor,
                        fontSize: heightPercentageToDP('2%'),
                      }}>
                      {item?.quantity}
                    </Text>
                    <Entypo
                      style={{
                        marginHorizontal: widthPercentageToDP('0.5%'),
                        fontFamily: 'Poppins-SemiBold',
                        marginTop: heightPercentageToDP('0.7%'),
                      }}
                      name="cross"
                      color={colors.PrimaryColor}
                      size={heightPercentageToDP('2%')}
                    />
                    <Text
                      style={{
                        width: widthPercentageToDP('14%'),
                        fontFamily: 'Poppins-Bold',
                        color: colors.PrimaryColor,
                        fontSize: heightPercentageToDP('2%'),
                      }}>
                      {item.name_fr}
                    </Text>
                  </View>

                  <Text
                    numberOfLines={1}
                    style={{
                      width: widthPercentageToDP('4%'),
                      color: colors.PrimaryColor,
                      fontSize: heightPercentageToDP('2%'),
                      fontFamily: 'Poppins-Regular',
                      fontStyle: 'italic',
                    }}>
                    {NumberFormat(item?.quantity * item?.price_euro).replace(/\./g, ',')} TND
                  </Text>
                </View>

                <View style={{ paddingBottom: heightPercentageToDP('1%') }}>
                  {item?.ModifiersAdded
                    ? item?.ModifiersAdded.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: widthPercentageToDP('2%'),
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Poppins-Regular',
                              color: colors.PrimaryColor,
                              fontSize: heightPercentageToDP('1.5%'),
                            }}>
                            {item?.name}
                          </Text>
                          <Text
                            style={{
                              fontFamily: 'Poppins-Regular',
                              color: colors.PrimaryColor,
                              fontSize: heightPercentageToDP('1.5%'),
                            }}>
                            {item?.price}
                          </Text>
                        </View>
                      );
                    })
                    : null}
                </View>
              </View>

              <AntDesign
                name="minus"
                onPress={async () => {
                  if (ValueCheck) {
                    // removediscountcoupon();
                    await props?.IncreaseAndMinusQuantity(
                      item?.id,
                      item?.quantity - 1,
                    );
                  } else {
                    ToastAndroid.showWithGravityAndOffset(
                      'Discount should be less than subTotal',
                      ToastAndroid.LONG,
                      ToastAndroid.BOTTOM,
                      25,
                      50,
                    );
                  }
                }}
                color={colors.light}
                size={heightPercentageToDP('2%')}
                style={{
                  backgroundColor:
                    item?.quantity == 1
                      ? colors.deleteColor
                      : colors.PrimaryColor,
                  padding: widthPercentageToDP('0.5%'),
                  borderRadius: 2,
                  margin: widthPercentageToDP('0.1%'),
                  elevation: 5,
                }}
              />
            </TouchableOpacity>
          );
        }}
      />

      <View>
        <View style={styles.MainRow}>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              color: colors.PrimaryColor,
              fontSize: heightPercentageToDP('2.2%'),
            }}>
            {t('Sub Total')}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              color: colors.PrimaryColor,
              fontSize: heightPercentageToDP('2.2%'),
            }}>
            {NumberFormat(CulculateSubTotal()).replace(/\./g, ',')} TND
          </Text>
        </View>

        <View style={styles.MainRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {props?.Cart?.coupons ? (
              <Entypo
                onPress={() => {
                  if (discounttype == '' || discounttype == null) {
                    props.zeroCoupon()
                  } else {
                    var Orginaltotal = parseFloat(CulculateSubTotal()) + parseFloat(tax);
                    if (discounttype == '%') {
                      var value = (discountOrginalValue / 100) * Orginaltotal
                      setdiscount(value)
                      props.zeroCoupon()
                    }
                    else {
                      var value = discountOrginalValue - Orginaltotal
                      setdiscount(value)
                      props.zeroCoupon()
                    }

                  }

                }}
                style={{
                  fontFamily: 'Poppins-SemiBold',
                }}
                name="cross"
                color={colors.deleteColor}
                size={heightPercentageToDP('2.5%')}
              />
            ) : null}
            <Text
              style={[
                styles.RightTextStyle,
                {
                  marginHorizontal: props?.Cart?.coupons
                    ? widthPercentageToDP('0.5%')
                    : 0,
                  color: colors.lightSecondayColor,
                },
              ]}>
              {t('Coupon')}
            </Text>
          </View>

          <Text
            style={[
              styles.RightTextStyle,
              {
                color: colors.lightSecondayColor,
              },
            ]}>
            {NumberFormat(props?.Cart?.coupons).replace(/\./g, ',')}{' '}
            {props?.Cart?.coupontype == '%' ? '%' : 'TND'}
          </Text>
        </View>

        <View style={styles.MainRow}>
          <Text
            style={[
              styles.RightTextStyle,
              {
                color: colors.lightSecondayColor,
              },
            ]}>
            {t('Discount')}
          </Text>
          <Text
            style={[
              styles.RightTextStyle,
              {
                color: colors.lightSecondayColor,
              },
            ]}>
            {NumberFormat(discount).replace(/\./g, ',')} TND
          </Text>
        </View>

        <View style={styles.MainRow}>
          <Text
            style={[
              styles.RightTextStyle,
              {
                color: colors.lightSecondayColor,
              },
            ]}>
            {t('Tax')}
          </Text>
          <Text
            style={[
              styles.RightTextStyle,
              {
                color: colors.lightSecondayColor,
              },
            ]}>
            {NumberFormat(tax).replace(/\./g, ',')} TND
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <HomeCustomeButton
            onpress={() => Clickable('Coupon')}
            title={t("Coupon")}
            style={[
              styles.ViewStyle,
              {
                // backgroundColor: colors.CouponColor,
                backgroundColor: 'white',
                borderColor: colors.PrimaryColor,
                borderWidth: 1,
              },
            ]}
            txtStyle={[
              styles.textStyle,
              {
                // color: colors.parseInt,
                color: colors.PrimaryColor,
              },
            ]}
          />

          <HomeCustomeButton
            onpress={() => Clickable('Discount')}
            title={t("Discount")}
            style={[
              styles.ViewStyle,
              {
                backgroundColor: 'white',
                borderColor: colors.PrimaryColor,
                borderWidth: 1,
              },
            ]}
            txtStyle={[
              styles.textStyle,
              {
                color: colors.PrimaryColor,
              },
            ]}
          />

          {/* <HomeCustomeButton
            onpress={() => Clickable('Tax')}
            title="Tax"
            style={[
              styles.ViewStyle,
              {
                backgroundColor: colors.TaxColor,
              },
            ]}
            txtStyle={[
              styles.textStyle,
              {
                color: colors.light,
              },
            ]}
          /> */}

          <HomeCustomeButton
            LoaderValue={DraftLoader}
            onpress={async () => {
              setDraftLoader(true);
              if (props?.Cart?.cart.length > 0) {
                removediscountcoupon();
                if (props?.Shared?.Internet) {
                  await props?.DraftAPI();
                  setDraftLoader(false);
                } else {
                  await props?.AddDraftToOffDrafts(tax, discount);
                  setDraftLoader(false);
                }
              } else {
                alert('Add Some Items in Cart');
                setDraftLoader(false);
              }
            }}
            Icon={Draft}
            IconWidth={widthPercentageToDP('3%')}
            IconHeight={heightPercentageToDP('3%')}
            style={{
              paddingHorizontal: widthPercentageToDP('1.1%'),
              paddingVertical: widthPercentageToDP('0.6%'),
              backgroundColor: colors.DraftColor,
              borderRadius: 2,
            }}
          />
        </View>

        <View
          style={{
            borderColor: '#BFBFBF',
            borderWidth: 1,
            borderStyle: 'dotted',
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: widthPercentageToDP('0.2%'),
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              color: colors.PrimaryColor,
              fontSize: heightPercentageToDP('3.2%'),
            }}>
            {t('Total')}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Bold',
              color: colors.PrimaryColor,
              fontSize: heightPercentageToDP('3.2%'),
            }}>
            {NumberFormat(Total).replace(/\./g, ',')} TND
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <HomeCustomeButton
            LoaderValue={props?.Shared?.loader}
            onpress={async () => {
              if (props?.Table?.currentTable.length > 0) {
                ToastAndroid.showWithGravityAndOffset(
                  'You cannot CheckOut because Dinning is selected',
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
              } else {
                setCheckOutLoader(true);
                if (props?.main) {
                  if (props?.Cart?.cart.length > 0) {
                    await props.navigation.navigate('CheckOut', {
                      tax: tax,
                      discount: discount,
                      total: Total,
                      discointtype: discounttype,
                      discountorginal: discountOrginalValue,
                      firstadd: firstadd
                    });
                  } else {
                    ToastAndroid.showWithGravityAndOffset(
                      'Add Item in Cart',
                      ToastAndroid.LONG,
                      ToastAndroid.BOTTOM,
                      25,
                      50,
                    );
                  }
                } else {
                  if (
                    parseFloat(NumberFormat(props?.Cart?.customerpay)) <
                    parseFloat(NumberFormat(Total)) ||
                    props?.Cart?.customerpay == '' || isNaN(props?.Cart?.customerpay)
                  ) {
                    ToastAndroid.showWithGravityAndOffset(
                      'Amount Must be Greater than Total amount',
                      ToastAndroid.LONG,
                      ToastAndroid.BOTTOM,
                      25,
                      50,
                    );
                  } else {
                    await props?.payamount(discount, tax, couponamountstate, props?.navigation);
                  }
                }
              }
            }}
            title={props?.main ? t('Check Out') : t('Complete')}
            style={{
              padding: widthPercentageToDP('1%'),
              borderRadius: 2,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.SuccessColor,
              width: widthPercentageToDP('28%'),
              marginLeft: widthPercentageToDP('0.5%'),
            }}
            txtStyle={{
              fontFamily: 'Poppins-Bold',
              color: colors.light,
              fontSize: heightPercentageToDP('3%'),
            }}
            loader={props?.Shared?.loader}
          />
        </View>
      </View>

      <ModifiersModal
        modalVisible={modiefiersModal}
        onModalClose={() => {
          setModifierModal(false);
        }}
        style={[
          {
            backgroundColor: '#fff',
            borderRadius: 2,
            width: widthPercentageToDP('30%'),
            height: heightPercentageToDP('60%'),
          },
        ]}
        value={modifiers}
        item={item}
      />

      <CustomModal
        title={t("Apply Coupon")}
        PlaceholderTitle={t("Enter Coupon Code")}
        modalVisible={CouponModal}
        onModalClose={() => {
          setCouponModal(false);
        }}
        style={[
          styles.CustomeAlertView,
          {
            width: widthPercentageToDP('30%'),
            height: heightPercentageToDP('32%'),
          },
        ]}
        setValue={(value, type) => {
          props?.VerifyCoupons(value, Total);
        }}
      />

      <CustomModal
        keyboarType="number-pad"
        type={t("Select Discount Type")}
        title={t("Apply Discount")}
        PlaceholderTitle={t("Enter Discount")}
        modalVisible={DiscountModal}
        onModalClose={() => {
          setDiscountModal(false);
        }}
        style={[
          styles.CustomeAlertView,
          {
            width: widthPercentageToDP('30%'),
            height: heightPercentageToDP('42%'),
          },
        ]}
        setValue={(value, type) => {
          if (props?.Cart?.coupontype == '%') {
            // var couponamount = (props?.Cart?.coupons / 100) * (parseFloat(CulculateSubTotal()) + parseFloat(tax));
            var couponamount = (props?.Cart?.coupons / 100) * (parseFloat(CulculateSubTotal()))
          } else {
            var couponamount = props?.Cart?.coupons;
          }
          setcouponamountstate(couponamount)
          var Orginaltotal = parseFloat(CulculateSubTotal()) - couponamount;
          if (parseInt(value) == 0 || value == '' || value == null) {
            setTotal(NumberFormat(Orginaltotal));
            props?.ChangeTotal(parseFloat(NumberFormat(Orginaltotal)) + parseFloat(tax));
            setdiscount(0);
          } else {
            if (type) {
              if (NumberFormat(Orginaltotal - parseFloat(value)) < 0) {
                ToastAndroid.showWithGravityAndOffset(
                  `'Unable to apply discount`,
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
              } else {
                if (parseFloat(Orginaltotal) - parseFloat(value) < 0) {
                  ToastAndroid.showWithGravityAndOffset(
                    `'Unable to apply discount`,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50,
                  );
                } else {
                  if (props?.Cart?.coupontype == '') {
                    setfirstadd('discount')
                  }
                  setdiscountOrginalValue(value)
                  setdiscounttype('$')
                  setdiscount(value);
                  setTotal(NumberFormat((Orginaltotal - parseFloat(value)) + parseFloat(tax)));
                  props?.ChangeTotal(
                    NumberFormat((Orginaltotal - parseFloat(value)) + parseFloat(tax)),
                  );
                }
              }
            } else {

              let percentage = (parseFloat(value) / 100) * Orginaltotal;
              if (NumberFormat(Orginaltotal - percentage) < 0) {
                ToastAndroid.showWithGravityAndOffset(
                  `'Unable to apply discount`,
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
              } else {
                if (props?.Cart?.coupontype == '') {
                  setfirstadd('discount')
                }
                setdiscount(NumberFormat(percentage));
                setdiscountOrginalValue(value)
                setdiscounttype('%')
                setTotal(NumberFormat((Orginaltotal - parseFloat(percentage)) + parseFloat(tax)));
                props?.ChangeTotal(
                  NumberFormat((Orginaltotal - parseFloat(percentage)) + parseFloat(tax)),
                );
              }
            }
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ViewStyle: {
    width: widthPercentageToDP('11%'),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: heightPercentageToDP('1%'),
    marginVertical: heightPercentageToDP('1%'),
    borderRadius: 2,
  },
  textStyle: {
    fontSize: heightPercentageToDP('2%'),
    fontFamily: 'Poppins-Medium',
  },
  CustomeAlertView: {
    backgroundColor: '#fff',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  RightTextStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: heightPercentageToDP('1.8%'),
  },
  MainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
const mapStateToProps = ({ Cart, Shared, Table }) => ({
  Cart,
  Shared,
  Table,
});

export default connect(mapStateToProps, {
  DeleteAllCart,
  IncreaseAndMinusQuantity,
  DeleteItemFromCart,
  ChangeTotal,
  payamount,
  AddDraftToOffDrafts,
  DraftAPI,
  VerifyCoupons,
  zeroCoupon,
})(CartItemsCompnentRight);
