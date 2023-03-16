import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function CustomButton({ onPress, title }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: colors.PrimaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp('2%'),
        marginVertical: hp('1%'),
        borderRadius: 6,
        marginVertical: hp('2%'),
        shadowColor: colors.PrimaryColor,
        shadowOffset: {
          width: 0,
          height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        
        elevation: 100,
      }}>
      <Text
        style={{
          color: colors.light,
          fontSize: hp('2.4%'),
          fontFamily: 'Poppins-SemiBold',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
