import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase(
    { name: 'POS.db', location: "default" },
    () => console.log("Success"),
    (e) => console.log("Error ", e)
);
export const DraftDatabase = () => {
    db.transaction(function (txn) {
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='onlineDraft'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS onlineDraft', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS onlineDraft(i INTEGER PRIMARY KEY AUTOINCREMENT, id INT(10), order_no INT(20), item_count INT(10), total INT(10), discount INT(10), tax INT(10), grand_total INT(10), Status INT(10), Tabel_No INT(10))',
                        [],
                        () => console.log('onlineDraft table created'),
                        (e) => console.log('onlineDraft table are not Created', e)
                    );
                }
            },
        );
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='onlineDraftItems'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS onlineDraftItems', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS onlineDraftItems(i INTEGER PRIMARY KEY AUTOINCREMENT, draft_id INT(10), id INT(10), product_id INT(10), server_productid INT(10), name_fr VARCHAR(500), price_euro DOUBLE(20), quantity INT(10), Tabel_No INT(10))',
                        [],
                        () => console.log('onlineDraftItems table created'),
                        (e) => console.log('onlineDraftItems table are not Created', e)
                    );
                }
            },
        );
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='offlineDraft'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS offlineDraft', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS offlineDraft(id INTEGER PRIMARY KEY AUTOINCREMENT, item_count INT(10), total INT(10), discount INT(10), tax INT(10), grand_total INT(10), Status INT(10), Tabel_No INT(10))',
                        [],
                        () => console.log('offlineDraft table created'),
                        (e) => console.log('offlineDraft table are not Created', e)
                    );
                }
            },
        );
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='offlineDraftItems'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS offlineDraftItems', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS offlineDraftItems(id INTEGER PRIMARY KEY AUTOINCREMENT, off_draft_id INT(10), catid INT(10), product_id INT(10),server_productid INT(10), name_fr VARCHAR(500), price_euro DOUBLE(20), quantity INT(10), Tabel_No INT(10))',
                        [],
                        () => console.log('offlineDraftItems table created'),
                        (e) => console.log('offlineDraftItems table are not Created', e)
                    );
                }
            },
        );
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='DeleteDraft'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS DeleteDraft', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS DeleteDraft(id INT(10))',
                        [],
                        () => console.log('DeleteDraft table created'),
                        (e) => console.log('DeleteDraft table are not Created', e)
                    );
                }
            },
        );
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='TaxData'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS TaxData', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS TaxData( id INT(10), tax DOUBLE)',
                        [],
                        () => console.log('TaxData table created'),
                        (e) => console.log('TaxData table are not Created', e)
                    );
                }
            },
        );
        txn.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='Dinning'",
            [],
            function (tx, res) {
                if (res.rows.length == 0) {
                    txn.executeSql('DROP TABLE IF EXISTS Dinning', []);
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS Dinning(id INTEGER PRIMARY KEY AUTOINCREMENT, table_id INT(10), table_no INT(10), no_of_seats INT(10), Booked INT(1))',
                        [],
                        () => console.log('Dinning table created'),
                        (e) => console.log('Dinning table are not Created', e)
                    );
                }
            },
        );
    })

}