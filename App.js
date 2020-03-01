import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import StartPage from './src/pages/startPage';
import LoginPage from './src/pages/loginPage';
import PuantajListPage from './src/pages/puantajList';
import AracListPage from './src/pages/aracListPage';
import YeniAracPage from './src/pages/yeniArac';

const AppNavigator = createStackNavigator({
  Login: { screen: LoginPage },
  Start: { screen: StartPage },
  PuantajList: { screen: PuantajListPage },
  AracList: { screen: AracListPage },
  YeniArac: { screen: YeniAracPage }
},
  {
    headerMode: 'none'
  });

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  async componentWillMount() {
    
    await Expo.Font.loadAsync({
        Roboto: require("native-base/Fonts/Roboto.ttf"),
        Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
        Ionicons: require("native-base/Fonts/Ionicons.ttf")
    });
    this.setState({ loading: false });
}
  render() {
    return <AppContainer />;
  }
}

