import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';


export default function HomeCustomeButton({
  title,
  IconWidth,
  IconHeight,
  style,
  txtStyle,
  Icon,
  onpress,
  onPressIn,
  LoaderValue
}) {
  return (
    <TouchableOpacity
      onPressIn={onPressIn}
      onPress={onpress} style={style} activeOpacity={0.8}>
      {
        LoaderValue ? <ActivityIndicator size={'large'} color={'#00598E'} /> : null
      }
      {
        LoaderValue ? null : Icon ? <Icon width={IconWidth} height={IconHeight} /> : null
      }
      {
        LoaderValue
          ? null :
          title
            ? <Text style={txtStyle}>{title}</Text>
            : null
      }
    </TouchableOpacity>
  );
}
