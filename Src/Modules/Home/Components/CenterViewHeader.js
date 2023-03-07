import { useTheme } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet, Text, ToastAndroid,
  TouchableOpacity,
  View,
  Image
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
import LocalizationContext from '../../../../LocalizationContext';
import Loader from '../../../Assets/Images/loader.svg';
import Search from '../../../Assets/Images/search.svg';
import Table from '../../../Assets/Images/table.svg';
import CustomInput from '../../../Component/CustomInput';
import store from '../../../Store';
import { Refreshftn, SearchProduct } from '../../../Store/Actions/HomeAction';
import HomeCustomeButton from './HomeCustomeButton';
import SwitchLanguageDropDown from '../../../Component/SwitchLanguageDropDown';


function CenterViewHeader(props) {
  const [barcode, setBarcode] = React.useState(false);
  const { colors } = useTheme();
  const [search, setsearch] = useState('');

  const [printers, setPrinters] = useState([]);
  const [currentPrinter, setCurrentPrinter] = useState();
  const { t } = useContext(LocalizationContext);
  const [showsetting, setshowsetting] = useState(false)

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
    setshowsetting(false)
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
      <View style={{
        width: widthPercentageToDP('10')
      }}>
        <TouchableOpacity
          onPress={() => setshowsetting(!showsetting)}
          style={{
            width: widthPercentageToDP('10'),
            height: heightPercentageToDP('8'),
            backgroundColor: 'white',
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            borderBottomRightRadius: showsetting ? 0 : 8,
            borderBottomLeftRadius: showsetting ? 0 : 8,
            justifyContent: "center",
            alignItems: "center",
            elevation: 1,
            flexDirection: "row"
          }}>
          <AntDesign style={{ marginRight: widthPercentageToDP('0.3') }} name='setting' color={colors.PrimaryColor} />
          <Text
            style={{
              fontSize: heightPercentageToDP('2.7'),
              color: colors.PrimaryColor,
            }}
          >{t('Setting')}</Text>


        </TouchableOpacity>
        {showsetting && (
          <View style={{
            position: "absolute",
            zIndex: 99999,
            width: widthPercentageToDP('10'),
            backgroundColor: 'white',
            top: heightPercentageToDP('8'),
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
            // elevation: 1

          }}>
            <View style={{ backgroundColor: "#fff" }}>
              <TouchableOpacity
                onPress={() => props?.navigation.navigate('userList')}
                style={[
                  styles.IconView,
                  {
                    backgroundColor: "#fff",
                    alignItems: "center"
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
                    alignItems: "center"
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
                    alignItems: "center"
                  },
                ]}>
                {printers.length > 0 ? (
                  <MaterialCommunityIcons
                    onPress={() => {
                      connectPrinter(printers)
                      setshowsetting(false)
                    }}
                    name="printer"
                    size={widthPercentageToDP('1.5%')}
                    color={colors.PrimaryColor}
                  />
                ) : (
                  <MaterialCommunityIcons
                    onPress={() =>{ connectPrinter(printers)
                      setshowsetting(false)
                    }}
                    name="printer-off-outline"
                    size={widthPercentageToDP('1.5%')}
                    color={colors.PrimaryColor}
                  />
                )}
              </View>

              <HomeCustomeButton
                onpress={() => {
                  props?.Refreshftn() 
                  setshowsetting(false)
                
                }}
                Icon={Loader}
                IconWidth={widthPercentageToDP('3%')}
                IconHeight={heightPercentageToDP('3%')}
                style={[
                  styles.IconView,
                  {
                    backgroundColor: colors.PrimaryColor,
                    alignItems: "center"
                  },
                ]}
              />
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
                    alignItems: "center"
                  },
                ]}
              />
              <View style={{
                marginTop: heightPercentageToDP('0.5')
              }}>
                <SwitchLanguageDropDown />
              </View>
              <TouchableOpacity
                onPress={() => props?.navigation.navigate('EditLanguage')}
                style={[
                  styles.IconView,
                  {
                    backgroundColor: "#fff",
                    
                    flexDirection: "row",
                   paddingHorizontal:widthPercentageToDP('1.5')
                  },
                ]}>
                <Image
                  resizeMode='stretch'
                  style={{
                    width: widthPercentageToDP('2.2'),
                    height: heightPercentageToDP('4.5'),
                    marginRight:10
                  }}
                  source={require('../../../Assets/fr.png')} />
                  <Text style={{
                    fontSize:heightPercentageToDP('2'),
                    alignSelf:"center"
                    // marginLeft:heightPercentageToDP('2')
                  }}>Edit</Text>
              </TouchableOpacity>

            </View>
          </View>

        )}

      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  IconView: {
    paddingHorizontal: widthPercentageToDP('0.5%'),
    paddingVertical: widthPercentageToDP('0.7%'),
    borderRadius: 2,
    elevation: 1,
  },
});

const mapStateToProps = ({ Shared, Table }) => ({
  Shared,
  Table,
});

export default connect(mapStateToProps, {
  Refreshftn,
})(CenterViewHeader);
