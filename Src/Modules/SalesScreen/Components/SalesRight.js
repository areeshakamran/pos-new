import { FlatList, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { useTheme } from '@react-navigation/native';
import CustomInput from '../../../Component/CustomInput';
import Search from '../../../Assets/Images/search.svg';
import { connect } from 'react-redux'
import { GetSaleItems, ReadAllSales, SearchSaleByDate, SearchByOrderNumber } from '../../../Store/Actions/SaleAction'
import moment from 'moment';
import { NumberFormat } from '../../../Confiq/Helper';
import DatePicker from 'react-native-date-picker'

function SalesRight(props) {
  const { colors } = useTheme();
  const [search, setsearch] = React.useState('')
  const [date, setDate] = React.useState('')
  const [open, setOpen] = React.useState(false)

  console.log("Date Format: ", date)

  return (
    <View style={{ flex: 1, backgroundColor: colors.grayLightColor }}>
      <View
        style={{
          marginTop: heightPercentageToDP('1%'),
          marginHorizontal: widthPercentageToDP('2%'),
        }}>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          {/* <CustomInput
            keyboarType='number-pad'
            onChangeText={(text) => setsearch(text)}
            onSubmitEditing={() => {
              store.dispatch(SearchSale(search))
            }}
            placeholder="Search Date"
            placeholderTextColor={colors.PrimaryColor}
            ViewStyle={{
              backgroundColor: 'white',
              elevation: 5,
              width: widthPercentageToDP('25%'),
              borderRadius: 2,
            }}
            style={[
              styles.InoutView,
              {
                color: colors.PrimaryColor,
              },
            ]}
            IconWidth={widthPercentageToDP('3%')}
            IconHeight={heightPercentageToDP('3%')}
            Search={Search}
          /> */}

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity style={{
              backgroundColor: 'white',
              elevation: 5,
              width: widthPercentageToDP('25%'),
              borderRadius: 2,
              padding: widthPercentageToDP('0.5%'),
              alignItems: "center",
              justifyContent: "center"
            }}
              onPress={() => setOpen(true)}>
              <Text style={{
                fontFamily: 'Poppins-SemiBold',
                color: colors.PrimaryColor,
                fontSize: heightPercentageToDP('2%'),
              }}>
                Search Sale by date: {date == null || date == '' ? "" : moment(date).format("MMM Do YY")}
              </Text>
            </TouchableOpacity>

            {
              date == null || date == ''
                ? ""
                : <Text onPress={() => {
                  props?.SearchSaleByDate(''),
                    setDate('')
                  ToastAndroid.showWithGravityAndOffset(
                    'Wait a Little bit to get Sales Data Back',
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50,
                  );
                }}
                  style={{
                    fontSize: heightPercentageToDP('3%'), fontFamily: 'Poppins-Regular',
                    color: colors.deleteColor, marginLeft: widthPercentageToDP('2%')
                  }}>Clear Date</Text>
            }
          </View>
          <CustomInput
            keyboarType='number-pad'
            onChangeText={(text) => setsearch(text)}
            onSubmitEditing={() => {
              props?.SearchByOrderNumber(search)
            }}
            placeholder="Search Sales By Order Number"
            placeholderTextColor={colors.PrimaryColor}
            ViewStyle={{
              backgroundColor: 'white',
              elevation: 5,
              width: widthPercentageToDP('25%'),
              borderRadius: 2,
              alignSelf: "flex-end"
            }}
            style={[
              styles.InoutView,
              {
                color: colors.PrimaryColor,
              },
            ]}
            IconWidth={widthPercentageToDP('3%')}
            IconHeight={heightPercentageToDP('3%')}
            Search={Search}
          />
        </View>

        <View
          style={{
            backgroundColor: 'white',
            elevation: 5,
            borderRadius: 2,
            padding: widthPercentageToDP('1%'),
            marginTop: heightPercentageToDP('2%'),
            marginBottom: heightPercentageToDP('12%')
          }}>
          <FlatList
            data={props?.Sale?.sales}
            keyExtractor={(item, index) => index}
            ListEmptyComponent={
              <Text style={{ color: 'silver', fontSize: heightPercentageToDP('2%') }}>No Sale Found!</Text>
            }
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    props.GetSaleItems(item, props)
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: widthPercentageToDP('1%'),
                    borderBottomColor: colors.grayLightColor,
                    borderBottomWidth: 2,
                  }}>
                  <View>
                    <Text
                      style={{
                        fontFamily: 'Poppins-SemiBold',
                        color: colors.PrimaryColor,
                        fontSize: heightPercentageToDP('2.2%'),
                      }}>
                      {/* #{item?.sale?.order_no ? item?.sale?.order_no : `${item?.sale?.id} Offline`} */}
                      #{item?.sale?.order_no ? item?.sale?.order_no : `${item?.sale?.id}`}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        color: colors.PrimaryColor,
                        fontSize: heightPercentageToDP('2.2%'),
                      }}>
                      {/* {} */}
                      {moment(item?.sale?.Created_At).format("MMM Do YY")}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontFamily: 'Poppins-SemiBold',
                        color: colors.PrimaryColor,
                        fontSize: heightPercentageToDP('2.2%'),
                      }}>
                      {NumberFormat(item?.sale?.total)} TND
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>

      <DatePicker
        modal
        open={open}
        date={new Date()}
        mode='date'
        onConfirm={(date) => {
          props?.SearchSaleByDate(date)
          setOpen(false)
          setDate(date)
        }}
        maximumDate={new Date()}
        onCancel={() => {
          setOpen(false)
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  InoutView: {
    height: heightPercentageToDP('5%'),
    padding: widthPercentageToDP('0.5%'),
    fontSize: heightPercentageToDP('2%'),
    width: widthPercentageToDP('22%'),
    borderRadius: 2,
    fontFamily: 'Poppins-Regular',
  },
  DataTableHeaderTextView: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: heightPercentageToDP('2.2%'),
  },
  DateCellTextView: {
    fontFamily: 'Poppins-Regular',
    fontSize: heightPercentageToDP('2.2%'),
  },
});

const mapStateToProps = ({ Sale }) => ({
  Sale
});

export default connect(mapStateToProps, {
  GetSaleItems,
  ReadAllSales,
  SearchSaleByDate,
  SearchByOrderNumber
})(SalesRight);
