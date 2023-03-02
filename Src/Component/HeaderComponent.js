import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'

export default function HeaderComponent(props) {
    return (
        <View style={{
            backgroundColor: "red",
            elevation: 10,
            height: heightPercentageToDP('10%'),
            flexDirection: "row",
            alignItems: "center"
        }}>
            <Text>{props.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({})