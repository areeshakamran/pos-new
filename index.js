import { useNetInfo } from "@react-native-community/netinfo";
import React from 'react';
import { AppRegistry, Text, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import App from './App';
import { name as appName } from './app.json';
import store from './Src/Store';
import { BackSendtoDraftsToDatabase } from './Src/Store/Actions/DraftAction';
import { SaleDatabase } from "./Src/CreateDatabase/SaleDatabase";
import { ProductAndCategoryDatabase } from "./Src/CreateDatabase/ProductAndCategoryDatabase";
import { DraftDatabase } from "./Src/CreateDatabase/DraftDatabase";
import { BackToOnline, Internet, ReopenApp } from './Src/Store/Actions/HomeAction';

SaleDatabase()
ProductAndCategoryDatabase()
DraftDatabase()

store.dispatch(ReopenApp())

const AppRedux = () => {
    const netInfo = useNetInfo();
    let internet = React.useMemo(() => {
        return netInfo.isConnected
    }, [netInfo.isConnected])
    React.useEffect(() => {
        store.dispatch(Internet(internet))
        if (internet) {
            store.dispatch(BackToOnline())
            store.dispatch(BackSendtoDraftsToDatabase())
        }
    }, [internet])
    return (
        <Provider {...{ store }}>
            <SafeAreaProvider>
                <App />
            </SafeAreaProvider>
        </Provider>
    )
};

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent(appName, () => AppRedux);
