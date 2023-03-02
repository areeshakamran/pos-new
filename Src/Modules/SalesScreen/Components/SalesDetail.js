import {useTheme} from '@react-navigation/native';
import moment from 'moment';
import React, {useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Mailer from 'react-native-mail';
import {DataTable} from 'react-native-paper';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import Delete from '../../../Assets/Images/delete.svg';
import Email from '../../../Assets/Images/email.svg';
import Loader from '../../../Assets/Images/loader.svg';
import PrintInvoice from '../../../Assets/Images/print.svg';
import CustomHeader from '../../../Component/CustomeHeader';
import {NumberFormat} from '../../../Confiq/Helper';
import store from '../../../Store';
import {
  deleteSale,
  MinusQuantity,
  ReturnSale,
} from '../../../Store/Actions/SaleAction';
import HomeCustomeButton from '../../Home/Components/HomeCustomeButton';
import {
  USBPrinter,
  ColumnAliment,
  COMMANDS,
} from 'react-native-thermal-receipt-printer-image-qr';

function SalesDatail(props) {
  const {colors} = useTheme();
  const [returnField, setReturnField] = React.useState(false);
  const [subTotal, setSubTotal] = React.useState(true);
  const [returnAmount, setReturnAMount] = useState(0);
  const [returnCouponDiscont, setreturnCouponDiscont] = useState(0);
  const [returndiscount, setretrundiscount] = useState(0);
  const [returnCoupon, setreturnCoupon] = useState(0);
  const [printerloader, setprinterloader] = useState(false);

  const createPDF = async () => {
    let options = {
      html: `<body style="background-color:#e2e1e0;font-family: Open Sans, sans-serif;font-size:100%;font-weight:400;line-height:1.4;color:#000;">
      <table style="max-width:670px;margin:50px auto 10px;background-color:#fff;padding:50px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;-webkit-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);-moz-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24); border-top: solid 10px green;">
        <thead>
          <tr>
          <th style="text-align:left;">Sale Invoice</th>
            <th style="text-align:right;font-weight:200;font-size:13px;">${moment(
              new Date(),
            ).format('MMM Do YYYY')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="height:35px;"></td>
          </tr>
          <tr>
            <td colspan="2" style="border: solid 1px #ddd; padding:10px 20px;">
              <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:150px">Order status</span><b style="color:green;font-weight:normal;margin:0">Success</b></p>
              <p style="font-size:14px;margin:0 0 0 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">Order amount</span> Rs. ${NumberFormat(
                parseFloat(subTotal) +
                  parseFloat(props.Sale.saleItems[0].sale?.tax) -
                  parseFloat(returnAmount),
              )}</p>
            </td>
          </tr> 
          <tr>
            <td style="height:35px;"></td>
          </tr>
          <tr>
            <td colspan="2" style="font-size:20px;padding:30px 15px 0 15px;">Items</td>
          </tr>
          <tr>
            <td colspan="2" style="padding:15px;">
            ${props?.Sale?.saleItems[0]?.sale_items.map((item, index) => {
              return `
                <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold;">
                <span style="display:block;font-size:13px;font-weight:normal;">${
                  item.name_fr
                }</span> ${
                item.price_euro * item.quantity
              } TND <b style="font-size:12px;font-weight:300;"></b>
                </p>
                `;
            })}
            </td>
          </tr>
        </tbody>
      </table>
    </body>`,
      fileName: 'Invoice',
      directory: 'Documents',
    };

    let file = await RNHTMLtoPDF.convert(options);
    handleEmail(file?.filePath);
  };

  const handleEmail = source => {
    Mailer.mail(
      {
        subject: 'Invoice Receipt',
        recipients: [],
        ccRecipients: [],
        bccRecipients: [],
        body: ``,
        customChooserTitle: '', // Android only (defaults to "Send Mail")
        isHTML: true,
        attachments: [
          {
            // Specify either `path` or `uri` to indicate where to find the file data.
            // The API used to create or locate the file will usually indicate which it returns.
            // An absolute path will look like: /cacheDir/photos/some image.jpg
            // A URI starts with a protocol and looks like: content://appname/cacheDir/photos/some%20image.jpg
            path: source, // The absolute path of the file from which to read data.
            uri: '', // The uri of the file from which to read the data.
            // Specify either `type` or `mimeType` to indicate the type of data.
            type: 'pdf', // Mime Type: jpg, png, doc, ppt, html, pdf, csv
            // mimeType: '', // - use only if you want to use custom type
            // name: '', // Optional: Custom filename for attachment
          },
        ],
      },
      (error, event) => {
        console.log(
          error,
          event,
          // [
          //   { text: 'Ok', onPress: () => console.log('OK: Email Error Response') },
          //   { text: 'Cancel', onPress: () => console.log('CANCEL: Email Error Response') }
          // ],
          // { cancelable: true }
        );
      },
    );
  };

  React.useEffect(() => {
    let temp = 0;
    let totalquantity = 0;
    for (
      let index = 0;
      index < props.Sale.saleItems[0].sale_items.length;
      index++
    ) {
      temp =
        props.Sale.saleItems[0].sale_items[index].quantity *
          props.Sale.saleItems[0].sale_items[index].price_euro +
        temp;
      totalquantity =
        totalquantity + props.Sale.saleItems[0].sale_items[index].quantity;
    }
    let returnamount = 0;
    let retrunquantity = 0;
    for (
      let i = 0;
      i < props?.Sale.saleItems[0]?.return_sale_items.length;
      i++
    ) {
      returnamount =
        returnamount +
        parseFloat(props?.Sale.saleItems[0]?.return_sale_items[i].quantity) *
          parseFloat(props?.Sale.saleItems[0]?.return_sale_items[i].price_euro);
      retrunquantity = parseInt(
        NumberFormat(
          retrunquantity +
            parseFloat(props?.Sale.saleItems[0]?.return_sale_items[i].quantity),
        ),
      );
    }
    var peritem = props.Sale.saleItems[0].sale?.discount / totalquantity;
    var peritemcoupon = props.Sale.saleItems[0].sale?.coupon / totalquantity;
    var returnDiscontCoupon = 0;
    if (retrunquantity > 0) {
      let dis = parseFloat(props.Sale.saleItems[0].sale?.discount);
      let conp = parseFloat(props.Sale.saleItems[0].sale?.coupon);
      let totalpercentageDiscontReturn =
        ((dis + conp) / parseFloat(temp)) * 100;
      returnDiscontCoupon = (totalpercentageDiscontReturn / 100) * returnamount;
      setreturnCouponDiscont(returnDiscontCoupon);
      setretrundiscount(NumberFormat(peritem * retrunquantity));
      setreturnCoupon(NumberFormat(peritemcoupon * retrunquantity));
    }
    setSubTotal(temp.toFixed(2));
    setReturnAMount(
      NumberFormat(parseFloat(returnamount) - parseFloat(returnDiscontCoupon)),
    );
  }, []);

  const printBill = async () => {
    try {
      setprinterloader(true);
      USBPrinter.init().then(async () => {
        USBPrinter.getDeviceList()
          .then(async res => {
            USBPrinter.connectPrinter(res[0].vendor_id, res[0].product_id)
              .then(async res => {
                const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
                const TXT_FONT_A = COMMANDS.TEXT_FORMAT.TXT_FONT_A;
                const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
                const CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT;
                const CASH_DRAWER = COMMANDS.CASH_DRAWER.CD_KICK_5;
                const CASH_DRAWER_KICK = COMMANDS.CASH_DRAWER.CD_KICK_2;
                const TEXT_CUSTOM_SIZE = COMMANDS.TEXT_FORMAT.TXT_CUSTOM_SIZE(
                  2.5,
                  1.5,
                );

                let orderList = [];
                let returnlist = [];
                let columnAliment = [
                  ColumnAliment.LEFT,
                  ColumnAliment.LEFT,
                  ColumnAliment.RIGHT,
                ];
                let columnWidth = [46 - (28 + 12), 28, 10];
                // let columnWidth = [46 - (28 + 12), 28, 12]
                let columnAlimentTotal = [
                  ColumnAliment.LEFT,
                  ColumnAliment.RIGHT,
                ];
                let columnWidthTotal = [25, 22];

                let columnAlimentTotal1 = [
                  ColumnAliment.LEFT,
                  ColumnAliment.RIGHT,
                ];
                let columnWidthTotal1 = [13, 10];

                for (
                  let index = 0;
                  index < props.Sale.saleItems[0]?.sale_items.length;
                  index++
                ) {
                  orderList.push([
                    JSON.stringify(
                      props.Sale.saleItems[0]?.sale_items[index].quantity,
                    ),
                    props.Sale.saleItems[0]?.sale_items[index].name_fr,
                    parseFloat(
                      props.Sale.saleItems[0]?.sale_items[index].price_euro *
                        props.Sale.saleItems[0]?.sale_items[index].quantity,
                    ).toFixed(2),
                  ]);
                }
                var returnsubtotal = 0;
                for (
                  let index = 0;
                  index < props?.Sale.saleItems[0]?.return_sale_items.length;
                  index++
                ) {
                  returnsubtotal =
                    returnsubtotal +
                    parseFloat(
                      props?.Sale.saleItems[0]?.return_sale_items[index]
                        .price_euro *
                        props?.Sale.saleItems[0]?.return_sale_items[index]
                          .quantity,
                    ).toFixed(2);
                  returnlist.push([
                    JSON.stringify(
                      props?.Sale.saleItems[0]?.return_sale_items[index]
                        .quantity,
                    ),
                    props?.Sale.saleItems[0]?.return_sale_items[index].name_fr,
                    parseFloat(
                      props?.Sale.saleItems[0]?.return_sale_items[index]
                        .price_euro *
                        props?.Sale.saleItems[0]?.return_sale_items[index]
                          .quantity,
                    ).toFixed(2),
                  ]);
                }
                if (store.getState()?.Shared?.Internet) {
                  USBPrinter.printImage(
                    `https://rd-beta.royaldonuts.xyz/images/royal_donuts_logo.png`,
                    {
                      imageWidth: 400,
                      imageHeight: 150,
                    },
                  );
                }
                USBPrinter.printText(
                  `${CENTER}${BOLD_ON}BILLING RECEIPT${BOLD_OFF}\n`,
                );

                USBPrinter.printText(
                  `Order No: ${parseFloat(
                    props?.Sale?.saleItems[0]?.sale?.order_no
                  )}`,
                );

                USBPrinter.printText(
                  `Total Sale items : ${props.Sale.saleItems[0]?.sale_items.length}`,
                );

                USBPrinter.printText(
                  `Date : ${moment(new Date()).format('DD/MM/YYYY H:mma')} `,
                );

                USBPrinter.printText(
                  `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR_80MM}${CENTER}`,
                );

                const header = ['Qty', 'Product Name', 'Price'];
                USBPrinter.printColumnsText(
                  header,
                  columnWidth,
                  columnAliment,
                  [`${BOLD_ON}`, `${TXT_FONT_A}`],
                );

                USBPrinter.printText(
                  `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR3_80MM}${CENTER}`,
                );
                for (let i in orderList) {
                  USBPrinter.printColumnsText(
                    orderList[i],
                    columnWidth,
                    columnAliment,
                    [`${BOLD_OFF}`, '', ''],
                  );
                }

                USBPrinter.printText(
                  `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR_80MM}${CENTER}`,
                );
                let header10 = ['Sub Total:', `${subTotal} TND`];
                USBPrinter.printColumnsText(
                  header10,
                  columnWidthTotal,
                  columnAlimentTotal,
                  [`${BOLD_ON}`, `${CENTER}`, ''],
                );

                // Return item print
                if (props?.Sale.saleItems[0]?.return_sale_items.length > 0) {
                  USBPrinter.printText(`\n`);

                  USBPrinter.printText(
                    `Total Return items : ${props?.Sale.saleItems[0]?.return_sale_items.length}`,
                  );

                  USBPrinter.printText(
                    `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR_80MM}${CENTER}`,
                  );

                  USBPrinter.printColumnsText(
                    header,
                    columnWidth,
                    columnAliment,
                    [`${BOLD_ON}`, `${TXT_FONT_A}`, ''],
                  );

                  USBPrinter.printText(
                    `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR3_80MM}${CENTER}`,
                  );
                  for (let i in returnlist) {
                    USBPrinter.printColumnsText(
                      orderList[i],
                      columnWidth,
                      columnAliment,
                      [`${BOLD_OFF}`, '', ''],
                    );
                  }
                  USBPrinter.printText(
                    `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR_80MM}${CENTER}`,
                  );
                  let header11 = [
                    'Return Sub Total:',
                    `${NumberFormat(returnsubtotal)} TND`,
                  ];
                  USBPrinter.printColumnsText(
                    header11,
                    columnWidthTotal,
                    columnAlimentTotal,
                    [`${BOLD_ON}`, `${CENTER}`],
                  );
                }

                let header7 = [
                  'Tax:',
                  `${props.Sale.saleItems[0].sale?.tax} TND`,
                ];
                USBPrinter.printColumnsText(
                  header7,
                  columnWidthTotal,
                  columnAlimentTotal,
                  [`${BOLD_ON}`, `${CENTER}`, ''],
                );
                if (parseFloat(props.Sale.saleItems[0].sale?.coupon) > 0) {
                  let header5 = [
                    'Coupon:',
                    `${parseFloat(props.Sale.saleItems[0].sale?.coupon).toFixed(
                      2,
                    )} TND`,
                  ];
                  USBPrinter.printColumnsText(
                    header5,
                    columnWidthTotal,
                    columnAlimentTotal,
                    [`${BOLD_ON}`, `${CENTER}`, ''],
                  );
                }

                // if (
                //   props?.Sale.saleItems[0]?.return_sale_items.length > 0 &&
                //   parseFloat(
                //     props.Sale.saleItems[0].sale?.coupon - returnCoupon,
                //   ) > 0
                // ) {
                //   let header9 = [
                //     'Return Coupon:',
                //     `${parseFloat(
                //       props.Sale.saleItems[0].sale?.coupon - returnCoupon,
                //     ).toFixed(2)} TND`,
                //   ];
                //   USBPrinter.printColumnsText(
                //     header9,
                //     columnWidthTotal,
                //     columnAlimentTotal,
                //     [`${BOLD_ON}`, `${CENTER}`, ''],
                //   );
                // }
                if (parseFloat(props.Sale.saleItems[0].sale?.discount) > 0) {
                  let header6 = [
                    'Discount:',
                    `${parseFloat(
                      props.Sale.saleItems[0].sale?.discount,
                    ).toFixed(2)} TND`,
                  ];
                  USBPrinter.printColumnsText(
                    header6,
                    columnWidthTotal,
                    columnAlimentTotal,
                    [`${BOLD_ON}`, `${CENTER}`, ''],
                  );
                }
                if (
                  props?.Sale.saleItems[0]?.return_sale_items.length > 0 &&
                  parseFloat(returnCouponDiscont) > 0
                ) {
                  let header8 = [
                    'Return Discount/Coupon:',
                    `${parseFloat(parseFloat(returnCouponDiscont)).toFixed(
                      2,
                    )} TND`,
                  ];
                  USBPrinter.printColumnsText(
                    header8,
                    columnWidthTotal,
                    columnAlimentTotal,
                    [`${BOLD_ON}`, `${CENTER}`, ''],
                  );
                  let header12 = [
                    'Return Amount:',
                    `${NumberFormat(returnAmount)} TND`,
                  ];
                  USBPrinter.printColumnsText(
                    header12,
                    columnWidthTotal,
                    columnAlimentTotal,
                    [`${BOLD_ON}`, `${CENTER}`],
                  );
                }
                USBPrinter.printText(
                  `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR3_80MM}${CENTER}`,
                );
                let header2 = [
                  'Grand Total',
                  `${parseFloat(
                    NumberFormat(
                      parseFloat(subTotal) +
                        parseFloat(props.Sale.saleItems[0].sale?.tax) -
                        parseFloat(returnAmount) -
                        parseFloat(props.Sale.saleItems[0].sale?.discount) -
                        parseFloat(props.Sale.saleItems[0].sale?.coupon),
                    ),
                  ).toFixed(2)} TND`,
                ];
                USBPrinter.printColumnsText(
                  header2,
                  columnWidthTotal1,
                  columnAlimentTotal1,
                  [`${TEXT_CUSTOM_SIZE}`, `${BOLD_ON}`, `${CENTER}`, ''],
                );
                USBPrinter.printText(
                  `${CENTER}${COMMANDS.HORIZONTAL_LINE.HR3_80MM}${CENTER}`,
                );
                USBPrinter.printBill(
                  `${CENTER}Thank you\n`,
                  `${CASH_DRAWER}`,
                  `${CASH_DRAWER_KICK}`,
                  {beep: false},
                );

                setprinterloader(false);
              })
              .catch(e => {
                ToastAndroid.showWithGravityAndOffset(
                  e,
                  ToastAndroid.LONG,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
                setprinterloader(false);
              });
          })
          .catch(e => {
            alert('something went wrong');
            console.log(e)
            setprinterloader(false);
          });
      });
    } catch (error) {
      setprinterloader(false);
    }
  };

  return (
    <>
      <View style={{flex: 1, backgroundColor: colors.grayLightColor}}>
        <CustomHeader title="Sale Detail" navigation={props.navigation} />
        <ScrollView nestedScrollEnabled={true} horizontal={false}>
          <ScrollView
            nestedScrollEnabled={true}
            horizontal={true}
            contentContainerStyle={{flexGrow: 1}}>
            <View style={{flex: 1}}>
              <View
                style={{
                  backgroundColor: 'white',
                  elevation: 5,
                  borderRadius: 2,
                  padding: widthPercentageToDP('1%'),
                  margin: heightPercentageToDP('5%'),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    padding: widthPercentageToDP('1%'),
                    paddingHorizontal: widthPercentageToDP('5%'),
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{
                        fontFamily: 'Poppins-SemiBold',
                        color: colors.PrimaryColor,
                        fontSize: heightPercentageToDP('2.2%'),
                        width: widthPercentageToDP('8%'),
                      }}>
                      Order No.
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Poppins-SemiBold',
                        color: colors.PrimaryColor,
                        fontSize: heightPercentageToDP('2.2%'),
                      }}>
                      #
                      {props.Sale.saleItems[0].sale?.order_no
                        ? props.Sale.saleItems[0].sale?.order_no
                        : `${props.Sale.saleItems[0].sale?.id} Offline`}
                    </Text>
                  </View>
                  <View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          color: colors.PrimaryColor,
                          fontSize: heightPercentageToDP('2.2%'),
                          width: widthPercentageToDP('8%'),
                        }}>
                        Date
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Poppins-Regular',
                          color: colors.PrimaryColor,
                          fontSize: heightPercentageToDP('2.2%'),
                        }}>
                        {moment(
                          props.Sale.saleItems[0].sale?.Created_At,
                        ).format('MMM Do YY')}
                      </Text>
                    </View>

                    <HomeCustomeButton
                      onpress={() =>
                        props?.navigation?.navigate('ReturnOrder', {
                          discount: NumberFormat(
                            parseFloat(props.Sale.saleItems[0].sale?.discount),
                          ),
                          coupon: NumberFormat(
                            parseFloat(props.Sale.saleItems[0].sale?.coupon),
                          ),
                          DiscontandCoupon:
                            parseFloat(props.Sale.saleItems[0].sale?.coupon) +
                            parseFloat(props.Sale.saleItems[0].sale?.discount) -
                            parseFloat(returnCouponDiscont),
                        })
                      }
                      title={'Return Order'}
                      Icon={Loader}
                      IconWidth={widthPercentageToDP('3%')}
                      IconHeight={heightPercentageToDP('3%')}
                      style={[
                        styles.ViewStyle,
                        {
                          backgroundColor: colors.deleteColor,
                        },
                      ]}
                      txtStyle={[
                        styles.textStyle,
                        {
                          color: colors.light,
                        },
                      ]}
                    />
                  </View>
                </View>

                <View style={{marginHorizontal: widthPercentageToDP('2%')}}>
                  <FlatList
                    data={props.Sale.saleItems[0]?.sale_items}
                    keyExtractor={(item, index) => index}
                    ListHeaderComponent={
                      <DataTable>
                        <DataTable.Header
                          style={{
                            backgroundColor: colors.PrimaryColor,
                            borderRadius: 2,
                          }}>
                          <DataTable.Title
                            textStyle={[
                              styles.DataTableHeaderTextView,
                              {
                                flex: 1,

                                color: colors.light,
                              },
                            ]}>
                            Item Description
                          </DataTable.Title>
                          <DataTable.Title
                            textStyle={[
                              styles.DataTableHeaderTextView,
                              {
                                color: colors.light,
                                flex: 1,
                              },
                            ]}>
                            Price
                          </DataTable.Title>
                          <DataTable.Title
                            textStyle={[
                              styles.DataTableHeaderTextView,
                              {
                                color: colors.light,
                                flex: 1,
                              },
                            ]}>
                            Quantity
                          </DataTable.Title>
                          <DataTable.Title
                            textStyle={[
                              styles.DataTableHeaderTextView,
                              {
                                color: colors.light,
                                flex: 1,
                              },
                            ]}>
                            Total
                          </DataTable.Title>
                        </DataTable.Header>
                      </DataTable>
                    }
                    renderItem={({item, index}) => {
                      return (
                        <DataTable key={index}>
                          <DataTable.Row
                            style={{
                              backgroundColor: 'rgba(128,173,199,0.2)',
                              marginTop: heightPercentageToDP('1%'),
                              borderRadius: 2,
                            }}>
                            <DataTable.Cell
                              textStyle={[
                                styles.DateCellTextView,
                                {
                                  color: colors.PrimaryColor,
                                  flex: 1,
                                  width: widthPercentageToDP('8%'),
                                },
                              ]}>
                              {item.name_fr}
                            </DataTable.Cell>
                            <DataTable.Cell
                              textStyle={[
                                styles.DateCellTextView,
                                {
                                  color: colors.PrimaryColor,
                                  flex: 1,
                                  width: widthPercentageToDP('1%'),
                                },
                              ]}>
                              {item.price_euro.toFixed(2)}
                            </DataTable.Cell>
                            <DataTable.Cell
                              textStyle={[
                                styles.DateCellTextView,
                                {
                                  color: colors.PrimaryColor,
                                },
                              ]}>
                              {item.quantity}
                            </DataTable.Cell>
                            <DataTable.Cell
                              numeric
                              textStyle={[
                                styles.DateCellTextView,
                                {
                                  color: colors.PrimaryColor,
                                  flex: 1,
                                },
                              ]}>
                              {NumberFormat(item.price_euro * item.quantity)}
                            </DataTable.Cell>
                          </DataTable.Row>
                        </DataTable>
                      );
                    }}
                  />
                  {props?.Sale.saleItems[0]?.return_sale_items.length > 0 ? (
                    <View
                      style={{
                        marginTop: heightPercentageToDP('3%'),
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          color: colors.PrimaryColor,
                          fontSize: heightPercentageToDP('2.6%'),
                        }}>
                        Return Order.
                      </Text>
                      <FlatList
                        data={props.Sale.saleItems[0]?.return_sale_items}
                        keyExtractor={(item, index) => index}
                        renderItem={({item, index}) => {
                          return (
                            <DataTable key={index}>
                              <DataTable.Row
                                style={{
                                  backgroundColor: 'rgba(128,173,199,0.2)',
                                  marginTop: heightPercentageToDP('1%'),
                                  borderRadius: 2,
                                }}>
                                <DataTable.Cell
                                  textStyle={[
                                    styles.DateCellTextView,
                                    {
                                      color: colors.PrimaryColor,
                                      flex: 1,
                                      width: widthPercentageToDP('8%'),
                                    },
                                  ]}>
                                  {item.name_fr}
                                </DataTable.Cell>
                                <DataTable.Cell
                                  textStyle={[
                                    styles.DateCellTextView,
                                    {
                                      color: colors.PrimaryColor,
                                    },
                                  ]}>
                                  {item.price_euro.toFixed(2)}
                                </DataTable.Cell>
                                <DataTable.Cell
                                  textStyle={[
                                    styles.DateCellTextView,
                                    {
                                      color: colors.PrimaryColor,
                                    },
                                  ]}>
                                  {item.quantity}
                                </DataTable.Cell>
                                <DataTable.Cell
                                  textStyle={[
                                    styles.DateCellTextView,
                                    {
                                      color: colors.PrimaryColor,
                                    },
                                  ]}>
                                  {(item.price_euro * item.quantity).toFixed(2)}
                                </DataTable.Cell>

                                {returnField ? (
                                  <DataTable.Cell
                                    textStyle={[
                                      styles.DateCellTextView,
                                      {
                                        color: colors.PrimaryColor,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      },
                                    ]}>
                                    <AntDesign
                                      onPress={() =>
                                        props.MinusQuantity(
                                          item.id,
                                          item.quantity,
                                        )
                                      }
                                      name="minus"
                                      color={colors.light}
                                      size={heightPercentageToDP('3%')}
                                      style={{
                                        backgroundColor: colors.PrimaryColor,
                                      }}
                                    />
                                    <HomeCustomeButton
                                      onpress={() => props.deleteSale(item)}
                                      Icon={Delete}
                                      IconWidth={widthPercentageToDP('3%')}
                                      IconHeight={heightPercentageToDP('3%')}
                                      style={{
                                        borderRadius: 2,
                                        marginLeft: widthPercentageToDP('0.5%'),
                                      }}
                                    />
                                  </DataTable.Cell>
                                ) : null}
                              </DataTable.Row>
                            </DataTable>
                          );
                        }}
                      />
                    </View>
                  ) : null}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginHorizontal: widthPercentageToDP('5%'),
                    marginTop: heightPercentageToDP('1%'),
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <HomeCustomeButton
                      onpress={() => printBill()}
                      LoaderValue={printerloader}
                      title={'Print Invoice'}
                      Icon={PrintInvoice}
                      IconWidth={widthPercentageToDP('3%')}
                      IconHeight={heightPercentageToDP('3%')}
                      style={[
                        styles.ViewStyle,
                        {
                          backgroundColor: colors.DraftColor,
                        },
                      ]}
                      txtStyle={[
                        styles.textStyle,
                        {
                          color: colors.light,
                        },
                      ]}
                    />

                    <HomeCustomeButton
                      onpress={() => createPDF()}
                      title={'Email Invoice'}
                      Icon={Email}
                      IconWidth={widthPercentageToDP('3%')}
                      IconHeight={heightPercentageToDP('3%')}
                      style={[
                        styles.ViewStyle,
                        {
                          backgroundColor: colors.SuccessColor,
                          marginHorizontal: widthPercentageToDP('1%'),
                        },
                      ]}
                      txtStyle={[
                        styles.textStyle,
                        {
                          color: colors.light,
                        },
                      ]}
                    />
                  </View>

                  <View style={{marginTop: heightPercentageToDP('2%')}}>
                    <View
                      style={[
                        styles.MainRow,
                        {marginTop: heightPercentageToDP('3%')},
                      ]}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          color: colors.PrimaryColor,
                          fontSize: heightPercentageToDP('2.3%'),
                          width: widthPercentageToDP('20%'),
                        }}>
                        {'SubTotal'}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          color: colors.PrimaryColor,
                          fontSize: heightPercentageToDP('2.3%'),
                        }}>
                        {subTotal != ''
                          ? subTotal
                          : props.route.params.item.total.toFixed(2)}
                      </Text>
                    </View>

                    <View style={styles.MainRow}>
                      <Text
                        style={[
                          styles.RightTextStyle,
                          {
                            color: colors.PrimaryColor,
                            width: widthPercentageToDP('20%'),
                          },
                        ]}>
                        {'Applied Coupon'}
                      </Text>
                      <Text
                        style={[
                          styles.RightTextStyle,
                          {
                            color: colors.PrimaryColor,
                          },
                        ]}>
                        {NumberFormat(props.Sale.saleItems[0].sale?.coupon)} TND
                      </Text>
                    </View>
                    {/* {returnCoupon > 0 ? (
                      <View style={styles.MainRow}>
                        <Text
                          style={[
                            styles.RightTextStyle,
                            {
                              color: colors.PrimaryColor,
                              width: widthPercentageToDP('20%'),
                            },
                          ]}>
                          {'Return Coupon Amount'}
                        </Text>
                        <Text
                          style={[
                            styles.RightTextStyle,
                            {
                              color: colors.PrimaryColor,
                            },
                          ]}>
                          {NumberFormat(returnCoupon)} TND
                        </Text>
                      </View>
                    ) : null} */}

                    <View style={styles.MainRow}>
                      <Text
                        style={[
                          styles.RightTextStyle,
                          {
                            color: colors.PrimaryColor,
                            width: widthPercentageToDP('20%'),
                          },
                        ]}>
                        {'Applied Discount'}
                      </Text>
                      <Text
                        style={[
                          styles.RightTextStyle,
                          {
                            color: colors.PrimaryColor,
                          },
                        ]}>
                        {NumberFormat(props.Sale.saleItems[0].sale?.discount)}{' '}
                        TND
                      </Text>
                    </View>

                    <View style={styles.MainRow}>
                      <Text
                        style={[
                          styles.RightTextStyle,
                          {
                            color: colors.PrimaryColor,
                            width: widthPercentageToDP('20%'),
                          },
                        ]}>
                        {'Tax'}
                      </Text>
                      <Text
                        style={[
                          styles.RightTextStyle,
                          {
                            color: colors.PrimaryColor,
                          },
                        ]}>
                        {props.Sale.saleItems[0].sale?.tax} TND
                      </Text>
                    </View>
                    {returnAmount > 0 ? (
                      <View style={styles.MainRow}>
                        <Text
                          style={[
                            styles.RightTextStyle,
                            {
                              color: colors.PrimaryColor,
                              width: widthPercentageToDP('20%'),
                            },
                          ]}>
                          {'Return Amount'}
                        </Text>
                        <Text
                          style={[
                            styles.RightTextStyle,
                            {
                              color: colors.PrimaryColor,
                            },
                          ]}>
                          {NumberFormat(returnAmount)} TND
                        </Text>
                      </View>
                    ) : null}
                    {returnCouponDiscont > 0 ? (
                      <View style={styles.MainRow}>
                        <Text
                          style={[
                            styles.RightTextStyle,
                            {
                              color: colors.PrimaryColor,
                              width: widthPercentageToDP('20%'),
                            },
                          ]}>
                          {'Return Discount and Coupon'}
                        </Text>
                        <Text
                          style={[
                            styles.RightTextStyle,
                            {
                              color: colors.PrimaryColor,
                            },
                          ]}>
                          {NumberFormat(returnCouponDiscont)} TND
                        </Text>
                      </View>
                    ) : null}

                    <View
                      style={{
                        borderColor: '#BFBFBF',
                        borderWidth: 1,
                        borderStyle: 'dotted',
                        marginVertical: widthPercentageToDP('1%'),
                      }}
                    />

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          color: colors.PrimaryColor,
                          fontSize: heightPercentageToDP('2.2%'),
                        }}>
                        {'Total'}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Poppins-SemiBold',
                          color: colors.PrimaryColor,
                          fontSize: heightPercentageToDP('2.2%'),
                        }}>
                        {NumberFormat(
                          parseFloat(subTotal) +
                            parseFloat(props.Sale.saleItems[0].sale?.tax) -
                            parseFloat(returnAmount) -
                            parseFloat(props.Sale.saleItems[0].sale?.discount) -
                            parseFloat(props.Sale.saleItems[0].sale?.coupon),
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </>
  );
}

const mapStateToProps = ({Sale, Shared}) => ({
  Sale,
  Shared,
});

export default connect(mapStateToProps, {
  deleteSale,
  MinusQuantity,
  ReturnSale,
})(SalesDatail);

const styles = StyleSheet.create({
  ViewStyle: {
    paddingVertical: heightPercentageToDP('1.3%'),
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: widthPercentageToDP('12%'),
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginVertical: heightPercentageToDP('1.5%'),
  },
  textStyle: {
    fontSize: heightPercentageToDP('2.2%'),
    fontFamily: 'Poppins-Medium',
  },
  DataTableHeaderTextView: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: heightPercentageToDP('2.2%'),
  },
  DateCellTextView: {
    fontFamily: 'Poppins-Regular',
    fontSize: heightPercentageToDP('2.2%'),
  },
  RightTextStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: heightPercentageToDP('2%'),
  },
  MainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
