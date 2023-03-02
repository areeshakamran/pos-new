import { View, Text } from 'react-native'
import React from 'react'

export default function Container(props) {
    return (
        <View style={[{ flex: 1 }, props?.style]}>
            {props?.children}
        </View>
    )
}