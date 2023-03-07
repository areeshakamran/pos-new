import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import HomeCustomeButton from '../Modules/Home/Components/HomeCustomeButton';
import Draft from '../Assets/Images/draft.svg';
import Sale from '../Assets/Images/sales.svg';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { useTheme } from '@react-navigation/native';
import LocalizationContext from '../../LocalizationContext';

export default function CartItemsHeader(props) {
  const { colors } = useTheme();
  const { t } = React.useContext(LocalizationContext);
  return (
    <View style={[styles.MainContainer]}>
      <HomeCustomeButton
        onpress={() => props.navigation.navigate('Draft')}
        title={t('Draft')}
        Icon={Draft}
        IconWidth={widthPercentageToDP('3%')}
        IconHeight={heightPercentageToDP('4%')}
        style={[
          styles.ViewStyle,
          {
            backgroundColor: colors.PrimaryColor,
          },
        ]}
        txtStyle={[
          styles.textStyle,
          {
            color: colors.light,
          },
        ]}
      />
      <HomeCustomeButton
        onpress={() => props.navigation.navigate('Sales')}
        title={t('Sales')}
        Icon={Sale}
        IconWidth={widthPercentageToDP('3%')}
        IconHeight={heightPercentageToDP('4%')}
        style={[
          styles.ViewStyle,
          {
            backgroundColor: colors.PrimaryColor,
          },
        ]}
        txtStyle={[
          styles.textStyle,
          {
            color: colors.light,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flexDirection: 'row',
    borderBottomColor: 'silver',
    borderBottomWidth: 1,
    paddingBottom: heightPercentageToDP('2%'),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: heightPercentageToDP('2%'),
  },
  ViewStyle: {
    padding: widthPercentageToDP('1%'),
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: widthPercentageToDP('13.7%'),
    flexDirection: 'row',
  },
  textStyle: {
    fontSize: heightPercentageToDP('2.6%'),
    fontFamily: 'Poppins-Medium',
    marginHorizontal: widthPercentageToDP('1%'),
  },
});
