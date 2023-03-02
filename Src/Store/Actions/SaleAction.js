import { openDatabase } from 'react-native-sqlite-storage';
import store from '..';
import { apiInstance } from '../../Confiq/AxiosInstance';
import { ReadALLWithOutPagination } from '../../Confiq/Helper';
import {
    ALL_SALES, DELETED_SALE_ITEMS, MAIN_LOADER, SALES_ITEMS
} from './type';
import { ToastAndroid } from 'react-native'
var db = openDatabase(
    { name: 'POS.db', location: "default" },
    () => console.log("Sale Action Database "),
    (e) => console.log("Error ", e)
);
export const saveSalesToLocal = () => {
    db.transaction(function (tx) {
        tx.executeSql('DELETE from onlineSale')
        tx.executeSql('DELETE from onlineSaleItems')
        GetSalesFromDataBase().then(res => {
            SaveSalesToLocally(res[0].data)
        }).catch(e => console.log(e))
    })
}

const GetSalesFromDataBase = () => {
    return new Promise(async (resolve, reject) => {
        let Alldata = await apiInstance.get(`all_sales_by_date_offline`, {
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

function SaveSalesToLocally(data) {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].sales.length; j++) {
            const savingDate = data[i].sales[j].sale.created_at.split('T')[0]
            db.transaction(function (tx) {
                tx.executeSql(
                    'INSERT INTO onlineSale (id, total, order_no, Created_At, customer_pay, return , discount , coupon , tax) VALUES (?,?,?,?,?,?,?,?,? )',
                    [data[i].sales[j].sale.id, data[i].sales[j].sale.grand_total, data[i].sales[j].sale.order_no, savingDate, data[i].sales[j].sale.customer_pay, data[i].sales[j].sale.return, data[i].sales[j].sale.discount, data[i].sales[j].sale.coupon, data[i].sales[j].sale.taxes],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            console.log('Sale History Addedddddddddddddddddddddd')
                        } else alert('Sale History Not Added')
                    },
                    (e) => console.log("Error in Saving  Sale History in Local database", e),
                );
            });
            if (data[i].sales[j]?.sale?.return_sale_items.length > 0) {
                for (let k = 0; k < data[i].sales[j]?.sale?.return_sale_items.length; k++) {
                    let itemSavingDate = data[i].sales[j]?.sale?.return_sale_items[k].created_at.split('T')[0]
                    db.transaction(function (tx) {
                        tx.executeSql(
                            'INSERT INTO onlinereturnShowitem ( server_id,sale_id, server_productid, name_fr, price_euro, quantity , quantity_added , Created_At) VALUES (?,?,?,?,?,?,?,?)',
                            [data[i].sales[j]?.sale?.return_sale_items[k].id, data[i].sales[j]?.sale?.id, data[i].sales[j]?.sale?.return_sale_items[k].product_id, data[i].sales[j]?.sale?.return_sale_items[k].product_name, data[i].sales[j]?.sale?.return_sale_items[k].unit_price, data[i].sales[j]?.sale?.return_sale_items[k].quantity, data[i].sales[j]?.sale?.return_sale_items[k].quantity, itemSavingDate],
                            (tx, results) => {
                                if (results.rowsAffected > 0) {
                                    console.log('onlinereturnShowitemItem Added')
                                } else alert('onlinereturnShowitem Item Not Added')
                            },
                            (e) => console.log("onlinereturnShowitem Error in Saving Sale Items in Local database", e),
                        );
                    });
                }
            }

            for (let z = 0; z < data[i].sales[j].sale_item.length; z++) {
                let itemSavingDate = data[i].sales[j].sale_item[z].created_at.split('T')[0]
                db.transaction(function (tx) {
                    tx.executeSql(
                        'INSERT INTO onlineSaleItems ( server_id,sale_id, server_productid, name_fr, price_euro, quantity , quantity_added , Created_At) VALUES (?,?,?,?,?,?,?,?)',
                        [data[i].sales[j].sale_item[z].id, data[i].sales[j].sale_item[z].sale_id, data[i].sales[j].sale_item[z].product_id, data[i].sales[j].sale_item[z].product_name, data[i].sales[j].sale_item[z].unit_price, data[i].sales[j].sale_item[z].quantity, data[i].sales[j].sale_item[z].quantity, itemSavingDate],
                        (tx, results) => {
                            if (results.rowsAffected > 0) {
                                console.log('onlineSaleItems Item Added')
                            } else alert('onlineSaleItems Item Not Added')
                        },
                        (e) => console.log("Error in Saving Sale Items in Local database", e),
                    );
                });
            }



        }
    }
    store.dispatch(ReadAllSales())
}

export const ReadAllSales = () => {
    return async dispatch => {

        let onlineSale = await ReadALLWithOutPagination('onlineSale').then(res => {
            return res
        }).catch(e => console.log("ReadAllSales::", e))
        let allOnlineSale = await GetSaleProducts(onlineSale, 'onlineSaleItems', 'sale_id').then(res => { return res })
        let offlineSale = await ReadALLWithOutPagination('OfflineSale').then(res => {
            return res
        }).catch(e => console.log("ReadAllSales::", e))
        let allofflineSale = await GetSaleProducts(offlineSale, 'OfflineSaleItem', 'offlineSaleid').then(res => { return res })
        const combineSale = allofflineSale.reverse().concat(allOnlineSale.reverse())
        dispatch({ type: ALL_SALES, payload: combineSale })
    }
}

export const GetDailySales = (item) => {
    return async dispatch => {
        var query = `SaleHistory where order_date = ${JSON.stringify(item.order_date)}`
        ReadALLWithOutPagination(query).then(res => {
            dispatch({ type: ALL_SALES, payload: res })
        })
    }
}

export const GetSaleItems = (item, props) => {
    return async dispatch => {
        if (item?.sale?.order_no) {
            let onlineSale = await ReadALLWithOutPagination(`onlineSale where id = ${item?.sale?.id}`).then(res => {
                return res
            }).catch(e => console.log("ReadAllSales::", e))
            let allOnlineSale = await GetSaleProducts(onlineSale, 'onlineSaleItems', 'sale_id').then(res => { return res })
            dispatch({ type: SALES_ITEMS, payload: allOnlineSale })
            props.navigation.navigate('SalesDetail', { allOnlineSale });
        }
        else {
            let offlinesale = await ReadALLWithOutPagination(`OfflineSale where id = ${item?.sale?.id}`).then(res => {
                return res
            }).catch(e => console.log("ReadAllSales::", e))
            let allofflinesale = await GetSaleProducts(offlinesale, 'OfflineSaleItem', 'offlineSaleid').then(res => { return res })
            dispatch({ type: SALES_ITEMS, payload: allofflinesale })
            props.navigation.navigate('SalesDetail', { allofflinesale });

        }
        // ReadALLWithOutPagination(query).then(res => {
        //     dispatch({ type: SALES_ITEMS, payload: res })
        //     props.navigation.navigate('SalesDetail', { item });
        // })

    }
}


export const deleteSale = (item) => {
    return async dispatch => {
        let allSale = [...store.getState().Sale.saleItems]
        let deleted = [...store.getState().Sale.DeleteSale]
        var query = [...store.getState().Sale.saleItems[0].sale_items]
        var newArray = query.filter(obj => obj.id != item.id)
        allSale[0].sale_items = newArray
        var newDeletedArray = query.filter(obj => obj.id == item.id)
        deleted.push(newDeletedArray[0])
        dispatch({ type: SALES_ITEMS, payload: allSale })
        dispatch({ type: DELETED_SALE_ITEMS, payload: deleted })
    }
}

export const MinusQuantity = (id, quantity) => {
    return async dispatch => {
        const findIndex = store.getState().Sale.saleItems[0].sale_items.findIndex(obj => obj.id == id)
        console.log(findIndex)
        if (findIndex != -1) {
            let data = [...store.getState().Sale.saleItems]
            if (quantity > 1) {
                var deletedItems = [...store.getState().Sale.DeleteSale]
                let finddelete = store.getState().Sale.DeleteSale.findIndex(obj => obj.id == id)
                if (finddelete != -1) {
                    deletedItems[finddelete].quantity = deletedItems[finddelete].quantity + 1
                } else {
                    let firsttimeMinus = { ...data[0].sale_items[findIndex] }
                    firsttimeMinus.quantity = 1
                    deletedItems.push(firsttimeMinus)
                }

                data[0].sale_items[findIndex].quantity = quantity - 1
                dispatch({ type: SALES_ITEMS, payload: data })
                dispatch({ type: DELETED_SALE_ITEMS, payload: deletedItems })
            }
        }
    }
}

const deletedArrayQUERY = (Delete, vslue) => {
    return async dispatch => {
        if (Delete.length > 0) {
            for (let index = 0; index < Delete.length; index++) {
                db.transaction(function (tx) {
                    tx.executeSql(
                        `DELETE FROM SaleItems WHERE sale_id = ? AND sale_item_id = ?`,
                        [Delete[index].sale_id, Delete[index].sale_item_id],
                        (tx, results) => {
                            if (results.rowsAffected > 0) {
                                console.log('Delete Sale Items Updated')
                            } else console.log('Sale Items Not Delete')
                        },
                        (e) => console.log("Error in Delete Sale Items in Local database", e),
                    );
                });

                if (vslue) {
                    db.transaction(function (tx) {
                        tx.executeSql(
                            `DELETE FROM ReturnSale WHERE sale_id = ? AND sale_item_id = ?`,
                            [Delete[index].sale_id, Delete[index].sale_item_id],
                            (tx, results) => {
                                if (results.rowsAffected > 0) {
                                    console.log('Delete Return Sale')
                                    dispatch({ type: DELETED_SALE_ITEMS, payload: [] })
                                } else console.log(' Return Sale Delete')
                            },
                            (e) => console.log("Error in Delete Return Sale in Local database", e),
                        );
                    });
                }
            }
        }
    }
}

export const ReturnOrder = async (total, props) => {
    var data = [...store.getState().Sale.saleItems]
    var Return = [...store.getState().Sale.ReturnSale]
    var Delete = [...store.getState().Sale.DeleteSale]

    console.log("Sale Items: ", data)
    console.log("Return Items: ", Return)
    console.log("Return Items: ", Delete)

    if (Delete.length > 0) {
        for (let i = 0; i < Delete.length; i++) {
            if (Return.length > 0) {
                let returnIndex = Return.findIndex(obj => obj.sale_item_id == Delete[i].sale_item_id)
                if (returnIndex == -1) {
                    db.transaction(function (tx) {
                        tx.executeSql(
                            'INSERT INTO ReturnSale (sale_id, sale_item_id, product_name, price, quantity, total) VALUES (?,?,?,?,?,?)',
                            [Delete[i].sale_id, Delete[i].sale_item_id, Delete[i].product_name, Delete[i].price, Delete[i].quantity, total],
                            (tx, results) => {
                                if (results.rowsAffected > 0) {
                                    console.log('Return Sale Added')
                                } else console.log('Return Sale Not Added')
                            },
                            (e) => console.log("Error in Saving Return Sale in Local database", e),
                        );
                    });
                }
                else {
                    db.transaction(function (tx) {
                        tx.executeSql(
                            'UPDATE ReturnSale SET product_name = ?, price = ?, quantity = ?, total = ? WHERE sale_id = ? AND sale_item_id = ?',
                            [Delete[i].product_name, Delete[i].price, Delete[i].quantity, total, Delete[i].sale_id, Delete[i].sale_item_id],
                            (tx, results) => {
                                if (results.rowsAffected > 0) {
                                    console.log('Return Sale UPDATE')
                                } else console.log('Return Sale Not UPDATE')
                            },
                            (e) => console.log("Error in UPDATE Return Sale in Local database", e),
                        );
                    });

                }
            }
        }
    }

    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            db.transaction(function (tx) {
                tx.executeSql(
                    'UPDATE SaleItems SET product_name = ?, price = ?, quantity = ?, total = ? WHERE sale_id = ? AND sale_item_id = ?',
                    [data[i].product_name, data[i].price, data[i].quantity, total, data[i].sale_id, data[i].sale_item_id],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            console.log('Sale Items UPDATE')
                            db.transaction(function (tx) {
                                tx.executeSql(
                                    'UPDATE SaleHistory SET total = ?, grand_total = ? WHERE sale_id = ? ',
                                    [total, total, data[i].sale_id],
                                    (tx, results) => {
                                        if (results.rowsAffected > 0) {
                                            console.log('Sale History UPDATE')
                                        } else console.log('Sale History Not UPDATE')
                                    },
                                    (e) => console.log("Error in UPDATE Sale History in Local database", e),
                                );
                            });
                        } else console.log('Sale Items Not UPDATE')
                    },
                    (e) => console.log("Error in UPDATE Sale Items in Local database", e),
                );
            });
        }
    }
    else {
        db.transaction(function (tx) {
            tx.executeSql(
                `DELETE FROM SaleHistory WHERE sale_id = ?`,
                [Delete[0].sale_id],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        console.log('Delete Sale History Updated')
                    } else console.log('Delete Sale History alert else Updated')
                },
                (e) => console.log("Error in Delete Sale History in Local database", e),
            );
        });
    }
    await store.dispatch(deletedArrayQUERY(Delete, false))
    props.navigation.push('Sales')
}

export const OnlineReturnSale = (total, props) => {
    OnlineReturnSaleQuery().then(res => {
        // console.log("res: ", res)
        salesTOlocalDB(total, props)
    }).catch(e => console.log("error: ", e))
}

export const OnlineReturnSaleQuery = async () => {
    return new Promise(async (resolve, reject) => {
        var Delete = [...store.getState().Sale.DeleteSale]
        var Data1 = [...store.getState().Sale.saleItems]

        let Alldata = await apiInstance.post(`return_order?id=${Delete[0]?.sale_id || Data1[0]?.sale_id}`, {
            "sale_items": Delete,
            "edit_sale_items": Data1,
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

const salesTOlocalDB = async (total, props) => {
    var Data1 = [...store.getState().Sale.saleItems]
    var Delete = [...store.getState().Sale.DeleteSale]
    var Sale = [...store.getState().Sale.sales]

    if (Data1.length > 0) {
        console.log(Data1.length, '************************')
        for (let i = 0; i < Data1.length; i++) {
            db.transaction(function (tx) {
                tx.executeSql(
                    'UPDATE SaleItems SET product_name = ?, price = ?, quantity = ?, total = ? WHERE sale_id = ? AND sale_item_id = ?',
                    [Data1[i].product_name, Data1[i].price, Data1[i].quantity, total, Data1[i].sale_id, Data1[i].sale_item_id],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            console.log('Sale Items UPDATE')
                            db.transaction(function (tx) {
                                tx.executeSql(
                                    'UPDATE SaleHistory SET total = ?, grand_total = ? WHERE sale_id = ?',
                                    [total, total, Data1[i].sale_id],
                                    (tx, results) => {
                                        if (results.rowsAffected > 0) {
                                            console.log('Sale History UPDATE')
                                        } else console.log('Sale History Not UPDATE')
                                    },
                                    (e) => console.log("Error in UPDATE Sale History in Local database", e),
                                );
                            });
                        } else console.log('Sale Items Not UPDATE')
                    },
                    (e) => console.log("Error in UPDATE Sale Items in Local database", e),
                );
            });
        }
    }
    else {
        console.log(Data1.length)
        db.transaction(function (tx) {
            tx.executeSql(
                `DELETE FROM SaleHistory WHERE sale_id = ?`,
                [Delete[0].sale_id],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        console.log('Delete Sale History Updated')
                    } else console.log('Sale History Not Delete')
                },
                (e) => console.log("Error in Delete Sale History in Local database", e),
            );
        });
    }
    await store.dispatch(deletedArrayQUERY(Delete, true))
    props.navigation.push('Sales')
    // UpdateSalesTable()
}

export const UpdateSalesTable = () => {
    var Sale = [...store.getState().Sale.sales]
    let temp = 0
    for (let index = 0; index < Sale.length; index++) {
        temp = Sale[index].grand_total + temp
    }
    console.log(temp)
    console.log(Sale.length)
    // db.transaction(function (tx) {
    //     tx.executeSql(
    //         'UPDATE SaleDate SET total_Sale = ?, total_count = ? WHERE order_date = ?',
    //         [Sale.length, temp, Sale[0].order_date],
    //         (tx, results) => {
    //             if (results.rowsAffected > 0) {
    //                 console.log('Sale Date UPDATE')
    //             } else console.log('Sale Date Not UPDATE')
    //         },
    //         (e) => console.log("Error in UPDATE Sale Date in Local database", e),
    //     );
    // });
}

export const SearchSaleByDate = (date) => {
    return async dispatch => {
        if (date == '' || date == null) {
            store.dispatch(ReadAllSales())
        } else {
            dispatch({ type: MAIN_LOADER, payload: true })
            const parse = JSON.stringify(date)
            const onlyDate = parse.split('T')[0] + '"'
            let onlineSale = await ReadALLWithOutPagination(`onlineSale where Created_At = ${onlyDate}`).then(res => {
                return res
            }).catch(e => console.log("ReadAllSales::", e))
            let allOnlineSale = await GetSaleProducts(onlineSale, 'onlineSaleItems', 'sale_id').then(res => { return res })
            let offlineSale = await ReadALLWithOutPagination('OfflineSale').then(res => {
                return res
            }).catch(e => console.log("ReadAllSales::", e))
            let allofflineSale = await GetSaleProducts(offlineSale, 'OfflineSaleItem', 'offlineSaleid').then(res => { return res })
            const combineSale = allofflineSale.reverse().concat(allOnlineSale.reverse())
            dispatch({ type: ALL_SALES, payload: combineSale })
            dispatch({ type: MAIN_LOADER, payload: false })
        }
    }
}

export const SearchByOrderNumber = (orderNumber) => {
    return async dispatch => {
        if (orderNumber == '' || orderNumber == null) {
            store.dispatch(ReadAllSales())
        }
        else {
            dispatch({ type: MAIN_LOADER, payload: true })
            console.log('orderNumber', orderNumber)
            let onlineSale = await ReadALLWithOutPagination(`onlineSale where order_no = ${orderNumber}`).then(res => {
                return res
            }).catch(e => {
                dispatch({ type: MAIN_LOADER, payload: false })
                console.log("SearchByOrderNumber::", e)
            })
            let allOnlineSale = await GetSaleProducts(onlineSale, 'onlineSaleItems', 'sale_id').then(res => { return res }).catch(e => {
                dispatch({ type: MAIN_LOADER, payload: false })
            })
            let offlineSale = await ReadALLWithOutPagination(`OfflineSale where id = ${orderNumber}`).then(res => {
                return res
            }).catch(e => {
                dispatch({ type: MAIN_LOADER, payload: false })
                console.log("SearchByOrderNumber offline::", e)
            })
            let allofflineSale = await GetSaleProducts(offlineSale, 'OfflineSaleItem', 'offlineSaleid').then(res => { return res }).catch(e => {
                dispatch({ type: MAIN_LOADER, payload: false })
            })
            const combineSale = allofflineSale.reverse().concat(allOnlineSale.reverse())
            dispatch({ type: ALL_SALES, payload: combineSale })
            dispatch({ type: MAIN_LOADER, payload: false })
        }
    }
}

export const ReturnSale = (DeletedItem, navigation, returnAmount , loader) => {
    return async dispatch => {
        const Sdata = {
            sale: store.getState().Sale.saleItems[0].sale,
            sale_items: DeletedItem
        }
        if (store.getState().Shared?.Internet) {
            let Alldata = await apiInstance.post(`return_order?id=${Sdata?.sale?.id}`, {
                data: Sdata,
                id: Sdata?.sale?.id,
                returnAmount:returnAmount
            }).then(function (response) {
                return response
            }).catch(function (error) {
                dispatch({ type: MAIN_LOADER, payload: false })
                ToastAndroid.showWithGravityAndOffset(
                    "Something Went wrong! Please try again later",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50,
                );
                return error.response
            })
            const { status, data } = Alldata
            if (status == 200) {
                for (let i = 0; i < data.return_sale_items.length; i++) {
                    let itemSavingDate = data.return_sale_items[i].created_at.split('T')[0]
                    db.transaction(function (tx) {
                        tx.executeSql(
                            'INSERT INTO onlinereturnShowitem ( server_id,sale_id, server_productid, name_fr, price_euro, quantity , quantity_added , Created_At) VALUES (?,?,?,?,?,?,?,?)',
                            [data.return_sale_items[i].id, data.return_sale.parent_sale_id, data.return_sale_items[i].product_id, data.return_sale_items[i].product_name, data.return_sale_items[i].unit_price, data.return_sale_items[i].quantity, data.return_sale_items[i].quantity, itemSavingDate],
                            (tx, results) => {
                                if (results.rowsAffected > 0) {
                                    console.log('onlinereturnShowitemItem Added')
                                } else alert('onlinereturnShowitem Item Not Added')
                            },
                            (e) => console.log("onlinereturnShowitem Error in Saving Sale Items in Local database", e),
                        );
                    });

                }
                store.dispatch(ReadAllSales())
                loader()
                navigation.navigate('Sales')
            }
        }
        else {
            try {
                if (DeletedItem[0]?.sale_id) {
                    db.transaction((tx) => {
                        tx.executeSql(
                            'INSERT INTO offlineReturnSale (id) VALUES (?)',
                            [DeletedItem[0].sale_id],
                            (tx, results) => {
                                if (results.rowsAffected > 0) {
                                    console.log('offlineReturnSale Added')
                                } else alert('offlineReturnSale Item Not Added')
                            },
                            (e) => console.log("offlineReturnSale ReturnSale in Local database", e),
                        );
                    });
                    for (let i = 0; i < DeletedItem.length; i++) {
                        let dates = new Date()
                        let itemSavingDate = JSON.stringify(dates).split('T')[0]
                        let formatteddate = itemSavingDate.substring(1)
                        console.log(formatteddate)
                        db.transaction((tx) => {
                            tx.executeSql(
                                'INSERT INTO offlinereturnShowitem ( server_id,sale_id, server_productid, name_fr, price_euro, quantity , quantity_added , Created_At) VALUES (?,?,?,?,?,?,?,?)',
                                [DeletedItem[i].server_id, DeletedItem[i].sale_id, DeletedItem[i].server_productid, DeletedItem[i].name_fr, DeletedItem[i].price_euro, DeletedItem[i].quantity, DeletedItem[i].quantity_added, formatteddate],
                                (tx, results) => {
                                    console.log("RRRRRRRRRR")
                                    if (results.rowsAffected > 0) {
                                        console.log('offlinereturnShowitem Added')
                                    } else alert('offlinereturnShowitem Item Not Added')
                                },
                                (e) => console.log("offlinereturnShowitem ReturnSale in Local database", e),
                            );
                        });
                    }
                } else {
                    for (let i = 0; i < DeletedItem.length; i++) {
                        let dates = new Date()
                        let itemSavingDate = JSON.stringify(dates).split('T')[0]
                        let formatteddate = itemSavingDate.substring(1)
                        console.log(formatteddate)
                        db.transaction((tx) => {
                            tx.executeSql(
                                'INSERT INTO offlinereturnShowitem ( sale_id, server_productid, name_fr, price_euro, quantity , quantity_added , Created_At) VALUES (?,?,?,?,?,?,?)',
                                [DeletedItem[i].offlineSaleid, DeletedItem[i].server_productid, DeletedItem[i].name_fr, DeletedItem[i].price_euro, DeletedItem[i].quantity, DeletedItem[i].quantity_added, formatteddate],
                                (tx, results) => {
                                    console.log("RRRRRRRRRR")
                                    if (results.rowsAffected > 0) {
                                        console.log('offlinereturnShowitem Added')
                                    } else alert('offlinereturnShowitem Item Not Added')
                                },
                                (e) => console.log("offlinereturnShowitem ReturnSale in Local database", e),
                            );
                        });
                    }
                }



                loader()
                navigation.navigate('Sales')
            } catch (error) { console.log("ERRR", error) }

        }

    }
}


// Get the Sale Formated data
export const GetSaleProducts = (allsale, tableName, checkid) => {
    return new Promise(async (resolve, reject) => {
        if (allsale.length == 0) {
            resolve([])
        }
        var orginal = []
        for (let i = 0; i < allsale.length; i++) {
            let returnitems = await ReadALLWithOutPagination(`onlinereturnShowitem where sale_id = ${allsale[i].id}`).then(res => {
                return res
            })
            if (checkid == 'sale_id') {
                var offlinereturnitems = await ReadALLWithOutPagination(`offlinereturnShowitem where sale_id = ${allsale[i].id}`).then(res => {
                    return res
                })
            } else {
                var offlinereturnitems = await ReadALLWithOutPagination(`offlinereturnShowitem where sale_id = ${allsale[i].id} AND server_id IS NULL`).then(res => {
                    return res
                })
            }

            const combinereturn = returnitems.concat(offlinereturnitems)
            db.transaction((tx) => {
                tx.executeSql(
                    `SELECT * FROM ${tableName} where ${checkid} = ?`,
                    [allsale[i].id],
                    async (tx, results) => {
                        let tempproduct = []
                        for (let k = 0; k < results.rows.length; k++) {
                            tempproduct.push(results.rows.item(k));
                        }
                        orginal.push({
                            sale_items: tempproduct,
                            sale: allsale[i],
                            return_sale_items: combinereturn
                        })
                        if (i == allsale.length - 1) {
                            resolve(orginal)
                        }
                    },
                    (e) => reject(e),
                )
            })
        }

    }
    )
}

// Get the Sale Formated data END