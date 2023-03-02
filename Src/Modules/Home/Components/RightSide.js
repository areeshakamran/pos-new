import { View } from 'react-native';
import React from 'react';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import CartItemsHeader from '../../../Component/CartItemsHeader';
import CartItemsCompnentRight from './CartItemsComponentRight';

export default function RightSide(props) {
  return (
    <View style={{ flex: 1, padding: widthPercentageToDP('1%') }}>
      <CartItemsHeader navigation={props.navigation} />
      <CartItemsCompnentRight
        tax={0}
        discount={0}
        coupon={0}
        navigation={props.navigation}
        main={true}
        discountorginal={0}
        discointtype={''}
        firstadd=''
      />
    </View>
  );
}
