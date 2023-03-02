import { StyleSheet, TextInput, View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export default function TextInputComponent({
  placeholderTitle,
  placeholderColor,
  Icon,
  onChangeText,
  value

}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 2,
        borderColor: colors.PrimaryColor,
        paddingLeft: widthPercentageToDP('1.5%'),
        flexDirection: 'row',
        marginTop: heightPercentageToDP('2%'),
      }}>
      {Icon ? (
        <View
          style={{
            justifyContent: 'center',
            marginRight: widthPercentageToDP('0.5%'),
          }}>
          <Icon />
        </View>
      ) : null}
      <TextInput
        placeholder={placeholderTitle}
        placeholderTextColor={placeholderColor}
        onChangeText={onChangeText}
        value={value}
        style={{
          width: '100%',
          color: colors.PrimaryColor,
          fontSize: heightPercentageToDP('2.2%'),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
