import { useTheme } from '@react-navigation/native'
import React from 'react'
import { ScrollView, Text, View, TextInput } from 'react-native'
import {
    heightPercentageToDP as hp, widthPercentageToDP
} from 'react-native-responsive-screen'
import LocalizationContext from '../../../LocalizationContext'
import CustomHeader from '../../Component/CustomeHeader'
import fn from '../../i18n/fn.json'
import CustomButton from '../../Component/Button/CustomButton'

export default function EditLanguage(props) {
    const { t } = React.useContext(LocalizationContext);
    const { colors } = useTheme();
    let data = { ...fn }
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <CustomHeader title={t('Language')} navigation={props.navigation} />
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    padding: "4%"
                }}
            >
                {Object.keys(data).map((obj) => {
                    return (
                        <View style={{
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
                            />
                        </View>
                    )
                })}
                <View style={{ marginTop: hp('3') }} />
                <CustomButton
                    title={t('Save')}
                // onPress={() => store.dispatch(MasterLoginftn(userName, password))
                // }
                />

            </ScrollView>
        </View>
    )
}