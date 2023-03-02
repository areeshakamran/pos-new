import { openDatabase } from 'react-native-sqlite-storage';
import {
  ALL_OFFLINE_DRAFTS_ITEMS,
  ALL_ONLINE_DRAFTS,
  ALL_ONLINE_DRAFTS_ITEMS,
  CHANGE_CART,
  CHANGE_PAGENUMBER_DRAFT,
  CHANGE_NEXTPAGE_DRAFT,
  MAIN_LOADER,
  CURRENT_TABLE_BOOKED,
} from './type';
import {
  ReadALLWithOutPagination,
  ReadALLWithPagination,
} from '../../Confiq/Helper';
import { apiInstance } from '../../Confiq/AxiosInstance';
import store from '..';
import { ToastAndroid } from 'react-native';
import { PaginationNumber } from '../../Confiq/Constant';
import { ReadAllTables } from './TableAction';

var db = openDatabase(
  { name: 'POS.db', location: 'default' },
  () => console.log('Draft Action Database '),
  e => console.log('Error ', e),
);

export const saveDraftToLocal = () => {
  db.transaction(async tx => {
    tx.executeSql('DELETE from onlineDraft');
    tx.executeSql('DELETE from onlineDraftItems');
    tx.executeSql('DELETE from offlineDraft');
    tx.executeSql('DELETE from offlineDraftItems');

    let Alldata = await apiInstance
      .get(`pos_product_by_cat`, {})
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        return error.response;
      });
    const { status, data } = Alldata;
    if (status == 200) {
      SaveDraftToLocally(data[0]?.all_drafts);
    } else {
      console.log('data: ', data);
    }
  });
};

function SaveDraftToLocally(data) {
  console.log("DDDDDDDDDDDDDDDDDDDDDD", data[0].draft_items)
  for (let i = 0; i < data.length; i++) {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO onlineDraft (id, order_no, item_count, total, discount, tax, grand_total, Status, Tabel_No) VALUES (?,?,?,?,?,?,?,?,?)',
        [
          data[i].draft.id,
          data[i].draft.order_no,
          data[i].draft.item_count,
          data[i].draft.total,
          data[i].draft.discount,
          data[i].draft.taxes,
          data[i].draft.grand_total,
          0,
          data[i].draft.table_no,
        ],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('onlineDraft Added');
            for (let j = 0; j < data[i].draft_items.length; j++) {
              db.transaction(function (tx) {
                tx.executeSql(
                  'INSERT INTO onlineDraftItems (draft_id, id, product_id, name_fr, price_euro, quantity , server_productid) VALUES (?,?,?,?,?,? ,?)',
                  [
                    data[i].draft_items[j].draft_id,
                    data[i].draft_items[j].id,
                    data[i].draft_items[j].product_id,
                    data[i].draft_items[j].name_fr,
                    data[i].draft_items[j].price_euro,
                    data[i].draft_items[j].quantity,
                    data[i].draft_items[j].product_id,
                  ],
                  (tx, results) => {
                    if (results.rowsAffected > 0) {
                      console.log('onlineDraftItems Added');
                    } else alert('onlineDraftItems Not Added');
                  },
                  e =>
                    console.log(
                      'Error in Saving onlineDraftItems in Local database',
                      e,
                    ),
                );
              });
            }
          } else alert('onlineDraft Not Added');
        },
        e => console.log('Error in Saving onlineDraft in Local database', e),
      );
    });
  }
  store.dispatch(ReadAllDrafts());
}

export const getMoreDraft = () => {
  return async dispatch => {
    if (store.getState()?.Draft?.NextPage) {
      let startfrom =
        PaginationNumber * store.getState()?.Draft?.pageNumber + 1;
      var query = `onlineDraft ORDER BY id DESC LIMIT ${startfrom},20`;
      let moreProduct = await ReadALLWithPagination(
        query,
        store.getState()?.Draft?.pageNumber + 1,
      ).then(res => {
        return res;
      });
      dispatch({
        type: CHANGE_PAGENUMBER_DRAFT,
        payload: store.getState()?.Draft?.pageNumber + 1,
      });
      const product = [...store.getState().Draft.allDrafts];
      const combine = product.concat(moreProduct);
      dispatch({ type: ALL_ONLINE_DRAFTS, payload: combine });
      if (moreProduct.length == 0) {
        dispatch({ type: CHANGE_NEXTPAGE_DRAFT, payload: false });
      }
    }
  };
};

export const ReadAllDrafts = (CartArray, table_number, readOnce) => {
  return async dispatch => {
    let onlineDraft = await ReadALLWithOutPagination(
      'onlineDraft ORDER BY id DESC LIMIT 0,20',
    ).then(res => {
      return res;
    });
    let onlineDraftItems = await ReadALLWithOutPagination(
      'onlineDraftItems',
    ).then(res => {
      return res;
    });
    let offlineDraft = await ReadALLWithOutPagination('offlineDraft').then(
      res => {
        return res;
      },
    );
    if (readOnce) {
      if (offlineDraft?.length > 0) {
        for (let i = 0; i < CartArray.length; i++) {
          db.transaction(function (tx) {
            tx.executeSql(
              'INSERT INTO offlineDraftItems (off_draft_id, catid, product_id, name_fr, price_euro, quantity, Tabel_No , server_productid) VALUES (?,?,?,?,?,?,?,?)',
              [
                offlineDraft[offlineDraft?.length - 1].id,
                CartArray[i].catid,
                CartArray[i].id,
                CartArray[i].name_fr,
                CartArray[i].price_euro,
                CartArray[i].quantity,
                table_number,
                CartArray[i].server_productid,
              ],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  console.log('offlineDraftItems Added');
                  dispatch({ type: CHANGE_CART, payload: [] });
                  if (table_number) {
                    store.dispatch(UpdateTableStatus(table_number, 1));
                  }
                  dispatch({ type: CURRENT_TABLE_BOOKED, payload: [] });
                } else alert('offlineDraftItems Not Added');
              },
              e =>
                console.log(
                  'Error in Saving onlineDraftItems in Local database',
                  e,
                ),
            );
          });
        }
      }
    }

    let offlineDraftItems = await ReadALLWithOutPagination(
      'offlineDraftItems',
    ).then(res => {
      return res;
    });

    const newDraftArray = offlineDraft.concat(onlineDraft);
    // newDraftArray.reverse();

    console.log('onlineDraft: ', onlineDraft.length);
    console.log('offlineDraft: ', offlineDraft.length);
    console.log('onlineDraftItems: ', onlineDraftItems.length);
    console.log('offlineDraftItems: ', offlineDraftItems.length);

    dispatch({ type: ALL_ONLINE_DRAFTS, payload: newDraftArray });
    dispatch({ type: ALL_ONLINE_DRAFTS_ITEMS, payload: onlineDraftItems });
    dispatch({ type: ALL_OFFLINE_DRAFTS_ITEMS, payload: offlineDraftItems });
  };
};

const deleteAPICall = item => {
  return new Promise(async (resolve, reject) => {
    let Alldata = await apiInstance
      .post(`remove_draft?id=${item.id}`, {})
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        ToastAndroid.showWithGravityAndOffset(
          'Items is not deleted in Draft, check your Internet Connectivity',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
        return error.response;
      });
    const { status, data } = Alldata;
    if (status == 200) {
      resolve(data);
    } else {
      reject(data);
    }
  });
};

export const sendtoCartFromDraft = (item, addOnlineInTable, AddToCartAgain) => {
  return async dispatch => {
    console.log('item: ', item);
    console.log('addOnlineInTable: ', addOnlineInTable);
    console.log('AddToCartAgain: ', AddToCartAgain);

    dispatch({ type: CHANGE_CART, payload: [] });

    var alOfflineDraftItems = [...store.getState().Draft.alOfflineDraftItems];
    var DraftSaleItems = [...store.getState().Draft.allOnlineDraftItems];

    if (item.Status == '1') {
      console.log('Offline Delete');

      let newArrayCart = alOfflineDraftItems.filter(
        obj => obj.off_draft_id == item.id,
      );

      db.transaction(function (tx) {
        tx.executeSql(
          `DELETE FROM offlineDraft WHERE id = ?`,
          [item.id],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log('Delete offlineDraft');
              for (let index = 0; index < newArrayCart.length; index++) {
                db.transaction(function (tx) {
                  tx.executeSql(
                    `DELETE FROM offlineDraftItems WHERE off_draft_id = ?`,
                    [newArrayCart[index].off_draft_id],
                    async (tx, results) => {
                      if (results.rowsAffected > 0) {
                        console.log('OfflineDraftItems Deleted');
                        if (AddToCartAgain) {
                          dispatch({ type: CHANGE_CART, payload: newArrayCart });
                        } else {
                          dispatch({ type: CHANGE_CART, payload: [] });
                        }
                      } else {
                        console.log('offlineDraftItems Not Deleted');
                      }
                    },
                    e => {
                      console.log(
                        'Error in Deleting offlineDraftItems in Local database',
                        e,
                      );
                    },
                  );
                });
              }
            } else {
              console.log('offlineDraft Not Delete');
            }
          },
          e => {
            console.log('Error in Delete offlineDraft in Local database', e);
          },
        );
      });
    } else {
      console.log('Online Delete');
      let newArrayCart = DraftSaleItems.filter(obj => obj.draft_id == item.id);
      console.log('newArrayCart: ', newArrayCart);
      console.log('item: ', item);

      db.transaction(function (tx) {
        tx.executeSql(
          `DELETE FROM onlineDraft WHERE id = ?`,
          [item.id],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log('Deleted onlineDraft');
              for (let index = 0; index < newArrayCart.length; index++) {
                db.transaction(function (tx) {
                  tx.executeSql(
                    `DELETE FROM onlineDraftItems WHERE draft_id = ?`,
                    [newArrayCart[index].draft_id],
                    async (tx, results) => {
                      if (results.rowsAffected > 0) {
                        console.log('Deleted onlineDraftItems');
                        if (addOnlineInTable) {
                          db.transaction(function (tx) {
                            tx.executeSql(
                              'INSERT INTO DeleteDraft (id) VALUES (?)',
                              [item.id],
                              (tx, results) => {
                                if (results.rowsAffected > 0) {
                                  console.log('Add Online Deleted Draft');
                                  if (AddToCartAgain) {
                                    dispatch({
                                      type: CHANGE_CART,
                                      payload: newArrayCart,
                                    });
                                  } else {
                                    dispatch({ type: CHANGE_CART, payload: [] });
                                  }
                                } else {
                                  console.log('Not Add Online Deleted Draft');
                                }
                              },
                              e => {
                                console.log(
                                  'Error in Adding Online Deleted Draft in Local database',
                                  e,
                                );
                              },
                            );
                          });
                        } else {
                          if (index == 0) {
                            await deleteAPICall(item)
                              .then(res => {
                                console.log(
                                  'Success deleted of draft from api: ',
                                  res,
                                );
                                if (AddToCartAgain) {
                                  dispatch({
                                    type: CHANGE_CART,
                                    payload: newArrayCart,
                                  });
                                } else {
                                  dispatch({ type: CHANGE_CART, payload: [] });
                                }
                              })
                              .catch(e => {
                                console.log(
                                  'not success delete of draft from api',
                                  e,
                                );
                              });
                          }
                        }
                      } else {
                        console.log('onlineDraftItems Not Deleted');
                      }
                    },
                    e => {
                      console.log(
                        'Error in Deleting onlineDraftItems in Local database',
                        e,
                      );
                    },
                  );
                });
              }
            } else {
              console.log('onlineDraft Not Deleted');
            }
          },
          e => {
            console.log('Error in Deletng onlineDraft in Local database', e);
          },
        );
      });
    }

    if (item.Tabel_No != null) {
      store.dispatch(UpdateTableStatus(item.Tabel_No, 0));
    }
    await store.dispatch(ReadAllDrafts());
  };
};

function SaveDraftToLocallyAgain(data) {
  console.log(
    data[data.length - 1].draft.table_no,
    'data[data.length - 1].draft.table_no',
  );
  db.transaction(function (tx) {
    tx.executeSql(
      'INSERT INTO onlineDraft (id, order_no, item_count, total, discount, tax, grand_total, Status, Tabel_No) VALUES (?,?,?,?,?,?,?,?,?)',
      [
        data[data.length - 1].draft.id,
        data[data.length - 1].draft.order_no,
        data[data.length - 1].draft.item_count,
        data[data.length - 1].draft.total,
        data[data.length - 1].draft.discount,
        data[data.length - 1].draft.taxes,
        data[data.length - 1].draft.grand_total,
        0,
        data[data.length - 1].draft.table_no,
      ],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log('onlineDraft Added');
          for (let j = 0; j < data[data.length - 1].draft_items.length; j++) {
            db.transaction(function (tx) {
              tx.executeSql(
                'INSERT INTO onlineDraftItems (draft_id, id, product_id, name_fr, price_euro, quantity, Tabel_No , server_productid) VALUES (?,?,?,?,?,?,?,?)',
                [
                  data[data.length - 1].draft_items[j].draft_id,
                  data[data.length - 1].draft_items[j].id,
                  data[data.length - 1].draft_items[j].product_id,
                  data[data.length - 1].draft_items[j].name_fr,
                  data[data.length - 1].draft_items[j].price_euro,
                  data[data.length - 1].draft_items[j].quantity,
                  data[data.length - 1].draft.table_no,
                  data[data.length - 1].draft_items[j].product_id,
                ],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    console.log('onlineDraftItems Added');
                  } else alert('onlineDraftItems Not Added');
                },
                e =>
                  console.log(
                    'Error in Saving onlineDraftItems in Local database',
                    e,
                  ),
              );
            });
          }
        } else alert('onlineDraft Not Added');
      },
      e => console.log('Error in Saving onlineDraft in Local database', e),
    );
  });
  store.dispatch(ReadAllDrafts());
}

export const DraftAPI = () => {
  return async dispatch => {
    var CartArray = [...store.getState().Cart.cart];
    var TableArray = [...store.getState().Table.currentTable];
    let Alldata = await apiInstance
      .post(`make_draft_order`, {
        cart_items: CartArray,
        table_no: TableArray.length ? TableArray[0].table_no : null,
      })
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        return error.response;
      });

    const { status, data } = Alldata;
    if (status == 200) {
      dispatch({ type: CHANGE_CART, payload: [] });
      console.log(
        'Draft Added API Success: ',
        data.drafts[data.drafts.length - 1],
      );
      SaveDraftToLocallyAgain(data.drafts);

      if (TableArray.length > 0) {
        store.dispatch(UpdateTableStatus(TableArray[0].table_no, 1));
      }
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'Items are not added in Draft, check your Internet Connectivity',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      console.log('Draft not Added');
    }
  };
};

const UpdateTableStatus = (id, booking_Status) => {
  return dispatch => {
    db.transaction(function (tx) {
      tx.executeSql(
        'UPDATE Dinning SET Booked = ? WHERE table_no = ? ',
        [booking_Status, id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('Sale History UPDATE');
          } else console.log('Sale History Not UPDATE');
        },
        e => console.log('Error in UPDATE Sale History in Local database', e),
      );
    });

    dispatch({ type: CURRENT_TABLE_BOOKED, payload: [] });
    store.dispatch(ReadAllTables());
  };
};

export const AddDraftToOffDrafts = (tax, discount) => {
  return async dispatch => {
    var CartArray = [...store.getState().Cart.cart];
    var TableArray = [...store.getState().Table.currentTable];

    if (CartArray.length > 0) {
      var temp = 0;

      for (let index = 0; index < CartArray?.length; index++) {
        temp = CartArray[index].quantity * CartArray[index].price_euro + temp;
      }

      var NewDraftData = [
        {
          CartLength: CartArray.length,
          Total_Price: temp,
          item_tax: tax,
          item_discount: discount,
          grand_total: temp + tax + discount,
          table_no: TableArray.length ? TableArray[0].table_no : null,
        },
      ];

      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO offlineDraft (item_count, total, discount, tax, grand_total, Status, Tabel_No) VALUES (?,?,?,?,?,?,?)',
          [
            NewDraftData[0].CartLength,
            NewDraftData[0].Total_Price,
            NewDraftData[0].discount,
            NewDraftData[0].tax,
            NewDraftData[0].grand_total,
            1,
            NewDraftData[0].table_no,
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log('offlineDraft Added');
            } else alert('offlineDraft Not Added');
          },
          e => console.log('Error in Saving offlineDraft in Local database', e),
        );
      });
      store.dispatch(ReadAllDrafts(CartArray, NewDraftData[0].table_no, true));
    }
  };
};

export const SearchDataofDraft = Search => {
  return async dispatch => {
    if (Search == '' || Search == null) {
      dispatch({ type: CHANGE_NEXTPAGE_DRAFT, payload: 1 });
      await store.dispatch(ReadAllDrafts());
      dispatch({ type: CHANGE_NEXTPAGE_DRAFT, payload: false });
    } else {
      dispatch({ type: CHANGE_NEXTPAGE_DRAFT, payload: false });
      dispatch({ type: MAIN_LOADER, payload: true });

      let value = parseInt(Search);
      let onlineSale = await ReadALLWithOutPagination(
        `onlineDraft where id = ${value}`,
      )
        .then(res => {
          return res;
        })
        .catch(e => console.log('ReadAllSales::', e));

      let offlineDraft = await ReadALLWithOutPagination(
        `offlineDraft where id = ${value}`,
      )
        .then(res => {
          return res;
        })
        .catch(e => console.log('ReadAllSales::', e));

      console.log('Search onlineSale: ', onlineSale);
      console.log('Search offline: ', offlineDraft);

      if (onlineSale != undefined || offlineDraft != undefined) {
        var newArray = await onlineSale.concat(offlineDraft);
        console.log('searchResult: ', newArray);
        dispatch({ type: ALL_ONLINE_DRAFTS, payload: newArray });
      } else {
        dispatch({ type: ALL_ONLINE_DRAFTS, payload: [] });
      }
      dispatch({ type: MAIN_LOADER, payload: false });
    }
  };
};

export const BackSendtoDraftsToDatabase = () => {
  return async dispatch => {
    if (store.getState().User?.masterLogin) {
      dispatch({ type: MAIN_LOADER, payload: true });
      let DeleteDraft = await ReadALLWithOutPagination('DeleteDraft')
        .then(res => {
          return res;
        })
        .catch(e => console.log('DeleteDraft::', e));

      let offlineDraft = await ReadALLWithOutPagination('offlineDraft')
        .then(res => {
          return res;
        })
        .catch(e => console.log('DeleteDraft::', e));
      var data1 = [];

      if (offlineDraft.length > 0) {
        for (let index = 0; index < offlineDraft.length; index++) {
          await ReadALLWithOutPagination(
            `offlineDraftItems WHERE off_draft_id = ${offlineDraft[index].id}`,
          )
            .then(res => {
              data1.push({
                draft_items: res,
                table_no: offlineDraft[index]['Tabel_No'],
              });
            })
            .catch(e => console.log('DeleteDraft::', e));
        }

        if (data1.length > 0) {
          let Alldata = await apiInstance
            .post(`multiple_draft`, {
              data: data1,
            })
            .then(function (response) {
              return response;
            })
            .catch(function (error) {
              return error.response;
            });
          const { status, data } = Alldata;
          if (status == 200) {
            console.log('Successfully added draft', data.message);
            db.transaction(function (tx) {
              tx.executeSql('DELETE from offlineDraft');
              tx.executeSql('DELETE from offlineDraftItems');
            });
            SaveDraftToLocally(data?.drafts);
          }
          dispatch({ type: MAIN_LOADER, payload: false });
        } else {
          dispatch({ type: MAIN_LOADER, payload: false });
        }
      }

      if (DeleteDraft.length > 0) {
        let Alldata = await apiInstance
          .post(`bulk_remove_draft`, {
            data: DeleteDraft,
          })
          .then(function (response) {
            return response;
          })
          .catch(function (error) {
            return error.response;
          });
        const { status, data } = Alldata;
        if (status == 200) {
          console.log('DELETE Successfully from DeleteDraft', data);
          db.transaction(function (tx) {
            tx.executeSql('DELETE from DeleteDraft');
          });
          store.dispatch(ReadAllDrafts());
        }
        dispatch({ type: MAIN_LOADER, payload: false });
      } else {
        dispatch({ type: MAIN_LOADER, payload: false });
      }
    }
  };
};
