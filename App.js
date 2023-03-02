import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ActivityIndicator, LogBox, Modal, StatusBar, View } from 'react-native';
import { connect } from 'react-redux';
import AuthNavigation from './Src/Modules/Auth/Navigation/AuthNavigation';
import Checkout from './Src/Modules/CheckOutScreen/CheckOut';
import Draft from './Src/Modules/DraftScreens/Draft';
import MainHome from './Src/Modules/Home/MainHome';
import SalesDatail from './Src/Modules/SalesScreen/Components/SalesDetail';
import Sales from './Src/Modules/SalesScreen/Sales';
import ReturnOrder from './Src/Modules/SalesScreen/ReturnOrder';
import Table from './Src/Modules/TableScreen/Table';

LogBox.ignoreAllLogs()

const Stack = createNativeStackNavigator();

const App = (props) => {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
      PrimaryColor: props?.Color?.PrimaryColor,
      secondayColor: props?.Color?.secondayColor,
      textPrimaryColor: props?.Color?.textPrimaryColor,
      textSecondayColor: props?.Color?.textSecondayColor,
      lightSecondayColor: props?.Color?.lightSecondayColor,
      light: props?.Color?.light,
      grayDarkColor: props?.Color?.grayDarkColor,
      grayLightColor: props?.Color?.grayLightColor,
      deleteColor: props?.Color?.deleteColor,
      CouponColor: props?.Color?.CouponColor,
      DiscountColor: props?.Color?.DiscountColor,
      TaxColor: props?.Color?.TaxColor,
      SuccessColor: props?.Color?.SuccessColor,
      DraftColor: props?.Color?.DraftColor,
    },
  };
  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator
          initialRouteName="AuthStack"
          screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AuthStack" component={AuthNavigation} />
          <Stack.Screen name="SalesDetail" component={SalesDatail} />
          <Stack.Screen name="Sales" component={Sales} />
          <Stack.Screen name="Table" component={Table} />
          <Stack.Screen name="Draft" component={Draft} />
          <Stack.Screen name="CheckOut" component={Checkout} />
          <Stack.Screen name="Main" component={MainHome} />
          <Stack.Screen name="ReturnOrder" component={ReturnOrder} />
        </Stack.Navigator>
      </NavigationContainer>
      <Modal
        transparent={true}
        visible={props?.Shared?.MainLoader}
      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: 'rgba(0,0,0,0.7)'
        }}>
          <ActivityIndicator color={'#fff'} size='large' />

        </View>
      </Modal>
    </View>
  );
}

const mapStateToProps = ({ Color, Shared, }) => ({
  Color,
  Shared,
});

export default connect(mapStateToProps, {})(App);
