import { FlatList, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import React from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { useTheme } from '@react-navigation/native';
import CustomHeader from '../../Component/CustomeHeader';
import TableCheck from '../../Assets/Images/Tablecheck.svg';
import HomeCustomeButton from '../Home/Components/HomeCustomeButton';
import { connect } from 'react-redux';
import { addTabelData, removeCurrentTable } from '../../Store/Actions/TableAction'

function Table(props) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.grayLightColor }}>
      <CustomHeader title="Tables" navigation={props.navigation} />

      <View
        style={{
          marginTop: heightPercentageToDP('1%'),
          marginHorizontal: widthPercentageToDP('2%'),
        }}>

        {/* <CustomInput
          placeholder="Search Tables"
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
        /> */}

        <View
          style={{
            paddingBottom: heightPercentageToDP('10%'),
            elevation: 5,
            padding: widthPercentageToDP('1%'),
            borderRadius: 2,
            marginTop: heightPercentageToDP('2%'),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FlatList
            data={props?.Table?.allTables}
            numColumns={5}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => {
              return (
                <View key={index}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={async () => {
                      if (item.Booked == 1) {
                        ToastAndroid.show(
                          "Table already booked ...!",
                          ToastAndroid.LONG,
                          ToastAndroid.BOTTOM,
                          25,
                          50
                        );
                      }
                      else {
                        await props?.addTabelData(item)
                        props.navigation.navigate('Main')
                      }
                    }}
                    key={index}
                    style={{ margin: widthPercentageToDP('1%') }}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                          item.Booked == 1 || props?.Table?.currentTable[0]?.id == item?.id
                            ? colors.PrimaryColor
                            : 'rgba(128,173,199,0.2)',
                        padding: widthPercentageToDP('2%'),
                        borderColor: colors.PrimaryColor,
                        borderWidth: 1,
                        borderRadius: 2,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          color:
                            item.Booked == 1 || props?.Table?.currentTable[0]?.id == item?.id
                              ? colors.light
                              : colors.PrimaryColor,
                          fontSize: heightPercentageToDP('2.5%'),
                        }}>
                        {`Table ${item.table_no}`}
                      </Text>

                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color:
                            item.Booked == 1 || props?.Table?.currentTable[0]?.id == item?.id
                              ? colors.light
                              : colors.PrimaryColor,
                          fontSize: heightPercentageToDP('2%'),
                        }}>
                        {`Seats: ${item.no_of_seats}`}
                      </Text>
                    </View>

                    <HomeCustomeButton
                      title={
                        item.Booked == 1 ? 'Already Booked' : props?.Table?.currentTable[0]?.id == item?.id ? 'Current Table' : 'Set Table'
                      }
                      Icon={TableCheck}
                      IconWidth={widthPercentageToDP('2%')}
                      IconHeight={heightPercentageToDP('2%')}
                      style={[
                        styles.ViewStyle,
                        {
                          backgroundColor:
                            item.Booked == 1 || props?.Table?.currentTable[0]?.id == item?.id
                              ? colors.PrimaryColor
                              : 'rgba(128,173,199,0.2)',
                          borderColor: colors.PrimaryColor,
                          borderWidth: 1,
                        },
                      ]}
                      txtStyle={[
                        styles.textStyle,
                        {
                          color:
                            item.Booked == 1 || props?.Table?.currentTable[0]?.id == item?.id
                              ? colors.light
                              : colors.PrimaryColor,
                          marginLeft: widthPercentageToDP('1%'),
                        },
                      ]}
                    />
                  </TouchableOpacity>

                  {
                    props?.Table?.currentTable.length > 0
                      ? props?.Table?.currentTable[0].id == item.id
                        ? <HomeCustomeButton
                          title={
                            'Remove Table'
                          }
                          onpress={() => props?.removeCurrentTable()}
                          IconWidth={widthPercentageToDP('2%')}
                          IconHeight={heightPercentageToDP('2%')}
                          style={[
                            {
                              paddingVertical: heightPercentageToDP('1.3%'),
                              borderRadius: 2,
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: widthPercentageToDP('15%'),
                              flexDirection: 'row',
                              alignSelf: 'center',
                              backgroundColor: colors.deleteColor,
                              borderColor: colors.PrimaryColor,
                              borderWidth: 1,
                            },
                          ]}
                          txtStyle={[
                            styles.textStyle,
                            {
                              color:
                                colors.light,
                            },
                          ]}
                        />
                        : null
                      : null
                  }
                </View>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}


const mapStateToProps = ({ Table }) => ({
  Table
});

export default connect(mapStateToProps, {
  addTabelData,
  removeCurrentTable
})(Table)

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
  ViewStyle: {
    paddingVertical: heightPercentageToDP('1.3%'),
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: widthPercentageToDP('15%'),
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginTop: heightPercentageToDP('1.5%'),
  },
  textStyle: {
    fontSize: heightPercentageToDP('2.2%'),
    fontFamily: 'Poppins-Medium',
  },
});
