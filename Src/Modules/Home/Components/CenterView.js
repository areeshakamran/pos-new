import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import {
  heightPercentageToDP,
  widthPercentageToDP
} from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import LocalizationContext from '../../../../LocalizationContext';
import BlueGridView from '../../../Assets/Images/blueGridView.svg';
import BlueListView from '../../../Assets/Images/BlueListView.svg';
import FillStar from '../../../Assets/Images/fill-star.svg';
import UnFillStar from '../../../Assets/Images/unfill-star.svg';
import WhiteGridView from '../../../Assets/Images/whiteGridView.svg';
import WhiteListView from '../../../Assets/Images/whiteListView.svg';
import { FeatureProduct, getMoreProduct } from '../../../Store/Actions/HomeAction';
import CenterViewHeader from './CenterViewHeader';
import HomeCustomeButton from './HomeCustomeButton';
import ProductItemCart from './ProductItemCart';
import SwitchLanguage from '../../../Component/SwitchLanguage';

function CenterView(props) {
  const [list, setList] = React.useState(false);
  const { colors } = useTheme();
  const { t, locale, setLocale } = React.useContext(LocalizationContext);

  const ClickAble = str => {
    if (str == 'Star') {
      props?.FeatureProduct()
    } else if (str == 'ListView') {
      setList(!list);
    }
  };

  const reachend = () => {
    props?.getMoreProduct()
  }

  return (
    <View style={{ flex: 1, padding: widthPercentageToDP('1%') }}>
      <CenterViewHeader navigation={props.navigation} />
      <View
        style={{
          marginTop: heightPercentageToDP('5%'),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              fontFamily: 'Poppins-SemiBold',
              fontSize: heightPercentageToDP('3%'),
              color: colors.PrimaryColor,
            }}>
            {t('Products')}
          </Text>

          <HomeCustomeButton
            onpress={() => ClickAble('Star')}
            Icon={props?.Home?.featureStatus ? FillStar : UnFillStar}
            IconWidth={widthPercentageToDP('3%')}
            IconHeight={heightPercentageToDP('3%')}
            style={[
              styles.IconView,
              {
                backgroundColor: props?.Home?.featureStatus ? colors.light : colors.PrimaryColor,
                marginHorizontal: widthPercentageToDP('1%'),
              },
            ]}
          />
        </View>
       <View style={{flexDirection:'row'}}>
        <SwitchLanguage />
        <View style={{ flexDirection: 'row' , height:"50%" ,alignItems:"center" , marginLeft:12 ,marginTop:"5%" }}>
      
          {/* <View style={{
            flexDirection: "row",
            marginRight: widthPercentageToDP('1'),
            justifyContent:"center"
          }}>
            <Text
              onPress={async () => {
                setLocale('en')
                await AsyncStorage.setItem(
                  'language',
                  JSON.stringify('en'),
                );
              }}
              style={{
                textAlign: 'center',
                fontFamily: "Poppins-Bold",
                color: locale == 'en' ? colors.PrimaryColor : '#85C9E9',
                fontSize: heightPercentageToDP('2.5%'),
                marginRight: widthPercentageToDP('1')

              }}>
              {t('English')}
            </Text>
            <TouchableOpacity
              onPress={async () => {
                setLocale('fn')
                await AsyncStorage.setItem(
                  'language',
                  JSON.stringify('fn'),
                );
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontFamily: "Poppins-Bold",
                  color: locale == 'fn' ? colors.PrimaryColor : "#0094B7",
                  fontSize: heightPercentageToDP('2.5%'),

                }}>
                {t("French")}
              </Text>

            </TouchableOpacity>


          </View> */}
          <HomeCustomeButton
            onpress={() => ClickAble('ListView')}
            Icon={list ? BlueGridView : WhiteGridView}
            IconWidth={widthPercentageToDP('3%')}
            IconHeight={heightPercentageToDP('3%')}
            style={[
              styles.IconView,
              {
                backgroundColor: list ? colors.light : colors.PrimaryColor,
                
              },
            ]}
          />

          <HomeCustomeButton
            onpress={() => ClickAble('ListView')}
            Icon={list ? WhiteListView : BlueListView}
            IconWidth={widthPercentageToDP('3%')}
            IconHeight={heightPercentageToDP('3%')}
            style={[
              styles.IconView,
              {
                backgroundColor: list ? colors.PrimaryColor : colors.light,
                marginHorizontal: widthPercentageToDP('1%'),
              },
            ]}
          />
        </View>
        </View>
      </View>

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: heightPercentageToDP('3%'),
          paddingBottom: heightPercentageToDP('15%'),
        }}>
        {list ? (
          <FlatList
            data={props?.Home?.Product}
            numColumns={5}
            columnWrapperStyle={{ justifyContent: "flex-start", width: widthPercentageToDP('55%') }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => {
              return (
                <ProductItemCart
                  key={index}
                  Item={item}
                  image={false}
                  MainView={[
                    styles.MainCartView,
                    {
                      width: widthPercentageToDP('10.2%'),
                      height: heightPercentageToDP('15%'),
                    },
                  ]}
                  TextStyle={[
                    styles.TextStyle,
                    {
                      color: colors.PrimaryColor,
                    },
                  ]}
                  Pricestyle={[
                    styles.priceStye,
                    {
                      color: colors.PrimaryColor,
                    },
                  ]}
                />
              );
            }}
            onEndReached={() => reachend()}
            onEndReachedThreshold={0.01}
            scrollEventThrottle={150}
            ListFooterComponent={() => {
              return (
                <View style={{
                  height: heightPercentageToDP('10%'),
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {props?.Home?.NextPage ? (
                    <ActivityIndicator color={colors.PrimaryColor} size={'small'} />

                  ) :
                    <Text style={{ color: 'silver', fontSize: heightPercentageToDP('1.5%') }}>No more Product to show</Text>
                  }
                </View>
              )
            }}
          />
        ) : (
          <FlatList
            key={'_'}
            data={props?.Home?.Product}
            numColumns={4}
            initialNumToRender={20}
            columnWrapperStyle={{ justifyContent: "flex-start", width: widthPercentageToDP('55%') }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => '_' + index}
            renderItem={({ item, index }) => {
              return (
                <ProductItemCart
                  key={index}
                  Item={item}
                  image={true}
                  MainView={[
                    styles.MainCartView,
                    {
                      width: widthPercentageToDP('12.8%'),
                      height: heightPercentageToDP('25%'),
                    },
                  ]}
                  TextStyle={[
                    styles.TextStyle,
                    {
                      color: colors.PrimaryColor,
                    },
                  ]}
                  Pricestyle={[
                    styles.priceStye,
                    {
                      color: colors.PrimaryColor,
                    },
                  ]}
                />
              );
            }}
            onEndReached={() => reachend()}
            onEndReachedThreshold={0.01}
            scrollEventThrottle={150}
            ListFooterComponent={() => {
              return (
                <View style={{
                  height: heightPercentageToDP('10%'),
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  {props?.Home?.NextPage ? (
                    <ActivityIndicator color={colors.PrimaryColor} size={'small'} />
                  ) :
                    <Text style={{ color: 'silver', fontSize: heightPercentageToDP('1.5%') }}>No more Product to show</Text>
                  }
                </View>
              )
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  IconView: {
    paddingHorizontal: widthPercentageToDP('0.4%'),
    paddingVertical: widthPercentageToDP('0.5%'),
    borderRadius: 2,
    elevation: 10,
  },
  MainCartView: {
    margin: widthPercentageToDP('0.2%'),
    backgroundColor: 'white',
    borderRadius: 2,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TextStyle: {
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    fontSize: heightPercentageToDP('2.2%'),
    marginVertical: heightPercentageToDP('0.5%'),
    height: heightPercentageToDP('6%'),
    width: widthPercentageToDP('8%')
  },
  priceStye: {
    fontFamily: 'Poppins-Regular',
    fontSize: heightPercentageToDP('2%'),
    fontStyle: 'italic'
  },
});

const mapStateToProps = ({ Home }) => ({
  Home
});

export default connect(mapStateToProps, {
  getMoreProduct,
  FeatureProduct
})(CenterView);
