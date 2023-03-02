import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import { AddtoCart } from '../../../Store/Actions/CartAction'
import store from '../../../Store'
import FastImage from 'react-native-fast-image'
import ModifiersModal from './ModifiersModal'

export default function ProductItemCart(props) {
    const [image, setimage] = useState(
        {
            uri: `https://ecco.royaldonuts.xyz/images/Product/${props?.Item?.image}`,
            priority: FastImage.priority.normal,
        }
    )

    const [modiefiersModal, setModifierModal] = React.useState(false);
    const onPressCheckSup = () => {
        if (props?.Item?.modifiers.length > 0) {
            setModifierModal(true)
        } else {
            store.dispatch(AddtoCart(props?.Item))
        }
    }
    return (
        <TouchableOpacity
            // onPress={() => store.dispatch(AddtoCart(props?.Item))}
            // onLongPress={() => setModifierModal(true)}
            onPress={() => onPressCheckSup()}
            activeOpacity={1}
            style={props.MainView}>
            {props.image ?
                <FastImage
                    style={{
                        width: widthPercentageToDP('8%'),
                        height: heightPercentageToDP("12%"),
                    }}
                    source={image}
                    resizeMode={FastImage.resizeMode.contain}
                    onError={(e) => setimage(require('../../../Assets/logoo.png'))}
                />
                : null
            }
            <Text
                numberOfLines={2}
                style={props.TextStyle}>
                {props.Item.name_fr}
            </Text>
            <Text style={props.Pricestyle}>{`${props.Item.price_euro.toString().replace(/\./g, ',')} TND`}</Text>
            <ModifiersModal
                modalVisible={modiefiersModal}
                onModalClose={() => {
                    setModifierModal(false);
                }}
                style={[
                    {
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        width: widthPercentageToDP('30%'),
                        height: heightPercentageToDP('60%'),
                    },
                ]}
                value={props.Item.modifiers}
                item={props.Item}
                inProduct={true}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})