import Environment from '../services/enviroenmet';
import LoginModel from '../models/loginModel';
import { AsyncStorage } from "react-native";

export default class LoginServices {
    env = new Environment();

    login(userName, password) {
        let loginModel = new LoginModel();
        loginModel.UserEmail = userName;
        loginModel.UserPass = password;
        return fetch(this.env.ServiceUrl + 'Login/LoginUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginModel),
        }).then(function (res) {
            return res.json();
        });
    }

    SetUserData = async (userDetailJson) => {
        try {
            await AsyncStorage.setItem('UserInfo', userDetailJson);
        } catch (error) {
        }
    }

    GetUserData = async () => {
        try {
            const value = await AsyncStorage.getItem('UserInfo');
            if (value !== null) {
                return JSON.parse(value);
            }
        } catch (error) {
        }
    }
}


