import axios from 'axios';
import { ToastAndroid } from "react-native";

export const apiInstance = axios.create({
    baseURL: "https://saas-ecommerce.royaldonuts.xyz/api/",
    timeout: 5000,
    headers: {
        'Content-Type': "application/json",
        'Accept': "application/json",
        // 'Access-Control-Max-Age': 0
    }
})

apiInstance.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

apiInstance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
   if(error.message == 'Network Error'){
    ToastAndroid.showWithGravityAndOffset(
        "Kindly Check your Internet!",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );

   }
    return Promise.reject(error);
});




