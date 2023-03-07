import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Container from '../../../Component/SharedComponent/Container';
import { connect } from 'react-redux';
import { cashier } from '../../../Store/Actions/UserAction';
import LocalizationContext from '../../../../LocalizationContext';
import SwitchLanguage from '../../../Component/SwitchLanguage';

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
function UsersList(props) {
  const { colors } = useTheme();
  const { t } = React.useContext(LocalizationContext);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await props.cashier();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <Container style={{ alignItems: 'center', paddingTop: hp('10%') }}>
      <View style={{
        position: "absolute",
        right: wp('5'),
        top: hp('10'),
        flexDirection: "row",
        zIndex: 9999999999999
      }}>
        <SwitchLanguage />
      </View>
      <Text
        style={{
          color: colors.PrimaryColor,
          fontFamily: 'Poppins-Bold',
          fontSize: hp('4%'),
        }}>
        {t("Choose Your Profile")}
      </Text>

      <FlatList
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={props?.User?.cashiers}
        renderItem={({ item, index }) => {
          return <RenderUser item={item} navigation={props?.navigation} />;
        }}
        ListFooterComponent={() => {
          return <View style={{ height: hp('5%') }} />;
        }}
        keyExtractor={(item, index) => index}
        numColumns={3}
      />
    </Container>
  );
}

function RenderUser({ item, navigation }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation?.navigate('pin', {
          pin: item?.pin,
          isActive: item?.isActive
        })
      }
      activeOpacity={0.97}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.light,
          borderRadius: 2,
          width: wp('10%'),
          height: hp('18%'),
          marginHorizontal: wp('2%'),
          elevation: 2,
          marginTop: hp('5%'),
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: wp('10%'),
            height: hp('12%'),
          }}
          source={require('../../../Assets/Images/profile.png')}
        />
      </View>
      <Text
        style={{
          textAlign: 'center',
          fontSize: hp('2.2%'),
          color: colors.PrimaryColor,
          fontFamily: 'Poppins-Medium',
          marginTop: hp('1.5%'),
          width: wp('8%'),
          alignSelf: 'center',
        }}>
        {item?.name}
      </Text>
    </TouchableOpacity>
  );
}

const mapStateToProps = ({ User }) => ({
  User,
});

export default connect(mapStateToProps, {
  cashier,
})(UsersList);
