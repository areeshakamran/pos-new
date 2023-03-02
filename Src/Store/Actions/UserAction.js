import { apiInstance } from '../../Confiq/AxiosInstance';
import { MAIN_LOADER, CHANGE_CASHIERS } from './type';
import { AfterLogin } from './HomeAction';
import store from '..';
import { openDatabase } from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from "react-native";

var db = openDatabase(
  { name: 'POS.db', location: 'default' },
  () => { },
  e => console.log('Error ', e),
);

export const MasterLoginftn = (email, password) => {
  return async dispatch => {
    dispatch({ type: MAIN_LOADER, payload: true });
    let Alldata = await apiInstance
      .post(`master_login?email=${email}&password=${password}`, {})
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        dispatch({ type: MAIN_LOADER, payload: false });
        return error.response;
      });
    const { status, data } = Alldata;
    if (status == 200) {
      db.transaction(async tx => {

        dispatch({ type: CHANGE_CASHIERS, payload: data?.cashiers });
        tx.executeSql('DELETE from cashiers');
        for (let i = 0; i < data.cashiers.length; i++) {
          tx.executeSql(
            'INSERT INTO cashiers (server_id, name , shop_name , description , pin , isActive  ) VALUES (?,?,?,? , ?,?)',
            [
              data.cashiers[i].id,
              data.cashiers[i].name,
              data.cashiers[i].shop_name,
              data.cashiers[i].description,
              data.cashiers[i]?.pin,
              data.cashiers[i]?.isActive,
            ],
            (tx, results) => {
              if (results.rowsAffected > 0) {
                console.log('inseted cashiers');
              } else alert('Registration Failed');
            },
            e => console.log('Error in Saving Category in Local database', e),
          );
        }
        let login = true;
        await AsyncStorage.setItem('login', JSON.stringify(login));
        store.dispatch(AfterLogin());
      });
    } else {
      dispatch({ type: MAIN_LOADER, payload: false });
    }
  };
};

export const VerifyCeshiers = (pin, enterpin, status,navigation) => {
  return async dispatch => {
    if (pin == enterpin) {
      if (status == 1) {
        navigation.navigate('Main');
      } else {
        ToastAndroid.showWithGravityAndOffset(
          "Your Account was Deactive. Kindly Connect to Manager!",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );

      }

    } else {
      alert('wrong Pin');
    }
  };
};

export const cashier = () => {
  return async dispatch => {
    let Alldata = await apiInstance
      .get(`/cashier`)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        return error.response;
      });
    const { status, data } = Alldata;
    if (status == 200) {
      db.transaction(async tx => {
        dispatch({ type: CHANGE_CASHIERS, payload: data?.data });
        tx.executeSql('DELETE from cashiers');
        for (let i = 0; i < data?.data.length; i++) {
          tx.executeSql(
            'INSERT INTO cashiers (server_id, name , shop_name , description , pin , isActive  ) VALUES (?,?,?,? , ? , ?)',
            [
              data?.data[i].id,
              data?.data[i].name,
              data?.data[i].shop_name,
              data?.data[i].description,
              data?.data[i]?.pin,
              data?.data[i]?.isActive,
            ],
            (tx, results) => {
              if (results.rowsAffected > 0) {
                console.log('inseted cashiers');
              } else alert('Registration Failed');
            },
            e => console.log('Error in Saving Category in Local database', e),
          );
        }
      });

      return true;
    } else {
      console.log('No Cahiers Found');
      return false;
    }
  };
};
