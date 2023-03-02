import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase(
    { name: 'POS.db', location: "default" },
    () => console.log("Success"),
    (e) => console.log("Error ", e)
);
export const ProductAndCategoryDatabase = () => {
    db.transaction(function (txn) {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='Category'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS Category', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS Category(id INTEGER PRIMARY KEY AUTOINCREMENT, server_id INT(10), name_fr VARCHAR(500), image VARCHAR(255),isActive VARCHAR(255) )',
                        [],
                        () => console.log('Category table created')
                    );
                }
            },
        );
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='Product'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS Product', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS Product(id INTEGER PRIMARY KEY AUTOINCREMENT, server_productid INT(10),name_fr VARCHAR(500),  price_euro INT(500), Tabel_No VARCHAR(255) , image VARCHAR(255),description VARCHAR(600) ,isActive VARCHAR(600) , quantity VARCHAR(600) , quantity_added VARCHAR(600),featured_item INT(500) , catid INT(100) , FOREIGN KEY (catid) REFERENCES Category (id)  )',
                        [],
                        () => console.log('Product table created'),
                        (e) => console.log('product table are not Created', e)
                    );
                }
            },
        );
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='cashiers'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS cashiers', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS cashiers(id INTEGER PRIMARY KEY AUTOINCREMENT, isActive INT(10), server_id INT(10), name VARCHAR(500), shop_name VARCHAR(255),description VARCHAR(600) , pin INT(100)  )',
                        [],
                        () => console.log('cashiers table created'),
                        (e) => console.log('cashiers table are not Created', e)
                    );
                }
            },
        );
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='Modifiers'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS Modifiers', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS Modifiers(id INTEGER PRIMARY KEY AUTOINCREMENT, server_id INT(10), name VARCHAR(500), price DOUBLE(20) , Product_id INT(10))',
                        [],
                        () => console.log('Modifiers table created'),
                        (e) => console.log('Modifiers table are not Created', e)
                    );
                }
            },
        );
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='offlineModifiers'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS offlineModifiers', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS offlineModifiers(id INTEGER PRIMARY KEY AUTOINCREMENT, server_productid INT(10) ,  price DOUBLE(10), name VARCHAR(500), server_id DOUBLE(20) ,  offlineSaleid INT(10))',
                        [],
                        () => console.log('offlineModifiers table created'),
                        (e) => console.log('offlineModifiers table are not Created', e)
                    );
                }
            },
        );
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='OpenCashDrawer'",
        [],
        function (tx, res) {
            if (res.rows.length == 0) {
                txn.executeSql('DROP TABLE IF EXISTS OpenCashDrawer', []);
                txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS OpenCashDrawer(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INT(10), open_cash_amount DOUBLE, close_cash_amount DOUBLE, opening_cash_amount VARCHAR(500), closing_cash_amount VARCHAR(500))',
                    [],
                    () => console.log('OpenCashDrawer table created'),
                    (e) => console.log('OpenCashDrawer table are not Created', e)
                );
            }
        },
    );
    })

}