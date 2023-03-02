import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp
} from 'react-native-responsive-screen';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Octicons from 'react-native-vector-icons/Octicons';
import CustomButton from '../../../Component/Button/CustomButton';
import Container from '../../../Component/SharedComponent/Container';
import TextInputComponent from '../../../Component/TextInputComponent';
import { MasterLoginftn } from '../../../Store/Actions/UserAction';
import store from '../../../Store';

export default function MasterLogin(props) {
  const [userName, setUsername] = useState('komail@gmail.com')
  const [password, setpassword] = useState('123456789')
  const { colors } = useTheme();
  return (
    <Container>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={[styles.InnerContainer]}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: "Poppins-Bold",
              color: colors.PrimaryColor,
              fontSize: hp('3.5%'),
              marginBottom: hp('1%'),
            }}>
            Sign In
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
            title="CONTINUE"
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
