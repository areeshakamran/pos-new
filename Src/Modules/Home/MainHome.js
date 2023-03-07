import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import CustomModal from '../../Component/CustomModal';
import CenterView from './Components/CenterView';
import LeftSide from './Components/LeftSide';
import RightSide from './Components/RightSide';
import LocalizationContext from '../../../LocalizationContext';

export default function MainHome(props) {
  const [OpenCashModal, setOpenCashModal] = React.useState(true);
  const { t } = React.useContext(LocalizationContext);
  const { colors } = useTheme();
  return (
    <View style={{
      width: widthPercentageToDP('100%'),
      height: Dimensions.get('screen').height
    }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View
          style={[
            styles.Viewsss,
            {
              width: widthPercentageToDP('15%'),
              backgroundColor: colors.light,
            },
          ]}>
          <LeftSide />
        </View>
        <View
          style={[
            {
              width: widthPercentageToDP('55%'),
              backgroundColor: colors.grayLightColor,
            },
          ]}>
          <CenterView navigation={props.navigation} />
        </View>
        <View
          style={[
            styles.Viewsss,
            {
              width: widthPercentageToDP('30%'),
              backgroundColor: colors.light,
            },
          ]}>
          <RightSide navigation={props.navigation} />
        </View>
      </View>

      <CustomModal
        title={t("Open Cash Adjustment")}
        PlaceholderTitle={t("Balance")}
        modalVisible={OpenCashModal}
        onModalClose={() => {
          setOpenCashModal(false);
        }}
        style={[
          styles.CustomeAlertView,
          {
            width: widthPercentageToDP('30%'),
            height: heightPercentageToDP('30%'),
          },
        ]}
      />
    </View>

  );
}

const styles = StyleSheet.create({
  Viewsss: {
    elevation: 15,
  },
  CustomeAlertView: {
    backgroundColor: '#fff',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

});
