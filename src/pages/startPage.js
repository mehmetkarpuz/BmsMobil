import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Container, Header, Content, Item, Input, Icon, Button } from 'native-base';
import { navigation } from 'react-navigation';
import { Col, Row, Grid } from 'react-native-easy-grid';


export default class StartPage extends Component {

    constructor(props) {
        super(props);
    }

    goPuantajList() {
        this.props.navigation.navigate('PuantajList');
    }

    goAraclist() {
    }

    goSuruclist() {
    }

    render() {
        return (
            <Container style={{ paddingTop: 40 }}>
                <Content>
                    <Grid>
                        <Row size={10} style={{ marginBottom: 40 }}>
                            <Col size={10}></Col>
                            <Col size={35} style={{ alignContent: "flex-start", alignItems: "flex-start", paddingStart: 10 }}>
                                <Image style={{ width: 50, height: 50 }} source={require('../../assets/bmsLoginLogo.png')} />
                            </Col>
                            <Col size={55} style={{ alignContent: "flex-end", alignItems: "flex-end" }}>
                                <Image style={{ width: 150, height: 38 }} source={require('../../assets/ceturlogo300x77.png')} />
                            </Col>
                        </Row>
                        <Row size={30} style={{ marginBottom: 10, alignContent: "center", alignItems: "center" }}>
                            <Col size={10}></Col>
                            <Col size={45} style={{ alignContent: "center", alignItems: "center" }}>
                                <Button rounded light onPress={() => {this.goPuantajList()}} style={styles.puantajBtn}>
                                    <Text style={styles.puantajBtnText} >Puantaj</Text>
                                </Button>
                            </Col>
                            <Col size={45} style={{ alignContent: "center", alignItems: "center" }}>
                                <Button rounded light onPress={this.goAraclist.bind(this)} style={styles.puantajBtn}>
                                    <Text style={styles.puantajBtnText} >Araç</Text>
                                </Button>
                            </Col>
                        </Row>
                        <Row size={30} style={{ marginBottom: 10, alignContent: "center", alignItems: "center" }}>
                            <Col size={10}></Col>
                            <Col size={45} style={{ alignContent: "center", alignItems: "center" }}>
                                <Button rounded light onPress={this.goSuruclist.bind(this)} style={styles.puantajBtn}>
                                    <Text style={styles.puantajBtnText} >Sürücü</Text>
                                </Button>
                            </Col>
                            <Col size={45}>
                            </Col>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    puantajBtn: {
        height: 150,
        width: 150,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    puantajBtnText: {
        fontSize: 25,
        color: "#777575"
    }
});