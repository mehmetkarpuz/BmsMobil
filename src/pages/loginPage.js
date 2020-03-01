import React, { Component } from 'react';
import { View, Alert, Image, Text, ActivityIndicator } from 'react-native';
import { Container, Header, Content, Item, Icon ,Input, Button } from 'native-base';
import LoginService from '../services/loginService';
import { navigation } from 'react-navigation';
import { Col, Row, Grid } from 'react-native-easy-grid';

export default class LoginPage extends Component {
    apiServices = new LoginService();

    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            userPassword: "",
            animateLogin: false
        };
    }

    goLogin() {
        var userName = this.state.userName;
        var pass = this.state.userPassword;
        this.setState({ animateLogin: true });
        this.apiServices.login(userName, pass).then(responseJson => {
            this.setState({ animateLogin: false });
            if (responseJson.IsSuccess == true) {
                this.apiServices.SetUserData(JSON.stringify(responseJson.Data));
                this.props.navigation.navigate('Start');
            }
            else {
                Alert.alert("Hata:" + responseJson.ExceptionMsg);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        const isLoading = this.state.animateLogin;
        return (
            <Container style={{ paddingTop: 70 }}>
                <Content style={{ paddingLeft: 5, paddingRight: 5 }}>
                    <Grid style={{ marginTop: 70 }}>
                        <Row size={40} style={{ marginBottom: 40 }}>
                            <Col size={100} style={{ alignContent: "center", alignItems: "center" }}>
                                <Image source={require('../../assets/bmsLoginLogo.png')} />
                            </Col>
                        </Row>
                        <View style={{ justifyContent: 'space-around', }}>
                            {isLoading && (
                                <ActivityIndicator
                                    animating={this.state.animateLogin}
                                    style={{ height: 80 }}
                                    color="#0000ff"
                                    size="large"
                                    hidesWhenStopped={true}
                                />
                            )}
                        </View>
                        <Row size={20} style={{ marginBottom: 5 }}>
                            <Col size={100}>
                                <Item>
                                    <Icon style={{ color: '#E9E5E4', padding: 0 }} name="md-person"></Icon>
                                    <Input value={this.state.userName}
                                        onChangeText={(value) => this.setState({ userName: value })}
                                        placeholder='Email' />
                                </Item>
                            </Col>
                        </Row>
                        <Row size={20} style={{ marginBottom: 15 }}>
                            <Col size={100}>
                                <Item>
                                    <Icon style={{ color: '#E9E5E4', padding: 0 }} name="lock"></Icon>
                                    <Input secureTextEntry={true} onChangeText={(value) => this.setState({ userPassword: value })}
                                        value={this.state.userPassword}
                                        placeholder='Şifre' />
                                </Item>
                            </Col>
                        </Row>
                    </Grid>
                    <Grid tyle={{ paddingLeft: 5, paddingRight: 5, paddingTop: 5 }}>
                        <Row size={20} style={{ alignContent: "center", alignItems: "center" }}>
                            <Col size={50} >
                                <Button block rounded light
                                    onPress={this.goLogin.bind(this)}>
                                    <Text>Giriş</Text>
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                    <Grid style={{ marginTop: 150 }}>
                        <Row size={100}>
                            <Col size={100} style={{ alignContent: "center", alignItems: "center" }}>
                                <Image style={{ width: 150, height: 38 }} source={require('../../assets/ceturlogo300x77.png')} />
                            </Col>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        );
    }
}