import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import StartPage from './src/pages/startPage';
import LoginPage from './src/pages/loginPage';
import PuantajListPage from './src/pages/puantajList';

const AppNavigator = createStackNavigator({
  Login: { screen: LoginPage }, 
  Start: { screen: StartPage },
  PuantajList: { screen: PuantajListPage }  
},
{
    headerMode:'none'
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
