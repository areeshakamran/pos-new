import { useTheme } from '@react-navigation/native'
import React, { useState } from 'react'
import { ScrollView, Text, View, TextInput } from 'react-native'
import {
    heightPercentageToDP as hp, widthPercentageToDP
} from 'react-native-responsive-screen'
import LocalizationContext from '../../../LocalizationContext'
import CustomHeader from '../../Component/CustomeHeader'
import fn from '../../i18n/fn.json'
import CustomButton from '../../Component/Button/CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditLanguage(props) {
    const { t, setLocale } = React.useContext(LocalizationContext);
    const { colors } = useTheme();
    const [data, setdata] = useState({ ...fn })
    const saveToken = async () => {
        for (let i = 0; i < Object.keys(data).length; i++) {
            let index = Object.keys(data)[i]
            fn[index] = data[index]
        }
        await AsyncStorage.setItem(
            'Updatelanguage',
            JSON.stringify(data),
        );
        setLocale('en')
       
        props?.navigation.goBack()

    }
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <CustomHeader title={t('Language')} navigation={props.navigation} />
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    padding: "4%"
                }}
            >
                {Object.keys(data).map((obj, index) => {
                    return (
                        <View
                            key={index}
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginBottom: hp('4')
                            }}>
                            <View style={{
                                justifyContent: "center"
                            }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontFamily: "Poppins-Bold",
                                        color: colors.PrimaryColor,
                                        fontSize: hp('3.5%'),
                                        marginBottom: hp('1%'),
                                    }}>
                                    {obj}
                                </Text>
                            </View>
                            <TextInput
                                value={data[obj]}
                                style={{
                                    width: widthPercentageToDP('60'),
                                    borderRadius: 8,
                                    borderColor: colors.PrimaryColor,
                                    borderWidth: 1.5,
                                    paddingLeft: widthPercentageToDP('2'),
                                    fontSize: hp('3'),
                                    paddingVertical: hp('1.5')

                                }}
                                onChangeText={(text) => {
                                    let dataa = { ...data }
                                    dataa[obj] = text
                                    setdata(dataa)
                                }}
                            />
                        </View>
                    )
                })}
                <View style={{ marginTop: hp('3'), alignSelf: "center", width: widthPercentageToDP('50') }} >
                    <CustomButton
                        title={t('Save')}
                        onPress={() => saveToken()}
                    />
                </View>

            </ScrollView>
        </View>
    )
}