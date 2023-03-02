import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import MasterLogin from '../Screen/MasterLogin';
import PinScreen from '../Screen/PinScreen';
import UsersList from '../Screen/UsersList';
import { connect } from 'react-redux';
import {
    ImageBackground
} from 'react-native'

const AuthStack = createNativeStackNavigator();

function AuthNavigation(props) {
    return (
        <ImageBackground
            style={{ width: '100%', height: "100%", }}
            resizeMode='stretch'
            source={require('../../../Assets/Images/BG.png')}
        >
            <AuthStack.Navigator
            initialRouteName='userList'
            screenOptions={{
                 headerShown: false,
                 
                 }}>
                {props?.User?.masterLogin ? (
                    <>
                        <AuthStack.Screen name="userList" component={UsersList} />
                        <AuthStack.Screen name="pin" component={PinScreen} /></>
                ) :
                    <AuthStack.Screen name="masterLogin" component={MasterLogin} />
                }


            </AuthStack.Navigator>
        </ImageBackground>
    )
}
const mapStateToProps = ({ User }) => ({
    User
});

export default connect(mapStateToProps, {})(AuthNavigation);