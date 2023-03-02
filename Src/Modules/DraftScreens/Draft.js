import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator, FlatList,
  StyleSheet,
  Text, View
} from 'react-native';
import { DataTable } from 'react-native-paper';
import {
  heightPercentageToDP,
  widthPercentageToDP
} from 'react-native-responsive-screen';
import { connect } from 'react-redux';
import Delete from '../../Assets/Images/delete.svg';
import Edit from '../../Assets/Images/edit.svg';
import Search from '../../Assets/Images/search.svg';
import CustomHeader from '../../Component/CustomeHeader';
import CustomInput from '../../Component/CustomInput';
import {
  DeleteDrafts,
  getMoreDraft, SearchDataofDraft, sendtoCartFromDraft
} from '../../Store/Actions/DraftAction';
import HomeCustomeButton from '../Home/Components/HomeCustomeButton';

function Drafts(props) {
  const {colors} = useTheme();
  const [SearchDraft, setSearchDraft] = React.useState('');
  const [IndexValue, setIndexValue] = React.useState('');
  const [EditIndexValue, setEditIndexValue] = React.useState('');

  return (
    <View style={{flex: 1, backgroundColor: colors.grayLightColor}}>
      <CustomHeader title="Draft" navigation={props.navigation} />

      <View
        style={{
          marginTop: heightPercentageToDP('1%'),
          marginHorizontal: widthPercentageToDP('2%'),
        }}>
        <CustomInput
          value={SearchDraft}
          placeholder="Search Drafts"
          onChangeText={text => setSearchDraft(text)}
          onSubmitEditing={() => {
              props.SearchDataofDraft(SearchDraft);
          }}
          placeholderTextColor={colors.PrimaryColor}
          ViewStyle={{
            backgroundColor: 'white',
            elevation: 5,
            width: widthPercentageToDP('25%'),
            borderRadius: 2,
            alignSelf: 'flex-end',
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

        <View
          style={{
            backgroundColor: 'white',
            elevation: 5,
            borderRadius: 2,
            padding: widthPercentageToDP('1%'),
            marginTop: heightPercentageToDP('2%'),
            marginBottom: heightPercentageToDP('23%'),
          }}>
          <FlatList
            onEndReached={() => props?.getMoreDraft()}
            onEndReachedThreshold={0.01}
            scrollEventThrottle={150}
            initialNumToRender={20}
            ListFooterComponent={() => {
              return (
                <View
                  style={{
                    height: heightPercentageToDP('10%'),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {props?.Draft?.NextPage ? (
                    props.Draft.allDrafts.length > 0 ? (
                      <ActivityIndicator
                        color={colors.PrimaryColor}
                        size={'large'}
                      />
                    ) : (
                      <Text
                        style={{
                          color: 'silver',
                          fontSize: heightPercentageToDP('1.5%'),
                        }}>
                        No Products to show
                      </Text>
                    )
                  ) : (
                    <Text
                      style={{
                        color: 'silver',
                        fontSize: heightPercentageToDP('1.5%'),
                      }}>
                      No more Products to show
                    </Text>
                  )}
                </View>
              );
            }}
            data={props.Draft.allDrafts}
            keyExtractor={(item, index) => index}
            ListHeaderComponent={
              <DataTable>
                <DataTable.Header
                  style={{
                    backgroundColor: colors.PrimaryColor,
                    borderRadius: 2,
                  }}>
                  <DataTable.Title
                    textStyle={[
                      styles.DataTableHeaderTextView,
                      {
                        color: colors.light,
                      },
                    ]}>
                    Draft No.
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={[
                      styles.DataTableHeaderTextView,
                      {
                        color: colors.light,
                      },
                    ]}>
                    Quantity
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={[
                      styles.DataTableHeaderTextView,
                      {
                        color: colors.light,
                      },
                    ]}>
                    Grand Total
                  </DataTable.Title>
                  <DataTable.Title
                    numeric
                    textStyle={[
                      styles.DataTableHeaderTextView,
                      {
                        color: colors.light,
                      },
                    ]}>
                    Action
                  </DataTable.Title>

                  <DataTable.Title
                    numeric
                    textStyle={[
                      styles.DataTableHeaderTextView,
                      {
                        color: colors.light,
                      },
                    ]}></DataTable.Title>
                </DataTable.Header>
              </DataTable>
            }
            renderItem={({item, index}) => {
              return (
                <DataTable key={index}>
                  <DataTable.Row
                    style={{
                      backgroundColor: 'rgba(128,173,199,0.2)',
                      marginTop: heightPercentageToDP('1%'),
                      borderRadius: 2,
                    }}>
                    <DataTable.Cell
                      textStyle={[
                        styles.DateCellTextView,
                        {
                          color: colors.PrimaryColor,
                        },
                      ]}>
                      {item.id}
                    </DataTable.Cell>
                    <DataTable.Cell
                      textStyle={[
                        styles.DateCellTextView,
                        {
                          color: colors.PrimaryColor,
                        },
                      ]}>
                      {item.item_count}
                    </DataTable.Cell>
                    <DataTable.Cell
                      textStyle={[
                        styles.DateCellTextView,
                        {
                          color: colors.PrimaryColor,
                        },
                      ]}>
                      {item.total.toFixed(2)}
                    </DataTable.Cell>
                    <DataTable.Cell
                      numeric
                      textStyle={[
                        styles.DateCellTextView,
                        {
                          color: colors.PrimaryColor,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        },
                      ]}>
                      <HomeCustomeButton
                        LoaderValue={EditIndexValue == item.id ? true : false}
                        onpress={async () => {
                          setEditIndexValue(item.id);
                          if (props.Shared.Internet) {
                            await props?.sendtoCartFromDraft(item, false, true), /// first false is delete api hit and second true is items add to cart again
                              setEditIndexValue('');
                            props.navigation.navigate('Main');
                          } else {
                            await props?.sendtoCartFromDraft(item, true, true);
                            setEditIndexValue('');
                            props.navigation.navigate('Main');
                          }
                        }}
                        Icon={Edit}
                        IconWidth={widthPercentageToDP('4%')}
                        IconHeight={heightPercentageToDP('4%')}
                      />
                    </DataTable.Cell>

                    <DataTable.Cell
                      numeric
                      textStyle={[
                        styles.DateCellTextView,
                        {
                          color: colors.PrimaryColor,
                        },
                      ]}>
                      <HomeCustomeButton
                        LoaderValue={IndexValue == item.id ? true : false}
                        onpress={async () => {
                          setIndexValue(item.id);
                          if (props.Shared.Internet) {
                            await props?.sendtoCartFromDraft(
                              item,
                              false,
                              false,
                            ); /// first false is delete api hit and second false is items add to cart again
                            setIndexValue('');
                            props.navigation.navigate('Main');
                          } else {
                            await props?.sendtoCartFromDraft(item, true, false);
                            setIndexValue('');
                            props.navigation.navigate('Main');
                          }
                        }}
                        Icon={Delete}
                        IconWidth={widthPercentageToDP('4%')}
                        IconHeight={heightPercentageToDP('4%')}
                      />
                    </DataTable.Cell>
                  </DataTable.Row>
                </DataTable>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
}

const mapStateToProps = ({Draft, Shared}) => ({
  Draft,
  Shared,
});

export default connect(mapStateToProps, {
  DeleteDrafts,
  getMoreDraft,
  sendtoCartFromDraft,
  SearchDataofDraft,
})(Drafts);

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
    fontSize: heightPercentageToDP('2.5%'),
  },
  DateCellTextView: {
    fontFamily: 'Poppins-Regular',
    fontSize: heightPercentageToDP('2.5%'),
  },
});
