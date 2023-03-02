import moment from 'moment';
import { ToastAndroid } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import {
  ColumnAliment,
  COMMANDS, USBPrinter
} from 'react-native-thermal-receipt-printer-image-qr';
import store from '..';
import { apiInstance } from '../../Confiq/AxiosInstance';
import { NumberFormat } from '../../Confiq/Helper';
import {
  ALL_SALES, CHANGE_CART, CHANGE_COUPON, CHANGE_COUPON_TYPE, CHANGE_CUSTOMER_PAY, CHANGE_LOADER, CHANGE_PAYMENT_TYPE, CHANGE_TOTAL
} from './type';
import { Buffer } from 'buffer'

var db = openDatabase(
  { name: 'POS.db', location: 'default' },
  () => console.log('home Action Database '),
  e => console.log('Error ', e),
);

export const AddtoCart = item => {
  return async dispatch => {
    let AlreadyCart = [...store.getState().Cart.cart];
    if (AlreadyCart.length == 0) {
      let tempItem = { ...item };
      tempItem.quantity = 1;
      dispatch({ type: CHANGE_CART, payload: [tempItem] });
    } else {
      const availableIndex = AlreadyCart.findIndex(obj => obj?.id == item.id);
      if (availableIndex == -1) {
        item.quantity = 1;
        AlreadyCart.push(item);
        dispatch({ type: CHANGE_CART, payload: AlreadyCart });
      } else {
        AlreadyCart[availableIndex].quantity =
          AlreadyCart[availableIndex].quantity + 1;
        if (item?.ModifiersAdded) {
          AlreadyCart[availableIndex].ModifiersAdded = item?.ModifiersAdded
        }
        dispatch({ type: CHANGE_CART, payload: AlreadyCart });
      }
    }
  };
};

export const DeleteAllCart = () => {
  return async dispatch => {
    dispatch({ type: CHANGE_CART, payload: [] });
    dispatch({ type: CHANGE_COUPON_TYPE, payload: '' });
    dispatch({ type: CHANGE_COUPON, payload: 0 });
  };
};

export const IncreaseAndMinusQuantity = (id, quantity) => {
  return async dispatch => {
    const findIndex = store.getState().Cart.cart.findIndex(obj => obj.id == id);
    if (findIndex != -1) {
      let data = [...store.getState().Cart.cart];
      if (quantity != 0) {
        data[findIndex].quantity = quantity;
        dispatch({ type: CHANGE_CART, payload: data });
      } else {
        const newArray = store.getState().Cart.cart.filter(obj => obj.id != id);
        dispatch({ type: CHANGE_CART, payload: newArray });
      }
    }
  };
};

export const DeleteItemFromCart = id => {
  return async dispatch => {
    let data = [...store.getState().Cart.cart];
    const remaining = data.filter(obj => obj.id != id);
    dispatch({ type: CHANGE_CART, payload: remaining });
  };
};

export const IncreaseQuantity = id => {
  return async dispatch => {
    const findIndex = store.getState().Cart.cart.findIndex(obj => obj.id == id);
    if (findIndex != -1) {
      let data = [...store.getState().Cart.cart];
      if (data[findIndex].quantity != 1) {
        data[findIndex].quantity = data[findIndex].quantity + 1;
        dispatch({ type: CHANGE_CART, payload: data });
      }
    }
  };
};

export const addModifiers = (item, product) => {
  return async dispatch => {
    let Cart = [...store.getState().Cart.cart];
    const findIndex = store
      .getState()
      .Cart.cart.findIndex(
        obj => obj.server_productid == product.server_productid,
      );
    if (findIndex != -1) {
      Cart[findIndex].ModifiersAdded = item;
    }
    dispatch({ type: CHANGE_CART, payload: Cart });
  };
};

export const payamount = (discount, tax, couponamount, navigation) => {
  return async dispatch => {
    dispatch({ type: CHANGE_LOADER, payload: true });
    if (store.getState().Shared.Internet) {
      dispatch({ type: CHANGE_LOADER, payload: true });
      let Alldata = await apiInstance
        .post(`pos_placeorder`, {
          sale_items: store.getState().Cart?.cart,
          customer_pay: store.getState().Cart.customerpay,
          return:
            store.getState().Cart.customerpay - store.getState().Cart.total,
          discount: discount,
          coupon: couponamount,
          tax: tax,
        })
        .then(function (response) {
          return response;
        })
        .catch(function (error) {
          return error.response;
        });
      const { status, data } = Alldata;
      dispatch({ type: CHANGE_LOADER, payload: false });
      console.log('status', status);
      console.log('data', data);

      if (status == 200) {
        db.transaction(function (tx) {
          tx.executeSql(
            'INSERT INTO onlineSale (id, total, order_no, Created_At, customer_pay, return , discount , coupon , tax) VALUES (?,?,?,?,?,?,?,?,? )',
            [
              data.sale.id,
              data.sale.grand_total,
              data.sale.order_no,
              data.sale.created_at,
              data.sale.customer_pay,
              data.sale.return,
              data.sale.discount,
              data.sale.coupon,
              data.sale.taxes,
            ],
            (tx, results) => {
              if (results.rowsAffected > 0) {
                console.log('Sale History Addedddddddddddddddddddddd');
              } else alert('Sale History Not Added');
            },
            e =>
              console.log('Error in Saving  Sale History in Local database', e),
          );
        });
        for (let z = 0; z < data.sale_items.length; z++) {
          db.transaction(function (tx) {
            tx.executeSql(
              'INSERT INTO onlineSaleItems ( server_id , sale_id, server_productid, name_fr, price_euro, quantity , quantity_added , Created_At) VALUES (?,?,?,?,?,?,?,?)',
              [
                data.sale_items[z].id,
                data.sale_items[z].sale_id,
                data.sale_items[z].product_id,
                data.sale_items[z].product_name,
                data.sale_items[z].unit_price,
                data.sale_items[z].quantity,
                data.sale_items[z].quantity,
                Date.now(),
              ],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  console.log('onlineSaleItems Item Added');
                } else alert('onlineSaleItems Item Not Added');
              },
              e =>
                console.log('Error in Saving Sale Items in Local database', e),
            );
          });
        }
        const reduxsale = [...store.getState().Sale?.sales];
        reduxsale.unshift(data);
        dispatch({ type: ALL_SALES, payload: reduxsale });
        // dispatch({ type: CHANGE_CART, payload: [] })
        // dispatch({ type: CHANGE_LOADER, payload: false })
        // dispatch({ type: CHANGE_CUSTOMER_PAY, payload: '' })
        // dispatch({ type: CHANGE_TOTAL, payload: '' })
        // dispatch({ type: CHANGE_COUPON, payload: 0 })
        // dispatch({ type: CHANGE_COUPON_TYPE, payload: '' })

        try {
          await USBPrinter.init().then(async () => {
            await USBPrinter.getDeviceList()
              .then(async res => {
                await connectPrinter(
                  res,
                  discount,
                  tax,
                  couponamount,
                  navigation,
                  dispatch,
                  data?.sale?.order_no,
                );
              })
              .catch(e => {
                dispatch({ type: CHANGE_CART, payload: [] });
                dispatch({ type: CHANGE_LOADER, payload: false });
                dispatch({ type: CHANGE_CUSTOMER_PAY, payload: '' });
                dispatch({ type: CHANGE_TOTAL, payload: '' });
                dispatch({ type: CHANGE_COUPON, payload: 0 });
                dispatch({ type: CHANGE_COUPON_TYPE, payload: '' });
              });
          });
        } catch (error) {
          // dispatch({ type: CHANGE_CART, payload: [] })
          // dispatch({ type: CHANGE_LOADER, payload: false })
          // dispatch({ type: CHANGE_CUSTOMER_PAY, payload: '' })
          // dispatch({ type: CHANGE_TOTAL, payload: '' })
          // dispatch({ type: CHANGE_COUPON, payload: 0 })
          // dispatch({ type: CHANGE_COUPON_TYPE, payload: '' })
          // ToastAndroid.showWithGravityAndOffset(
          //     error,
          //     ToastAndroid.LONG,
          //     ToastAndroid.BOTTOM,
          //     25,
          //     50,
          // );
        }
      } else {
        ToastAndroid.showWithGravityAndOffset(
          'Something Went Wrong! Please Try again Later',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
    } else {
      dispatch({ type: CHANGE_LOADER, payload: true });
      var Datecreated = new Date();
      const start = Datecreated.toString();
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT into OfflineSale (total , Created_At, customer_pay , return , discount ,coupon , tax) VALUES (?,?,?,?,?,?,?)',
          [
            store.getState().Cart.total,
            start,
            store.getState().Cart.customerpay,
            store.getState().Cart.customerpay - store.getState().Cart.total,
            discount,
            couponamount,
            tax,
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              var offlinesaleid = results.insertId;
              let firstsale = {
                sale: {
                  total: store.getState().Cart.total,
                  Created_At: start,
                  customer_pay: store.getState().Cart.customerpay,
                  return:
                    store.getState().Cart.customerpay -
                    store.getState().Cart.total,
                  discount: discount,
                  coupon: 0,
                  tax: tax,
                  id: offlinesaleid,
                },
                sale_items: store.getState().Cart?.cart,
              };
              const reduxsale = [...store.getState().Sale?.sales];
              reduxsale.unshift(firstsale);
              dispatch({ type: ALL_SALES, payload: reduxsale });
              for (let i = 0; i < store.getState().Cart?.cart.length; i++) {
                const {
                  catid,
                  quantity,
                  quantity_added,
                  price_euro,
                  name_fr,
                  server_productid,
                } = store.getState().Cart?.cart[i];
                tx.executeSql(
                  'INSERT into OfflineSaleItem (server_productid , catid, offlineSaleid , name_fr , price_euro ,quantity , quantity_added , Created_At) VALUES (?,?,?,?,?,?,?,?)',
                  [
                    server_productid,
                    catid,
                    offlinesaleid,
                    name_fr,
                    price_euro,
                    quantity,
                    quantity_added,
                    start,
                  ],
                  (tx, results) => {
                    if (results.rowsAffected > 0) {
                      console.log('sales insterteddddddd');
                    } else alert('Registration Failed');
                  },
                  e =>
                    console.log(
                      'Error in Saving Category in Local database',
                      e,
                    ),
                );
                if (store.getState().Cart?.cart[i]?.ModifiersAdded) {
                  for (
                    let k = 0;
                    k < store.getState().Cart?.cart[i]?.ModifiersAdded.length;
                    k++
                  ) {
                    const { Product_id, name, price, server_id } =
                      store.getState().Cart?.cart[i].ModifiersAdded[k];
                    tx.executeSql(
                      'INSERT INTO offlineModifiers (server_productid, price , name , server_id , offlineSaleid) VALUES (?,?,?,?,?)',
                      [Product_id, price, name, server_id, offlinesaleid],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                          console.log(
                            'Modifiers Insertedyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
                          );
                        } else alert('offlineModifiers Failed');
                      },
                      e =>
                        console.log(
                          'Error in Saving offlineModifiers in Local database',
                          e,
                        ),
                    );
                  }
                }
              }

              try {
                USBPrinter.init().then(async () => {
                  USBPrinter.getDeviceList()
                    .then(async res => {
                      connectPrinter(
                        res,
                        discount,
                        tax,
                        couponamount,
                        navigation,
                        dispatch,
                        offlinesaleid,
                      );
                    })
                    .catch(e => {
                      dispatch({ type: CHANGE_CART, payload: [] });
                      dispatch({ type: CHANGE_LOADER, payload: false });
                      dispatch({ type: CHANGE_CUSTOMER_PAY, payload: '' });
                      dispatch({ type: CHANGE_TOTAL, payload: '' });
                      dispatch({ type: CHANGE_COUPON, payload: 0 });
                      dispatch({ type: CHANGE_COUPON_TYPE, payload: '' });
                    });
                });
              } catch (error) {
                // dispatch({ type: CHANGE_CART, payload: [] })
                // dispatch({ type: CHANGE_LOADER, payload: false })
                // dispatch({ type: CHANGE_CUSTOMER_PAY, payload: '' })
                // dispatch({ type: CHANGE_TOTAL, payload: '' })
                // dispatch({ type: CHANGE_COUPON, payload: 0 })
                // dispatch({ type: CHANGE_COUPON_TYPE, payload: '' })
                // ToastAndroid.showWithGravityAndOffset(
                //     error,
                //     ToastAndroid.LONG,
                //     ToastAndroid.BOTTOM,
                //     25,
                //     50,
                // );
              }
              // navigation.goBack()
            } else {
              dispatch({ type: CHANGE_LOADER, payload: false });
            }
          },
          e => {
            dispatch({ type: CHANGE_LOADER, payload: false });
            console.log('Error in Saving Category in Local database', e);
          },
        );
      });
    }
  };
};

const connectPrinter = async (
  printer,
  discount,
  tax,
  couponamount,
  navigation,
  dispatch,
  Order_No,
) => {
  if (printer.length > 0) {
    try {
      await USBPrinter.connectPrinter(
        printer[0].vendor_id,
        printer[0].product_id,
      )
        .then(async res => {
          let array = [];

          for (
            let index = 0;
            index < store.getState().Cart?.cart.length;
            index++
          ) {
            array.push([
              JSON.stringify(store.getState().Cart?.cart[index].quantity),
              store.getState().Cart?.cart[index].name_fr,
              (
                parseFloat(store.getState().Cart?.cart[index].price_euro) *
                parseFloat(store.getState().Cart?.cart[index].quantity)
              ).toFixed(2),
            ]);
          }
          await handlePrintBill(
            array,
            store.getState().Cart?.cart?.length,
            store.getState().Cart?.total,
            store.getState().Cart?.customerpay,
            discount,
            couponamount,
            tax,
            Order_No,
          );
          const openDrawerBuffer = new Buffer(
            ['\u001B', '\u0070', '\u0000', '\u0025', '\u0250'].join('')
          );
          USBPrinter.printRaw(openDrawerBuffer.toString('base64'));
          dispatch({ type: CHANGE_CART, payload: [] });
          dispatch({ type: CHANGE_LOADER, payload: false });
          dispatch({ type: CHANGE_CUSTOMER_PAY, payload: '' });
          dispatch({ type: CHANGE_TOTAL, payload: '' });
          dispatch({ type: CHANGE_COUPON, payload: 0 });
          dispatch({ type: CHANGE_COUPON_TYPE, payload: '' });
        })
        .catch(e => {
          dispatch({ type: CHANGE_CART, payload: [] });
          dispatch({ type: CHANGE_LOADER, payload: false });
          dispatch({ type: CHANGE_CUSTOMER_PAY, payload: '' });
          dispatch({ type: CHANGE_TOTAL, payload: '' });
          dispatch({ type: CHANGE_COUPON, payload: 0 });
          dispatch({ type: CHANGE_COUPON_TYPE, payload: '' });

          ToastAndroid.showWithGravityAndOffset(
            e,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        });
    } catch (error) {
      dispatch({ type: CHANGE_CART, payload: [] });
      dispatch({ type: CHANGE_LOADER, payload: false });
      dispatch({ type: CHANGE_CUSTOMER_PAY, payload: '' });
      dispatch({ type: CHANGE_TOTAL, payload: '' });
      dispatch({ type: CHANGE_COUPON, payload: 0 });
      dispatch({ type: CHANGE_COUPON_TYPE, payload: '' });

      ToastAndroid.showWithGravityAndOffset(
        error,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  } else {
    dispatch({ type: CHANGE_CART, payload: [] });
    dispatch({ type: CHANGE_LOADER, payload: false });
    dispatch({ type: CHANGE_CUSTOMER_PAY, payload: '' });
    dispatch({ type: CHANGE_TOTAL, payload: '' });
    dispatch({ type: CHANGE_COUPON, payload: 0 });
    dispatch({ type: CHANGE_COUPON_TYPE, payload: '' });

    ToastAndroid.showWithGravityAndOffset(
      'Printer List No Found',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }
};

const handlePrintBill = async (
  array1,
  Product_Lenght,
  total,
  customer_pay,
  discount,
  couponamount,
  tax,
  Order_No,
) => {
  console.log('Order_No: ', Order_No);
  const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
  const TXT_FONT_A = COMMANDS.TEXT_FORMAT.TXT_FONT_A;
  const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
  const CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT;
  const CASH_DRAWER = COMMANDS.CASH_DRAWER.CD_KICK_5;
  const CASH_DRAWER_KICK = COMMANDS.CASH_DRAWER.CD_KICK_2;
  const TEXT_CUSTOM_SIZE = COMMANDS.TEXT_FORMAT.TXT_CUSTOM_SIZE(2.5, 1.5);

  let orderList = array1;
  let columnAliment = [
    ColumnAliment.LEFT,
    ColumnAliment.LEFT,
    ColumnAliment.RIGHT,
  ];
  let columnWidth = [46 - (28 + 12), 28, 10];
  // let columnWidth = [46 - (28 + 12), 28, 12]
  let columnAlimentTotal = [ColumnAliment.LEFT, ColumnAliment.RIGHT];
  let columnWidthTotal = [25, 22];

  let columnAlimentTotal1 = [ColumnAliment.LEFT, ColumnAliment.RIGHT];
  let columnWidthTotal1 = [13, 10];

  let columnAliment1 = [
    ColumnAliment.LEFT,
    ColumnAliment.LEFT,
    ColumnAliment.RIGHT,
    ColumnAliment.RIGHT,
  ];
  let columnWidth1 = [14, 11, 8, 13];

  if (store.getState().Shared.Internet) {
    USBPrinter.printImage(
      `https://ecco.royaldonuts.xyz/images/general_home_setting/16632676496384.royal_donuts_logo.png`,
      {
        imageWidth: 400,
        imageHeight: 150,
      },
    );
  }

  USBPrinter.printText(`${CENTER}${BOLD_ON}BILLING RECEIPT${BOLD_OFF}\n`);

  USBPrinter.printText(`Order No: ${Order_No}`);

  USBPrinter.printText(`No. of Products: ${Product_Lenght}`);

  USBPrinter.printText(
    `Date: ${moment(new Date()).format('DD/MM/YYYY H:mma')} `,
  );

  USBPrinter.printText(`${CENTER}${COMMANDS.HORIZONTAL_LINE.HR_80MM}${CENTER}`);

  const header = ['Qty', 'Product Name', 'Price'];
  USBPrinter.printColumnsText(header, columnWidth, columnAliment, [
    `${BOLD_ON}`,
    `${TXT_FONT_A}`,
    '',
  ]);

  USBPrinter.printText(
    `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR3_80MM}${CENTER}`,
  );
  for (let i in orderList) {
    USBPrinter.printColumnsText(orderList[i], columnWidth, columnAliment, [
      `${BOLD_OFF}`,
      '',
      '',
    ]);
  }
  USBPrinter.printText(`${CENTER}${COMMANDS.HORIZONTAL_LINE.HR_80MM}${CENTER}`);

  let header3 = [
    'Sub Total:',
    `${parseFloat(total - tax + discount + couponamount).toFixed(2)} TND`,
  ];
  USBPrinter.printColumnsText(header3, columnWidthTotal, columnAlimentTotal, [
    `${BOLD_ON}`,
    `${CENTER}`,
    '',
  ]);

  let header7 = [
    'Tax:',
    `(${store.getState()?.Cart?.tax}%) ${parseFloat(tax).toFixed(2)} TND`,
  ];
  USBPrinter.printColumnsText(header7, columnWidthTotal, columnAlimentTotal, [
    `${BOLD_ON}`,
    `${CENTER}`,
    '',
  ]);

  if (parseFloat(couponamount) > 0) {
    let header5 = [
      'Coupon:',
      `(${store.getState()?.Cart?.coupons}%) ${parseFloat(couponamount).toFixed(
        2,
      )} TND`,
    ];
    USBPrinter.printColumnsText(header5, columnWidthTotal, columnAlimentTotal, [
      `${BOLD_ON}`,
      `${CENTER}`,
      '',
    ]);
  }

  if (parseFloat(discount) > 0) {
    let header6 = ['Discount:', `${parseFloat(discount).toFixed(2)} TND`];
    USBPrinter.printColumnsText(header6, columnWidthTotal, columnAlimentTotal, [
      `${BOLD_ON}`,
      `${CENTER}`,
      '',
    ]);
  }

  USBPrinter.printText(
    `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR3_80MM}${CENTER}`,
  );
  let header2 = ['Grand Total', `${parseFloat(total).toFixed(2)} TND`];
  USBPrinter.printColumnsText(header2, columnWidthTotal1, columnAlimentTotal1, [
    `${TEXT_CUSTOM_SIZE}`,
    `${BOLD_ON}`,
    `${CENTER}`,
    '',
  ]);
  // USBPrinter.printText(`\n`);
  let header4 = [
    'Customer Pay:',
    `${parseFloat(customer_pay).toFixed(2)} TND`,
    'Change:',
    `${parseFloat(Math.abs(total - customer_pay)).toFixed(2)} TND`,
  ];
  USBPrinter.printColumnsText(header4, columnWidth1, columnAliment1, [
    `${BOLD_ON}`,
    `${CENTER}`,
    '',
  ]);
  USBPrinter.printText(
    `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR3_80MM}${CENTER}`,
  );
  // USBPrinter.printText(`\n`);
  USBPrinter.printBill(
    `${CENTER}Thank you\n`,
    `${CASH_DRAWER}`,
    `${CASH_DRAWER_KICK}`,
    { beep: false },
  );
};

export const UserPay = amount => {
  return async dispatch => {
    dispatch({ type: CHANGE_CUSTOMER_PAY, payload: amount });
  };
};

export const ChangeTotal = amount => {
  return async dispatch => {
    dispatch({ type: CHANGE_TOTAL, payload: amount });
  };
};

export const ChangePaymentType = type => {
  return async dispatch => {
    dispatch({ type: CHANGE_PAYMENT_TYPE, payload: type });
  };
};

export const VerifyCoupons = (Coupon, total) => {
  return async dispatch => {
    let verify = await apiInstance
      .post(`applyCoupon?coupon_code=${Coupon}`, {})
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        return error.response;
      });
    const { status, data } = verify;
    if (status == 200) {
      if (data.code == 1) {
        if (data?.coupon?.symbol == '%') {
          var couponamount =
            (data?.coupon?.amount / 100) * parseFloat(NumberFormat(total));
        } else {
          var couponamount = data?.coupon?.amount;
        }
        if (
          parseFloat(NumberFormat(total)) -
          parseFloat(NumberFormat(couponamount)) >
          0
        ) {
          dispatch({ type: CHANGE_COUPON, payload: data?.coupon?.amount });
          dispatch({ type: CHANGE_COUPON_TYPE, payload: data?.coupon?.symbol });
          ToastAndroid.showWithGravityAndOffset(
            'Coupon Successfully applied',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'Unable to able Coupon Right Now',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
      } else if (data.code == 2) {
        ToastAndroid.showWithGravityAndOffset(
          'Invalid or Expired Coupon',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      } else if (data.code == 3) {
        ToastAndroid.showWithGravityAndOffset(
          'Coupon limit is over. Use Another If Any',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
    }
  };
};

export const zeroCoupon = () => {
  return async dispatch => {
    dispatch({ type: CHANGE_COUPON, payload: 0 });
    dispatch({ type: CHANGE_COUPON_TYPE, payload: '' });
  };
};
