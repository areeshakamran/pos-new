import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP
} from 'react-native-responsive-screen';
import CustomHeader from '../../Component/CustomeHeader';
import store from '../../Store';
import { ReadAllSales } from '../../Store/Actions/SaleAction';
import SalesRight from './Components/SalesRight';

export default function Sales(props) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Sales" navigation={props.navigation} onPressOut={() => store.dispatch(ReadAllSales())} />

      <View style={{ flexDirection: 'row', flex: 1 }}>
        {/* <View
          style={[
            styles.Viewsss,
            {
              width: widthPercentageToDP('30%'),
              backgroundColor: colors.light,
            },
          ]}>
          <SalesLeft navigation={props.navigation} />
        </View> */}
        <View
          style={[
            {
              width: widthPercentageToDP('100%'),
              backgroundColor: colors.grayLightColor,
            },
          ]}>
          <SalesRight navigation={props.navigation} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Viewsss: {
    elevation: 5,
  },
  DataTableHeaderTextView: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: heightPercentageToDP('2.2%'),
  },
  DateCellTextView: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: heightPercentageToDP('2.2%'),
  },
});
