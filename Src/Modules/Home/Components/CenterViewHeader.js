import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState, useContext } from 'react';
import {
  Platform,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP
} from 'react-native-responsive-screen';
import { USBPrinter } from 'react-native-thermal-receipt-printer-image-qr';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import Loader from '../../../Assets/Images/loader.svg';
import Search from '../../../Assets/Images/search.svg';
import Table from '../../../Assets/Images/table.svg';
import CustomInput from '../../../Component/CustomInput';
import store from '../../../Store';
import { Refreshftn, SearchProduct } from '../../../Store/Actions/HomeAction';
import HomeCustomeButton from './HomeCustomeButton';
import { StackActions } from '@react-navigation/native';
import LocalizationContext from '../../../../LocalizationContext';


function CenterViewHeader(props) {
  const popAction = StackActions.pop(1);
  const [barcode, setBarcode] = React.useState(false);
  const { colors } = useTheme();
  const [search, setsearch] = useState('');

  const [printers, setPrinters] = useState([]);
  const [currentPrinter, setCurrentPrinter] = useState();
  const { t } = useContext(LocalizationContext);

  const connectPrinter = async (printer) => {
    if (printer.length > 0) {
      await USBPrinter.connectPrinter(printer[0].vendor_id, printer[0].product_id)
        .then(res => {
          setCurrentPrinter(printer[0]);
          ToastAndroid.showWithGravityAndOffset(
            `Printer Connected: ${JSON.stringify(res)}`,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        })
        .catch(e => {
          ToastAndroid.showWithGravityAndOffset(
            e,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          )
        });
    } else {
      InitilizePrinter()
    }
  };

  // const InitilizePrinter = async () => {
  //   if (Platform.OS == 'android') {
  //     await USBPrinter.init().then(async () => {
  //       await USBPrinter.getDeviceList()
  //         .then(setPrinters)
  //         .catch(e => console.log('Printer Not Found!', e));
  //     }).catch(e => console.log('Printer init Not Found!', e));
  //   }
  //   connectPrinter(printers);
  // };

  const InitilizePrinter = async () => {
    if (Platform.OS == 'android') {
      await USBPrinter.init().then(async () => {
        await USBPrinter.getDeviceList()
          .then((res) => {
            setPrinters(res)
          })
          .catch(e => {
            ToastAndroid.showWithGravityAndOffset(
              e,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            )
          });
      }).catch(e => {
        ToastAndroid.showWithGravityAndOffset(
          e,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        )
      });
    }
    // connectPrinter(printers);
  };

  useEffect(() => {
    InitilizePrinter()
  }, []);

  const ClickAble = str => {
    if (str == 'barCode') {
      setBarcode(!barcode);
    } else if (str == 'table') {
      props.navigation.navigate('Table');
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <CustomInput
        placeholder={t('Search Products')}
        placeholderTextColor={colors.PrimaryColor}
        style={{
          height: heightPercentageToDP('5%'),
          padding: widthPercentageToDP('0.5%'),
          fontSize: heightPercentageToDP('2%'),
          color: colors.PrimaryColor,
          width: widthPercentageToDP('22%'),
          borderRadius: 2,
          fontFamily: 'Poppins-Regular',
        }}
        ViewStyle={{
          backgroundColor: 'white',
          elevation: 5,
          width: widthPercentageToDP('25%'),
          borderRadius: 2,
        }}
        onChangeText={text => setsearch(text)}
        Search={Search}
        IconWidth={widthPercentageToDP('3%')}
        IconHeight={heightPercentageToDP('3%')}
        onSubmitEditing={() => {
          store.dispatch(SearchProduct(search));
        }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
       
        <TouchableOpacity
          // onPress={()=> props?.navigation.dispatch(popAction)}
          onPress={() => props?.navigation.navigate('userList')}
          style={[
            styles.IconView,
            {
              backgroundColor: colors.light,
              borderColor: colors.PrimaryColor,
              elevation: 10,
              marginRight: widthPercentageToDP('1%'),
              paddingHorizontal: widthPercentageToDP('0.8%'),
            },
          ]}>
          <AntDesign
            name="logout"
            size={widthPercentageToDP('1.5%')}
            color={colors.PrimaryColor}
          />
        </TouchableOpacity>

        <View
          style={[
            styles.IconView,
            {
              backgroundColor: colors.light,
              borderColor: colors.PrimaryColor,
              elevation: 10,
              marginHorizontal: widthPercentageToDP('1%'),
              paddingHorizontal: widthPercentageToDP('0.8%'),
            },
          ]}>
          {props?.Shared?.Internet ? (
            <AntDesign
              name="wifi"
              size={widthPercentageToDP('1.5%')}
              color={colors.PrimaryColor}
            />
          ) : (
            <Feather
              name="wifi-off"
              size={widthPercentageToDP('1.5%')}
              color={colors.PrimaryColor}
            />
          )}
        </View>
        <View
          style={[
            styles.IconView,
            {
              backgroundColor: colors.light,
              borderColor: colors.PrimaryColor,
              elevation: 10,
              // marginRight: widthPercentageToDP('1%'),
              paddingHorizontal: widthPercentageToDP('0.8%'),
            },
          ]}>
          {printers.length > 0 ? (
            <MaterialCommunityIcons
              onPress={() => connectPrinter(printers)}
              name="printer"
              size={widthPercentageToDP('1.5%')}
              color={colors.PrimaryColor}
            />
          ) : (
            <MaterialCommunityIcons
              onPress={() => connectPrinter(printers)}
              name="printer-off-outline"
              size={widthPercentageToDP('1.5%')}
              color={colors.PrimaryColor}
            />
          )}
        </View>

        <HomeCustomeButton
          onpress={() => props?.Refreshftn()}
          Icon={Loader}
          IconWidth={widthPercentageToDP('3%')}
          IconHeight={heightPercentageToDP('3%')}
          style={[
            styles.IconView,
            {
              backgroundColor: colors.PrimaryColor,
              marginHorizontal: widthPercentageToDP('1%'),
            },
          ]}
        />

        {/* <HomeCustomeButton
          onpress={() => ClickAble('barCode')}
          Icon={Barcode}
          IconWidth={widthPercentageToDP('3%')}
          IconHeight={heightPercentageToDP('3%')}
          style={[
            styles.IconView,
            {
              backgroundColor: colors.light,
              borderColor: colors.PrimaryColor,
              borderWidth: barcode ? 2 : 0,
              marginHorizontal: widthPercentageToDP('1%'),
            },
          ]}
        /> */}

        <HomeCustomeButton
          onpress={() => {
            ClickAble('table');
          }}
          Icon={Table}
          IconWidth={widthPercentageToDP('3%')}
          IconHeight={heightPercentageToDP('3%')}
          style={[
            styles.IconView,
            {
              backgroundColor: colors.light,
              borderColor: colors.PrimaryColor,
              borderWidth: props.Table.currentTable.length ? 2 : 0,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  IconView: {
    paddingHorizontal: widthPercentageToDP('0.5%'),
    paddingVertical: widthPercentageToDP('0.7%'),
    borderRadius: 2,
    elevation: 10,
  },
});

const mapStateToProps = ({ Shared, Table }) => ({
  Shared,
  Table,
});

export default connect(mapStateToProps, {
  Refreshftn,
})(CenterViewHeader);
