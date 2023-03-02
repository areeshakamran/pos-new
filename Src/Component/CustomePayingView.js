import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export default function CustomePayingView(props) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.light,
        elevation: 5,
        paddingHorizontal: widthPercentageToDP('4%'),
        paddingVertical: heightPercentageToDP('1%'),
      }}>
      <Text
        style={[
          styles.viewStyle,
          {
            color: colors.PrimaryColor,
          },
        ]}>
        {props.title}
      </Text>

      <Text
        numberOfLines={1}
        style={[
          styles.txtStyle,
          {
            color: props.color,
          },
        ]}>
        {props.value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  txtStyle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: heightPercentageToDP('2.5%'),
    textAlign: "center",
    width: widthPercentageToDP('7%')
  },
  viewStyle: {
    fontFamily: 'Poppins-Medium',
    fontSize: heightPercentageToDP('2%'),
    textAlign: "center"
  },
});
