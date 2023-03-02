import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase(
    { name: 'POS.db', location: "default" },
    () => console.log("Success"),
    (e) => console.log("Error ", e)
);
export const SaleDatabase = ()=> {
    db.transaction(function (txn) {
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='onlineSale'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS onlineSale', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS onlineSale(id DOUBLE,  total DOUBLE(20) , order_no DOUBLE(20) , Created_At VARCHAR(500) , customer_pay DOUBLE(20) , return DOUBLE(20) , discount DOUBLE(20) , coupon DOUBLE(20) , tax DOUBLE(20))',

                        [],
                        () => console.log('SaleHistory table created'),
                        (e) => console.log('SaleHistory table are not Created', e)
                    );
                }
            },
        );
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='onlineSaleItems'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS onlineSaleItems', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS onlineSaleItems(id INTEGER PRIMARY KEY AUTOINCREMENT, catid INT(10) ,  server_id INT(10) , Tabel_No VARCHAR(255) , sale_id INT(10),server_productid INT(10), name_fr VARCHAR(500), price_euro DOUBLE(20) , quantity DOUBLE(20) , quantity_added DOUBLE(20) , Created_At VARCHAR(500) , FOREIGN KEY (sale_id) REFERENCES onlineSale (id))',
                        [],
                        () => console.log('onlineSaleItems table created'),
                        (e) => console.log('onlineSaleItems table are not Created', e)
                    );
                }
            },
        );
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='offlineReturnSale'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS offlineReturnSale', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS offlineReturnSale(id DOUBLE,  total DOUBLE(20) , order_no DOUBLE(20) , Created_At VARCHAR(500))',

                        [],
                        () => console.log('offlineReturnSale table created'),
                        (e) => console.log('offlineReturnSale table are not Created', e)
                    );
                }
            },
        );
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='offlinereturnShowitem'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS offlinereturnShowitem', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS offlinereturnShowitem(id INTEGER PRIMARY KEY AUTOINCREMENT, catid INT(10) ,  server_id INT(10) ,  sale_id INT(10),server_productid INT(10), name_fr VARCHAR(500), price_euro DOUBLE(20) , quantity DOUBLE(20) , quantity_added DOUBLE(20) , Created_At VARCHAR(500) , FOREIGN KEY (sale_id) REFERENCES onlineSale (id))',
                        [],
                        () => console.log('offlinereturnShowitem table created'),
                        (e) => console.log('offlinereturnShowitem table are not Created', e)
                    );
                }
            },
        );
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='onlinereturnShowitem'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS onlinereturnShowitem', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS onlinereturnShowitem(id INTEGER PRIMARY KEY AUTOINCREMENT, catid INT(10) ,  server_id INT(10) ,  sale_id INT(10),server_productid INT(10), name_fr VARCHAR(500), price_euro DOUBLE(20) , quantity DOUBLE(20) , quantity_added DOUBLE(20) , Created_At VARCHAR(500) , FOREIGN KEY (sale_id) REFERENCES onlineSale (id))',
                        [],
                        () => console.log('onlinereturnShowitem table created'),
                        (e) => console.log('onlinereturnShowitem table are not Created', e)
                    );
                }
            },
        );
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='OfflineSaleItem'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS OfflineSaleItem', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS OfflineSaleItem(id INTEGER PRIMARY KEY AUTOINCREMENT, catid INT(10) , Tabel_No VARCHAR(255) , offlineSaleid INT(10),server_productid INT(10), name_fr VARCHAR(500), price_euro DOUBLE(20) , quantity DOUBLE(20) , quantity_added DOUBLE(20) , Created_At VARCHAR(500) , FOREIGN KEY (offlineSaleid) REFERENCES OfflineSale (id))',
                        [],
                        () => console.log('OfflineSaleItem table created'),
                        (e) => console.log('OfflineSaleItem table are not Created', e)
                    );
                }
            },
        );
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='OfflineSale'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS OfflineSale', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS OfflineSale(id INTEGER PRIMARY KEY AUTOINCREMENT,  total DOUBLE(20) , Created_At VARCHAR(500) , customer_pay DOUBLE(20) , return DOUBLE(20) , discount DOUBLE(20) , coupon DOUBLE(20) , tax DOUBLE(20))',
                        [],
                        () => console.log('OfflineSale table created'),
                        (e) => console.log('OfflineSale table are not Created', e)
                    );
                }
            },
        );
    })
   
}