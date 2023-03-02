import { StyleSheet, TextInput, View } from 'react-native';
import React from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';

export default function CustomInput(props) {
  return (
    <View style={props.ViewStyle}>
      <TextInput
        keyboardType={props.keyboarType}
        editable={props.disabled ? false : true}
        value={props.value}
        placeholder={props.placeholder}
        placeholderTextColor={props.placeholderTextColor}
        onSubmitEditing={props?.onSubmitEditing}
        onChangeText={props?.onChangeText}
        style={props.style}
      />
      {props?.Search ? (
        <props.Search
          width={props.IconWidth}
          height={props.IconHeight}
          style={{
            position: 'absolute',
            zIndex: 1,
            right: widthPercentageToDP('0.5%'),
            top: heightPercentageToDP('1%'),
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({});
