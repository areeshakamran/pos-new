import { openDatabase } from 'react-native-sqlite-storage';
import {
    ALL_BOOKED_TABLES,
    ALL_ONLINE_TABLES,
    CURRENT_TABLE_BOOKED
} from './type'
import { ReadALLWithOutPagination } from '../../Confiq/Helper';
import { apiInstance } from '../../Confiq/AxiosInstance';
import store from '..';

var db = openDatabase(
    { name: 'POS.db', location: "default" },
    () => console.log("Table Action Database "),
    (e) => console.log("Error ", e)
);

export const saveTableToLocal = () => {
    db.transaction(function (tx) {
        tx.executeSql('DELETE from Dinning')
        tx.executeSql('DELETE from offline_Dinning')
        GetTableFromDataBase().then(res => {
            SaveTableToLocally(res[0].tables)
        }).catch(e => console.log(e))
    })
}

const GetTableFromDataBase = () => {
    return new Promise(async (resolve, reject) => {
        let Alldata = await apiInstance.get(`pos_product_by_cat`, {
        }).then(function (response) {
            return response
        }).catch(function (error) {
            return error.response
        })
        const { status, data } = Alldata
        if (status == 200) {
            resolve(data)
        } else {
            reject(data)
        }
    })
}

export const SaveTableToLocally = (data) => {
    db.transaction(function (tx) {
        tx.executeSql('DELETE from Dinning');
    })
    for (let i = 0; i < data.length; i++) {
        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO Dinning (table_id, table_no, no_of_seats, Booked) VALUES (?,?,?,?)',
                [data[i].id, data[i].table_no, data[i].no_of_seats, data[i].booked],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        console.log('Dinning Added')
                    } else alert('Dinning Not Added')
                },
                (e) => console.log("Error in Saving Dinning in Local database", e),
            );
        });
    }
    store.dispatch(ReadAllTables())
}

export const ReadAllTables = () => {
    return async dispatch => {
        let Dinning = await ReadALLWithOutPagination('Dinning').then(res => {
            return res
        })
        dispatch({ type: ALL_ONLINE_TABLES, payload: Dinning })
    }
}

export const addTabelData = (item) => {
    return async dispatch => {
        dispatch({ type: CURRENT_TABLE_BOOKED, payload: [] })
        let TableArray = [...store.getState().Table.allBookedTables]
        TableArray.push(item)
        console.log("AllBookedTableArray: ", TableArray)
        console.log("CurrentBookedTableArray: ", item)
        dispatch({ type: ALL_BOOKED_TABLES, payload: TableArray })
        dispatch({ type: CURRENT_TABLE_BOOKED, payload: [item] })
    }
}

export const removeCurrentTable = () => {
    return dispatch => {
        dispatch({ type: CURRENT_TABLE_BOOKED, payload: [] })
    }
}