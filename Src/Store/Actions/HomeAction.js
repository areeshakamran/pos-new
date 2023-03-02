import AsyncStorage from '@react-native-async-storage/async-storage';
import { openDatabase } from 'react-native-sqlite-storage';
import store from '..';
import { apiInstance } from '../../Confiq/AxiosInstance';
import { PaginationNumber } from '../../Confiq/Constant';
import {
  ReadALLWithOutPagination,
  ReadALLWithPagination
} from '../../Confiq/Helper';
import { ReadAllDrafts, saveDraftToLocal } from './DraftAction';
import { ReadAllSales, saveSalesToLocal } from './SaleAction';
import {
  ReadAllTables,
  saveTableToLocal,
  SaveTableToLocally
} from './TableAction';
import {
  CHANGE_CASHIERS,
  CHANGE_CATEGORY,
  CHANGE_CATEGORYID,
  CHANGE_FEATURE_STATUS,
  CHANGE_INTERNET_STATUS,
  CHANGE_MASTER_LOGIN,
  CHANGE_NEXTPAGE,
  CHANGE_PAGENUMBER,
  CHANGE_PRODUCT,
  CHANGE_TAX,
  CHANGE_TEMP_PRODUCT,
  MAIN_LOADER
} from './type';

var db = openDatabase(
  {name: 'POS.db', location: 'default'},
  () => console.log('home Action Database '),
  e => console.log('Error ', e),
);

export const AfterLogin = item => {
  return async dispatch => {
    ReadALLWithOutPagination('Category')
      .then(res => {
        if (res?.length > 0) {
          // we already have a data from server in local database
          store.dispatch(ReadALLProductAndCategory());
          store.dispatch(ReadAllSales());
          store.dispatch(ReadAllTables());
          store.dispatch(ReadAllDrafts());
        } else {
          // we have to fetch all the data from database and store in local database
          SaveProductCategoryTOlocal();
          // saveSalesToLocal();
          saveTableToLocal();
          // saveDraftToLocal();
        }
      })
      .catch(e => console.log('Rejected', e));
  };
};

export const Refreshftn = () => {
  return async dispatch => {
    dispatch({type: MAIN_LOADER, payload: true});
    SaveProductCategoryTOlocal(dispatch);
  };
};

const SaveProductCategoryTOlocal = dispatch => {
  db.transaction(function (tx) {
    GetDataFromDataBase()
      .then(res => {
        productAndCategoryTOlocalDB(res[0].By_category, res[0].Tax);
        saveSalesToLocal();
        SaveTableToLocally(res[0].tables);
        saveDraftToLocal();
      })
      .catch(e => {
        dispatch({type: MAIN_LOADER, payload: false});
      });
  });
};

const GetDataFromDataBase = () => {
  return new Promise(async (resolve, reject) => {
    let Alldata = await apiInstance
      .get(`pos_product_by_cat`, {})
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        return error.response;
      });
    const {status, data} = Alldata;
    if (status == 200) {
      resolve(data);
    } else {
      reject(data);
    }
  });
};

function productAndCategoryTOlocalDB(data, taxdata) {
  db.transaction(function (tx) {
    tx.executeSql('DELETE from Category');
    tx.executeSql('DELETE from Product');
    tx.executeSql('DELETE from TaxData');
    tx.executeSql('DELETE from offlineReturnSale');
    tx.executeSql('DELETE from offlinereturnShowitem');
    tx.executeSql('DELETE from onlinereturnShowitem');
    for (let i = 0; i < data.length; i++) {
      tx.executeSql(
        'INSERT into Category (server_id, name_fr , image , isActive) VALUES (?,?,?,?)',
        [
          data[i].category.id,
          data[i].category.name_fr,
          data[i].category.image,
          data[i].category.isActive,
        ],
        (tx, results) => {
          if (results.rowsAffected > 0) {
          } else alert('Registration Failed');
        },
        e => console.log('Error in Saving Category in Local database', e),
      );

      for (let j = 0; j < data[i].products.length; j++) {
        tx.executeSql(
          'INSERT INTO Product (catid, name_fr , server_productid , price_euro , image , description , isActive , quantity , quantity_added , featured_item) VALUES (?,?,?,?,?,?,?,?,?,?)',
          [
            data[i].category.id,
            data[i].products[j].name_fr,
            data[i].products[j].id,
            data[i].products[j].price_euro,
            data[i].products[j].image,
            data[i].products[j].description,
            data[i].products[j].isActive,
            data[i].products[j].quantity,
            data[i].products[j].quantity_added,
            data[i].products[j].featured_item,
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
            } else alert('Registration Failed');
          },
          e => console.log('Error in Saving Product in Local database', e),
        );

        for (let k = 0; k < data[i].products[j].modifiers.length; k++) {
          const {id, name, price} = data[i].products[j].modifiers[k];
          tx.executeSql(
            'INSERT INTO Modifiers (server_id, name , price , Product_id) VALUES (?,?,?,?)',
            [id, name, price, data[i].products[j].id],
            (tx, results) => {
              if (results.rowsAffected > 0) {
              } else alert('Registration Failed');
            },
            e => console.log('Error in Saving modifiers in Local database', e),
          );
        }
      }
    }
    tx.executeSql(
      'INSERT into TaxData (id, tax) VALUES (?,?)',
      [taxdata.id, taxdata.tax],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log('TaxData Insterted');
        } else alert('TaxData Failed');
      },
      e => console.log('Error in Saving TaxData in Local database', e),
    );
  });
  store.dispatch(ReadALLProductAndCategory());
}

export const ReadALLProductAndCategory = () => {
  return async dispatch => {
    let category = await ReadALLWithOutPagination('Category').then(res => {
      return res;
    });
    const Product = await ReadALLWithPagination(
      'Product ORDER BY id LIMIT 0,20',
      1,
    ).then(res => {
      return res;
    });
    let taxdata = await ReadALLWithOutPagination('TaxData').then(res => {
      return res;
    });
    for (let i = 0; i < Product.length; i++) {
      let modifiers = await ReadALLWithOutPagination(
        `Modifiers where Product_id = ${Product[i].server_productid} `,
      ).then(res => {
        return res;
      });
      Product[i].modifiers = modifiers;
    }
    category.unshift({
      server_id: 'all',
      name_fr: 'ALL',
    });
    dispatch({type: CHANGE_CATEGORY, payload: category});
    dispatch({type: CHANGE_PRODUCT, payload: Product});
    dispatch({type: MAIN_LOADER, payload: false});
    dispatch({type: CHANGE_MASTER_LOGIN, payload: true});
    dispatch({type: CHANGE_TAX, payload: taxdata[0].tax});
  };
};

export const Readcashiers = () => {
  return async dispatch => {
    db.transaction(function (tx) {
      var cashiers = [];
      tx.executeSql(
        'SELECT * FROM cashiers',
        [],
        (tx, results) => {
          for (let i = 0; i < results.rows.length; ++i) {
            cashiers.push(results.rows.item(i));
          }
          dispatch({type: CHANGE_CASHIERS, payload: cashiers});
        },
        e => console.log('Readcashiers::::::::', e),
      );
    });
  };
};

export const ReopenApp = () => {
  return async dispatch => {
    const value = await AsyncStorage.getItem('login');
    if (value) {
      dispatch({type: CHANGE_MASTER_LOGIN, payload: true});
      store.dispatch(ReadALLProductAndCategory());
      store.dispatch(Readcashiers());
      store.dispatch(ReadAllSales());
      store.dispatch(ReadAllDrafts());
      store.dispatch(ReadAllTables());
    }
  };
};

export const getMoreProduct = () => {
  return async dispatch => {
    if (store.getState()?.Home?.NextPage) {
      let startfrom = PaginationNumber * store.getState()?.Home?.pageNumber + 1;
      if (store.getState()?.Home?.catid == 'all') {
        var query = `Product Product ORDER BY id LIMIT ${startfrom},20`;
      } else {
        var query = `Product where catid = ${
          store.getState()?.Home?.catid
        } ORDER BY id LIMIT ${startfrom},20`;
      }
      let moreProduct = await ReadALLWithPagination(
        query,
        store.getState()?.Home?.pageNumber + 1,
      ).then(res => {
        return res;
      });
      for (let i = 0; i < moreProduct.length; i++) {
        let modifiers = await ReadALLWithOutPagination(
          `Modifiers where Product_id = ${moreProduct[i].server_productid} `,
        ).then(res => {
          return res;
        });
        moreProduct[i].modifiers = modifiers;
      }
      dispatch({
        type: CHANGE_PAGENUMBER,
        payload: store.getState()?.Home?.pageNumber + 1,
      });
      const product = [...store.getState().Home.Product];
      const combine = product.concat(moreProduct);
      dispatch({type: CHANGE_PRODUCT, payload: combine});
      if (moreProduct.length == 0) {
        dispatch({type: CHANGE_NEXTPAGE, payload: false});
      }
    }
  };
};

export const changeCategoryANDgetProduct = catid => {
  return async dispatch => {
    dispatch({type: CHANGE_FEATURE_STATUS, payload: true});
    dispatch({type: CHANGE_TEMP_PRODUCT, payload: []});
    dispatch({type: CHANGE_PRODUCT, payload: []});
    if (catid == 'all') {
      var query = 'Product ORDER BY id LIMIT 0,20';
    } else {
      var query = `Product where catid = ${catid} ORDER BY id LIMIT 0,20`;
    }
    dispatch({type: CHANGE_PAGENUMBER, payload: 1});
    dispatch({type: CHANGE_NEXTPAGE, payload: true});
    dispatch({type: CHANGE_CATEGORYID, payload: catid});
    ReadALLWithPagination(query, 1).then(async res => {
      let Product = [...res];
      for (let i = 0; i < Product.length; i++) {
        console.log(Product[i].id);
        let modifiers = await ReadALLWithOutPagination(
          `Modifiers where Product_id = ${Product[i].server_productid} `,
        ).then(res => {
          return res;
        });
        Product[i].modifiers = modifiers;
      }
      dispatch({type: CHANGE_PRODUCT, payload: Product});
      if (Product.length == 0) {
        dispatch({type: CHANGE_NEXTPAGE, payload: false});
      }
    });
  };
};

export const SearchProduct = Search => {
  return async dispatch => {
    if (Search == '' || Search == null) {
      store.dispatch(changeCategoryANDgetProduct(store.getState().Home.catid));
    } else {
      var searchResult = [];
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM Product WHERE name_fr LIKE ?',
          [`%${Search}%`],
          (tx, results) => {
            for (let i = 0; i < results.rows.length; i++) {
              searchResult.push(results.rows.item(i));
            }
            dispatch({type: CHANGE_PRODUCT, payload: searchResult});
            dispatch({type: CHANGE_PAGENUMBER, payload: 1});
            dispatch({type: CHANGE_NEXTPAGE, payload: false});
          },
          e => console.log('SearchProduct', e),
        );
      });
    }
  };
};

export const FeatureProduct = () => {
  return async dispatch => {
    var featured = !store.getState().Home.featureStatus;
    console.log('Feature Product', featured, store.getState().Home.catid);
    if (!featured) {
      if (store.getState().Home.catid == 'all') {
        var query = 'Product WHERE featured_item = 1';
      } else {
        var query = `Product WHERE featured_item = 1 AND catid = ${
          store.getState().Home.catid
        }`;
      }
      let FeaturedProduct = await ReadALLWithOutPagination(query)
        .then(res => {
          return res;
        })
        .catch(e => console.log('FeatureProduct::', e));
      dispatch({
        type: CHANGE_TEMP_PRODUCT,
        payload: store.getState().Home.Product,
      });
      dispatch({type: CHANGE_PRODUCT, payload: FeaturedProduct});
      dispatch({type: CHANGE_NEXTPAGE, payload: false});
    } else {
      dispatch({
        type: CHANGE_PRODUCT,
        payload: store.getState().Home.tempProduct,
      });
      dispatch({type: CHANGE_TEMP_PRODUCT, payload: []});
      dispatch({type: CHANGE_NEXTPAGE, payload: true});
    }
    dispatch({type: CHANGE_FEATURE_STATUS, payload: featured});
  };
};

export const Internet = val => {
  return async dispatch => {
    dispatch({type: CHANGE_INTERNET_STATUS, payload: val});
  };
};

// Call this function when POS system connect to interent
export const BackToOnline = () => {
  return async dispatch => {
    if (store.getState().User?.masterLogin) {
      // dispatch({ type: MAIN_LOADER, payload: true })
      multiplySaleSend(dispatch);
      sendSaleReturnData(dispatch);
    }
  };
};

export const getformateddata = allsale => {
  return new Promise(async (resolve, reject) => {
    var orginal = [];
    for (let i = 0; i < allsale.length; i++) {
      let all = await GetSaleProduct(i, allsale).then(res => {
        return res;
      });
      let offlinereturnitems = await ReadALLWithOutPagination(
        `offlinereturnShowitem where sale_id = ${allsale[i].id} AND server_id IS NULL`,
      ).then(res => {
        return res;
      });
      all['return_sale_items'] = offlinereturnitems;
      orginal.push(all);
    }
    resolve(orginal);
  });
};

export const GetSaleProduct = (i, allsale) => {
  return new Promise(async (resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM OfflineSaleItem where offlineSaleid = ?',
        [allsale[i].id],
        async (tx, results) => {
          let tempproduct = [];
          for (let k = 0; k < results.rows.length; k++) {
            let product = {...results.rows.item(k)};
            const readModifiers = await ReadALLWithOutPagination(
              `offlineModifiers where offlineSaleid = ${
                results.rows.item(k).offlineSaleid
              } AND server_productid = ${
                results.rows.item(k).server_productid
              }`,
            ).then(res => {
              return res;
            });
            product['ModifiersAdded'] = readModifiers;
            tempproduct.push(product);
          }
          let hoja = {
            sale_items: tempproduct,
            customer_pay: allsale[i].customer_pay,
            coupon: allsale[i].coupon,
            discount: allsale[i].discount,
            tax: allsale[i].tax,
            return: allsale[i].tax,
          };

          resolve(hoja);
        },
        e => reject(e),
      );
    });
  });
};

// BacktoOnline

const multiplySaleSend = async dispatch => {
  let offlineSale = await ReadALLWithOutPagination('OfflineSale')
    .then(res => {
      return res;
    })
    .catch(e => console.log('FeatureProduct::', e));

  let allSale = await getformateddata(offlineSale).then(res => {
    return res;
  });
  if (allSale.length > 0) {
    let Alldata = await apiInstance
      .post(`multiple_sales`, {
        data: allSale,
      })
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        return error.response;
      });
    const {status, data} = Alldata;
    if (status == 200) {
      db.transaction(function (tx) {
        tx.executeSql('DELETE from OfflineSale');
        tx.executeSql('DELETE from offlineModifiers');
        tx.executeSql('DELETE from OfflineSaleItem');
        for (let i = 0; i < data?.latest_sales?.length; i++) {
          tx.executeSql(
            'INSERT INTO onlineSale (id, total, order_no, Created_At, customer_pay, return , discount , coupon , tax) VALUES (?,?,?,?,?,?,?,?,? )',
            [
              data.latest_sales[i].id,
              data.latest_sales[i].grand_total,
              data.latest_sales[i].order_no,
              data.latest_sales[i].created_at,
              data.latest_sales[i].customer_pay,
              data.latest_sales[i].return,
              data.latest_sales[i].discount,
              data.latest_sales[i].coupon,
              data.latest_sales[i].taxes,
            ],
            (tx, results) => {
              if (results.rowsAffected > 0) {
                console.log('onlineSale Addedddddddddddddddddddddd');
              } else alert('onlineSale Not Added');
            },
            e =>
              console.log('Error in Saving  Sale History in Local database', e),
          );
          for (let z = 0; z < data?.latest_sales[i]?.sale_items.length; z++) {
            db.transaction(function (tx) {
              tx.executeSql(
                'INSERT INTO onlineSaleItems (server_id, sale_id, server_productid, name_fr, price_euro, quantity , quantity_added , Created_At) VALUES (?,?,?,?,?,?,?,?)',
                [
                  data?.latest_sales[i].sale_items[z].id,
                  data?.latest_sales[i].sale_items[z].sale_id,
                  data?.latest_sales[i].sale_items[z].product_id,
                  data?.latest_sales[i].sale_items[z].product_name,
                  data?.latest_sales[i].sale_items[z].unit_price,
                  data?.latest_sales[i].sale_items[z].quantity,
                  data?.latest_sales[i].sale_items[z].quantity,
                  data?.latest_sales[i].sale_items[z].created_at,
                ],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    console.log('onlineSaleItems Item Added');
                  } else alert('onlineSaleItems Item Not Added');
                },
                e =>
                  console.log(
                    'backtonline in Saving Sale Items in Local database',
                    e,
                  ),
              );
            });
          }
          try {
            for (
              let k = 0;
              k < data?.latest_sales[i].return_sale_items.length;
              k++
            ) {
              let itemSavingDate =
                data?.latest_sales[i].return_sale_items[k].created_at.split(
                  'T',
                )[0];
              console.log(
                data?.latest_sales[i].return_sale_items[k].id,
                data?.latest_sales[i].return_sale_items[k].sale_id,
                data?.latest_sales[i].return_sale_items[k].product_id,
                data?.latest_sales[i].return_sale_items[k].product_name,
                data?.latest_sales[i].return_sale_items[k].unit_price,
                data?.latest_sales[i].return_sale_items[k].quantity,
                data?.latest_sales[i].return_sale_items[k].quantity,
                itemSavingDate,
              );
              db.transaction(function (tx) {
                tx.executeSql(
                  'INSERT INTO onlinereturnShowitem ( server_id,sale_id, server_productid, name_fr, price_euro, quantity , quantity_added , Created_At) VALUES (?,?,?,?,?,?,?,?)',
                  [
                    data?.latest_sales[i].return_sale_items[k].id,
                    data?.latest_sales[i].id,
                    data?.latest_sales[i].return_sale_items[k].product_id,
                    data?.latest_sales[i].return_sale_items[k].product_name,
                    data?.latest_sales[i].return_sale_items[k].unit_price,
                    data?.latest_sales[i].return_sale_items[k].quantity,
                    data?.latest_sales[i].return_sale_items[k].quantity,
                    itemSavingDate,
                  ],
                  (tx, results) => {
                    if (results.rowsAffected > 0) {
                      console.log('onlinereturnShowitemItem Added');
                    } else alert('onlinereturnShowitem Item Not Added');
                  },
                  e =>
                    console.log(
                      'onlinereturnShowitem Error in Saving Sale Items in Local database',
                      e,
                    ),
                );
              });
            }
          } catch (error) {
            console.log('###################', error);
          }
        }
        store.dispatch(ReadAllSales());
      });
    }
  }
};

const sendSaleReturnData = async () => {
  let allreturnsale = await ReadALLWithOutPagination('offlineReturnSale')
    .then(res => {
      return res;
    })
    .catch(e => console.log('FeatureProduct::', e));
  let serverReturnSale = [];
  for (let i = 0; i < allreturnsale.length; i++) {
    let offlinereturnitems = await ReadALLWithOutPagination(
      `offlinereturnShowitem where sale_id = ${allreturnsale[i].id}`,
    ).then(res => {
      return res;
    });
    serverReturnSale.push({
      sale: allreturnsale[i],
      return_sale_items: offlinereturnitems,
    });
  }
  let Alldata = await apiInstance
    .post(`pos_offline_return_sales`, {
      data: serverReturnSale,
    })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error.response;
    });
  const {status, data} = Alldata;
  if (status == 200) {
    for (let i = 0; i < data?.return_sales.length; i++) {
      for (let j = 0; j < data?.return_sales[i]?.return_sale_item.length; j++) {
        let itemSavingDate =
          data?.return_sales[i]?.return_sale_item[j].created_at.split('T')[0];
        db.transaction(function (tx) {
          tx.executeSql(
            'INSERT INTO onlinereturnShowitem ( server_id,sale_id, server_productid, name_fr, price_euro, quantity , quantity_added , Created_At) VALUES (?,?,?,?,?,?,?,?)',
            [
              data?.return_sales[i]?.return_sale_item[j].id,
              data?.return_sales[i]?.parent_sale_id,
              data?.return_sales[i]?.return_sale_item[j].product_id,
              data?.return_sales[i]?.return_sale_item[j].product_name,
              data?.return_sales[i]?.return_sale_item[j].unit_price,
              data?.return_sales[i]?.return_sale_item[j].quantity,
              data?.return_sales[i]?.return_sale_item[j].quantity_added,
              itemSavingDate,
            ],
            (tx, results) => {
              if (results.rowsAffected > 0) {
                console.log(
                  'onlinereturnShowitemmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm Added',
                );
              } else alert('onlinereturnShowitem Item Not Added');
            },
            e =>
              console.log(
                'onlinereturnShowitem Error in Saving Sale Items in Local database',
                e,
              ),
          );
        });
      }
    }
    db.transaction(function (tx) {
      tx.executeSql('DELETE from offlinereturnShowitem');
      tx.executeSql('DELETE from offlineReturnSale');
    });
  }
};
