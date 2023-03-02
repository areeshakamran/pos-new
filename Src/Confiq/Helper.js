import { openDatabase } from 'react-native-sqlite-storage';
import { PaginationNumber } from './Constant';

var db = openDatabase(
    { name: 'POS.db', location: "default" },
    () => console.log("home Action Database "),
    (e) => console.log("Error ", e)
);

export const ReadALLWithOutPagination = (from) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM ${from}`,
                [],
                (tx, results) => {
                    var temp = []
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    resolve(temp)
                },
                (e) => reject(e),
            );
        })
    })
}

export const ReadALLWithPagination = (from, pageNumber) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM ${from}`,
                [],
                (tx, results) => {
                    let temp = []
                    for (let i = 0; i < results.rows.length; i++) {
                        temp.push(results.rows.item(i))
                    }
                    resolve(temp)
                },
                (e) => reject(e),
            );
        })
    })
}


export function NumberFormat(val) {
    return parseFloat(val).toFixed(2).replace(/\.0+$/, '')
}

export const ReadAllwithSpecificColumn = (query) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                query,
                [],
                (tx, results) => {
                    var temp = []
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i).offlineSaleid);
                    }
                    resolve(temp)
                },
                (e) => reject(e),
            );
        })
    })
}
