import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Container from '../../../Component/SharedComponent/Container';
import CustomButton from '../../../Component/Button/CustomButton';
import Cross from '../../../Assets/Images/cross.svg';
import HomeCustomeButton from '../../Home/Components/HomeCustomeButton';
import { VerifyCeshiers } from '../../../Store/Actions/UserAction';
import store from '../../../Store';

const number = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function PinScreen(props) {
  const { colors } = useTheme();
  const [pin, setpin] = useState('');
  return (
    <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
      <AntDesign
        onPress={() => props.navigation.goBack()}
        name="left"
        color={'white'}
        size={24}
        style={{
          backgroundColor: 'rgba(81, 154, 215, 0.4)',
          borderRadius: 50,
          position: 'absolute',
          left: wp('5%'),
          top: hp('5%'),
          padding: wp('1%'),
        }}
      />

      <View style={[styles.InnerContainer]}>
        <Text
          style={{
            textAlign: 'center',
            color: colors.PrimaryColor,
            fontSize: hp('3.5'),
            fontFamily: 'Poppins-Bold',
          }}>
          Pin Code
        </Text>
        <TextInput
          editable={false}
          maxLength={4}
          value={pin}
          style={{
            backgroundColor: 'rgba(128,173,199,0.2)',
            width: wp('8%') * 3,
            height: wp('4%'),
            borderRadius: 2,
            alignSelf: 'center',
            marginTop: hp('1.8%'),
            fontSize: hp('3%'),
            textAlign: 'center',
            letterSpacing: 40,
            color: colors.PrimaryColor,
            borderColor: colors.PrimaryColor,
            borderWidth: 1,
          }}
        />
        <View style={{ alignItems: 'center', marginTop: hp('2.5%') }}>
          <FlatList
            data={number}
            keyExtractor={(item, index) => index}
            numColumns={3}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (pin.length <= 3) {
                      setpin(pin + item)
                    }
                  }}
                  style={{
                    width: wp('7%'),
                    height: wp('5%'),
                    backgroundColor: colors.light,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    margin: wp('0.3%'),
                    borderColor: colors.PrimaryColor,
                    borderTopRightRadius: index == 1 ? 1 : 0,
                    borderTopLeftRadius: index == 0 ? 1 : 0,
                    borderBottomRightRadius: index == 1 ? 1 : 0,
                    borderBottomLeftRadius: index == 1 ? 1 : 0,
                  }}>
                  <Text
                    style={{
                      fontSize: hp('3%'),
                      color: colors?.PrimaryColor,
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                width: wp('7%'),
                height: wp('5%'),
              }}
            />
            <TouchableOpacity
              onPress={() => {
                if (pin.length <= 3) {
                  setpin(pin + '0')
                }
              }}
              style={{
                width: wp('7%'),
                height: wp('5%'),
                backgroundColor: colors.light,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.PrimaryColor,
                borderBottomLeftRadius: 1,
                borderBottomRightRadius: 1,
              }}>
              <Text
                style={{
                  fontSize: hp('3%'),
                  color: colors?.PrimaryColor,
                }}>
                0
              </Text>
            </TouchableOpacity>

            <HomeCustomeButton
              onpress={() => setpin(pin?.slice(0, -1))}
              Icon={Cross}
              IconWidth={widthPercentageToDP('3%')}
              IconHeight={heightPercentageToDP('3%')}
              style={[
                styles.fixedPercetageView,
                {
                  borderColor: colors.PrimaryColor,
                  padding: widthPercentageToDP('1%'),
                  backgroundColor: 'transparent',
                  margin: widthPercentageToDP('0.5%'),
                },
              ]}
              txtStyle={[
                styles.fixedPercetageText,
                {
                  fontSize: heightPercentageToDP('3%'),
                  color: colors.PrimaryColor,
                },
              ]}
            />
          </View>
        </View>
        <View
          style={{
            width: wp('7%') * 3,
            alignSelf: 'center',
            marginTop: hp('2.5%'),
          }}>
          <CustomButton
            onPress={() => store.dispatch(VerifyCeshiers(props?.route?.params?.pin, pin, props?.route?.params?.isActive, props?.navigation))}
            title="ENTER"
          />
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  InnerContainer: {
    padding: wp('2.5%'),
    backgroundColor: '#fff',
    elevation: 20,
    borderRadius: 2,
    width: wp('35%'), // 80% of width device screen,
    paddingVertical: hp('3%'),
  },
  checkBoxText: {
    color: '#8A99A6',
    fontSize: hp('1.6%'),
  },
  LoginBtn: {
    backgroundColor: '#3674D9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('2%'),
    marginVertical: hp('1%'),
    borderRadius: 2,
  },
  btnText: {
    color: 'white',
    fontSize: hp('2.4%'),
  },
  forgetText: {
    color: '#6572C7',
    fontSize: hp('2%'),
    textAlign: 'center',
    marginVertical: hp('1%'),
  },
  fixedPercetageView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: widthPercentageToDP('6%'),
    flexDirection: 'row',
  },
  fixedPercetageText: {
    fontFamily: 'Poppins-Medium',
  },
});