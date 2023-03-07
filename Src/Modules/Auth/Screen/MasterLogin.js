import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Octicons from 'react-native-vector-icons/Octicons';
import LocalizationContext from '../../../../LocalizationContext';
import CustomButton from '../../../Component/Button/CustomButton';
import Container from '../../../Component/SharedComponent/Container';
import TextInputComponent from '../../../Component/TextInputComponent';
import store from '../../../Store';
import { MasterLoginftn } from '../../../Store/Actions/UserAction';
import SwitchLanguage from '../../../Component/SwitchLanguage';


export default function MasterLogin(props) {
  const { t, locale } = useContext(LocalizationContext);
  const [userName, setUsername] = useState('komail@gmail.com')
  const [password, setpassword] = useState('123456789')
  const { colors } = useTheme();
  useEffect(()=> {

  }, [locale])
  return (
    <Container>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{
          position: "absolute",
          right: wp('5'),
          top: hp('10'),
          flexDirection: "row",
          zIndex: 9999999999999,
          width:100,
        }}>
          <SwitchLanguage />
        </View>
        <View style={{
          position: "absolute",
          left: wp('5'),
          top: hp('10'),
          flexDirection: "row",
          zIndex: 9999999999999
        }}>
          <Text
            onPress={() => props?.navigation?.navigate('EditLanguage')}
            style={{
              textAlign: 'center',
              fontFamily: "Poppins-Bold",
              color: colors.PrimaryColor,
              fontSize: hp('3.5%'),
              marginRight: wp('2')

            }}>
            {t('Edit Language')}
          </Text>
        </View>
        <View style={[styles.InnerContainer]}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: "Poppins-Bold",
              color: colors.PrimaryColor,
              fontSize: hp('3.5%'),
              marginBottom: hp('1%'),
            }}>
            {t('Sign in')}
          </Text>
          <TextInputComponent
            placeholderTitle="Email"
            value={userName}
            onChangeText={(txt) => setUsername(txt)}
            placeholderColor={colors.PrimaryColor}
            Icon={() => (
              <Fontisto name="email" color={colors.PrimaryColor} size={22} />
            )}
          />
          <TextInputComponent
            placeholderTitle="Password"
            placeholderColor={colors.PrimaryColor}
            value={password}
            onChangeText={(txt) => setpassword(txt)}
            Icon={() => (
              <Octicons name="lock" color={colors.PrimaryColor} size={22} />
            )}
          />
          <CustomButton
            title={t('continue')}
            onPress={() => store.dispatch(MasterLoginftn(userName, password))
            }
          />
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  InnerContainer: {
    paddingVertical: wp('3%'),
    paddingHorizontal: wp('3%'),
    backgroundColor: '#fff',
    elevation: 20,
    borderRadius: 2,
    width: wp('35%'),
  },
});
