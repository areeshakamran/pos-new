import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import LocalizationContext from '../../LocalizationContext';

export default function SwitchLanguage() {
    const { setLocale, locale } = useContext(LocalizationContext);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(locale);
    const [items, setItems] = useState([]);
    useEffect(() => {
        setValue(locale)
        setItems(
            [{
                label: locale == "en" ? "English" : "Anglais", value: 'en', icon: () => <Image source={require('../Assets/en.png')} style={{
                    width: widthPercentageToDP('2.2'),
                    height: widthPercentageToDP('2.2')
                }} />
            },
            {
                label: locale == "fn" ? "French" : "Français", value: 'fn', icon: () => <Image source={require('../Assets/fr.png')} style={{
                    width: widthPercentageToDP('2.2'),
                    height: widthPercentageToDP('2.2')
                }} />
            }]
        )
        return
    }, [locale])
    return (
        <View style={{ width: widthPercentageToDP('12') }}>
            <DropDownPicker
                showArrowIcon={false}
                showTickIcon={false}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                onChangeValue={(value) => {
                    console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDDDD", value)
                    setValue(value)
                    setLocale(value)
                    try {
                        AsyncStorage.setItem('language', JSON.stringify(value));
                    } catch (error) {
                        console.log(error)

                    }
                }}
                setItems={setItems}
                textStyle={{
                    fontSize: heightPercentageToDP('2.5%')
                }}
                style={{
                    borderColor: "#00598E",
                    elevation: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: heightPercentageToDP('10'),

                }}
                dropDownContainerStyle={{
                    borderColor: "#00598E",
                }}
            />
        </View>
    )
}