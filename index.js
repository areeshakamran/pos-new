import { useNetInfo } from "@react-native-community/netinfo";
import React from 'react';
import { AppRegistry, Text, TextInput } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { Provider } from 'react-redux';
import App from './App';
import { name as appName } from './app.json';
import LocalizationContext from "./LocalizationContext";
import { DraftDatabase } from "./Src/CreateDatabase/DraftDatabase";
import { ProductAndCategoryDatabase } from "./Src/CreateDatabase/ProductAndCategoryDatabase";
import { SaleDatabase } from "./Src/CreateDatabase/SaleDatabase";
import * as I18n from './Src/i18n';
import store from './Src/Store';
import fn from './Src/i18n/fn.json'
import { BackSendtoDraftsToDatabase } from './Src/Store/Actions/DraftAction';
import { BackToOnline, Internet, ReopenApp } from './Src/Store/Actions/HomeAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

SaleDatabase()
ProductAndCategoryDatabase()
DraftDatabase()

store.dispatch(ReopenApp())

const AppRedux = () => {
    // Languages setting
    const [locale, setLocale] = React.useState(I18n.DEFAULT_LANGUAGE);
    const localizationContext = React.useMemo(
        () => ({
            t: (scope, options) => I18n.t(scope, { locale, ...options }),
            locale,
            setLocale: newLocale => {
                const newSetLocale = I18n.setI18nConfig(newLocale);
                setLocale(newSetLocale);
            },
        }),
        [locale],
    );

    const getLanguage = async () => {
        try {
            const lang = await AsyncStorage.getItem('language');
            if (lang !== null) {
                const parse = JSON.parse(lang)
                handleLocalizationChange(parse);
            } else {
                handleLocalizationChange('en')
            };
        } catch (e) {
            console.log('Language Fetching Error: ', e);
        }
    };

    const handleLocalizationChange = React.useCallback(
        newLocale => {
            const newSetLocale = I18n.setI18nConfig(newLocale);
            setLocale(newSetLocale);
        },
        [locale],
    );

    const updatelanguage = async () => {
        const updatelang = await AsyncStorage.getItem('Updatelanguage');
        const parselang = JSON.parse(updatelang)
        for (let i = 0; i < Object.keys(parselang).length; i++) {
            let index = Object.keys(parselang)[i]
            fn[index] = parselang[index]
        }

    }

    React.useEffect(() => {
        updatelanguage()
        getLanguage();
        EventRegister.addEventListener('changeLanguage', handleLocalizationChange);
        return () => {
            EventRegister.removeEventListener(
                'changeLanguage',
                handleLocalizationChange,
            );
        };
    }, []);
    // end

    // Update language 



    // update language end
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
            <LocalizationContext.Provider value={localizationContext}>
                <App />
            </LocalizationContext.Provider>
        </Provider>
    )
};

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent(appName, () => AppRedux);
