import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { useTheme } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { changeCategoryANDgetProduct } from '../../../Store/Actions/HomeAction';

function LeftSide(props) {

  const { colors } = useTheme();
  const [indexCatgory, setIndexCatgory] = React.useState(0);
  
  return (
    <View style={{ flex: 1, marginVertical: heightPercentageToDP('3%') }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: widthPercentageToDP('3%'),
            height: heightPercentageToDP('6%'),
            backgroundColor: colors.PrimaryColor,
            borderRadius: 2,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <FontAwesome
            name="user"
            color={colors.light}
            size={heightPercentageToDP('3.5%')}
          />
        </View>
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            color: colors.PrimaryColor,
            fontSize: heightPercentageToDP('2.5%'),
            marginLeft: widthPercentageToDP('1%'),
          }}>
          Customer
        </Text>
      </View>

      <View
        style={{
          borderBottomColor: '#E8E8E8',
          borderBottomWidth: 2,
          marginTop: heightPercentageToDP('2%'),
          marginHorizontal: widthPercentageToDP('1%'),
        }}
      />

      <FlatList
        data={props?.Home?.Category}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                props?.changeCategoryANDgetProduct(item.server_id)
                setIndexCatgory(index);
              }}
              style={{
                padding: widthPercentageToDP('1.7%'),
                marginTop:
                  indexCatgory == index ? heightPercentageToDP('1%') : 0,
                borderRadius: 2,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  indexCatgory == index ? colors.PrimaryColor : colors.light,
                borderBottomColor: '#E8E8E8',
                borderBottomWidth: 2,
                marginHorizontal: widthPercentageToDP('1%'),
              }}>
              <Text
                style={{
                  fontFamily:
                    indexCatgory == index
                      ? 'Poppins-SemiBold'
                      : 'Poppins-Medium',
                  color:
                    indexCatgory == index ? colors.light : colors.PrimaryColor,
                  fontSize: heightPercentageToDP('2.2%'),
                }}>
                {item.name_fr}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const mapStateToProps = ({ Home }) => ({
  Home
});

export default connect(mapStateToProps, {
  changeCategoryANDgetProduct
})(LeftSide);
