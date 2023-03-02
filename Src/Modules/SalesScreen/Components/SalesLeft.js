import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import {
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import { useTheme } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';
import { connect } from 'react-redux'
import { GetDailySales } from '../../../Store/Actions/SaleAction'

function SalesLeft(props) {
  const { colors } = useTheme();
  const [indexCatgory, setIndexCatgory] = React.useState(0);

  // React.useEffect(() => {
  //   props.GetDailySales(props?.Sale?.saleDate[0])
  // }, [])

  return (
    <FlatList
      data={props?.Sale?.saleDate}
      keyExtractor={(item, index) => index}
      ListHeaderComponent={
        <DataTable>
          <DataTable.Header
            style={{
              height: heightPercentageToDP('8%'),
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.PrimaryColor,
            }}>
            <DataTable.Title
              textStyle={[
                styles.DataTableHeaderTextView,
                {
                  color: colors.light,
                },
              ]}>
              Date of Sale
            </DataTable.Title>
            <DataTable.Title
              textStyle={[
                styles.DataTableHeaderTextView,
                {
                  color: colors.light,
                },
              ]}>
              Total Sale
            </DataTable.Title>
            <DataTable.Title
              textStyle={[
                styles.DataTableHeaderTextView,
                {
                  color: colors.light,
                },
              ]}>
              Total Amount
            </DataTable.Title>
          </DataTable.Header>
        </DataTable>
      }
      renderItem={({ item, index }) => {
        return (
          <DataTable key={index}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                props.GetDailySales(item)
                setIndexCatgory(index);
              }}>
              <DataTable.Row
                style={{
                  borderBottomColor: colors.grayLightColor,
                  borderBottomWidth: 3,
                  borderLeftColor: colors.PrimaryColor,
                  borderLeftWidth: indexCatgory == index ? 5 : 0,
                  backgroundColor:
                    indexCatgory == index
                      ? 'rgba(128,173,199,0.2)'
                      : 'transparent',
                  paddingVertical: heightPercentageToDP('2%'),
                }}>
                <DataTable.Cell
                  textStyle={[
                    styles.DateCellTextView,
                    {
                      color: colors.PrimaryColor,
                    },
                  ]}>
                  {item.order_date}
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={[
                    styles.DateCellTextView,
                    {
                      color: colors.PrimaryColor,
                    },
                  ]}>
                  {item.total_Sale}
                </DataTable.Cell>
                <DataTable.Cell
                  textStyle={[
                    styles.DateCellTextView,
                    {
                      color: colors.PrimaryColor,
                    },
                  ]}>
                  {item.total_count.toFixed(2)}
                </DataTable.Cell>
              </DataTable.Row>
            </TouchableOpacity>
          </DataTable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  Viewsss: {
    elevation: 5,
  },
  DataTableHeaderTextView: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: heightPercentageToDP('2.2%'),
  },
  DateCellTextView: {
    fontFamily: 'Poppins-Medium',
    fontSize: heightPercentageToDP('2.2%'),
  },
});

const mapStateToProps = ({ Sale }) => ({
  Sale
});

export default connect(mapStateToProps, {
  GetDailySales
})(SalesLeft)