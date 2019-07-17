import React, { Component } from 'react';
import { TouchableOpacity, Alert, Dimensions, Image, View, Platform, Modal, TextInput, TimePickerAndroid, AsyncStorage, StyleSheet } from 'react-native';
import AracServices from '../services/aracServices';
import {
    Container, Header, DatePicker, Content,
    Icon, Picker, Button, List, ListItem, Text, Left, Body, Right, Switch, Label, Tab, Tabs, TabHeading
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as Expo from "expo";
import TokenRequestModel from '../models/tokenRequestModel';
import GetAracListBySearchTermRequestModel from '../models/getAracListBySearchTermRequestModel';
import AracInfoTab from './aractabs/aracInfoTab';
import AracResimInfoTab from './aractabs/aracResimTab';
import AracRuhsatTab from './aractabs/aracRuhsatTab';
import AracSigortaTab from './aractabs/aracSigortaTab';
import AracIMMSTab from './aractabs/aracIMMSTab';
import GetAracDetailsByAracId from '../models/getAracDetailsByAracId';


export default class AracListPage extends Component {
    apiServices = new AracServices();

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            tokenRequestModel: new TokenRequestModel(),
            searchTerm: "",
            isAracListModalVisible: false,
            aracListTableData: [],
            activeTabValue: -1,
            selectedAracId: 0,
            aracDetailResponse: {
                plaka: "",
                wehicleRentAmount: "",
                modelYear: "",
                gpsBedeli: "",
                description: "",
                owner: {
                    name: "",
                    surname: ""
                },
                wehicleBrand: {
                    brand: ""
                },
                wehicleModel: {
                    model: "",
                    wehicleCapacity: {
                        capacityName: ""
                    }
                }
            },
            aracResimlerResponse: [],
            aracRuhsatResimlerResponse: [],
            aracSigortaResimlerResponse: [],
            aracImmsResimlerResponse: [],
            aracSigortaInfo:{}
        };
    }

    async componentWillMount() {
        await Expo.Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
        });
        this.setState({ loading: false });
    }

    GetUserData() {
        AsyncStorage.getItem('UserInfo').then((res) => {
            var parsed = JSON.parse(res);
            let tempTokenObject = {
                Token: parsed.Token
            };
            this.setState({ tokenRequestModel: tempTokenObject });
        });
    }

    componentDidMount() {
        this.GetUserData();
    }

    getAracListBySearchTerm() {
        this.setState({ aracListTableData: [] });
        if (this.state.searchTerm == "" || this.state.searchTerm == undefined)
            return;
        var request = new GetAracListBySearchTermRequestModel();
        request.SearchTerm = this.state.searchTerm;
        request.Token = this.state.tokenRequestModel.Token;
        this.apiServices.getAracListBySearchTerm(request).then(responseJson => {
            if (responseJson.Data.length > 0) {
                this.setState({
                    isAracListModalVisible: true,
                    aracListTableData: responseJson.Data
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    getAracDetails(aracId) {
        var request = new GetAracDetailsByAracId();
        request.Token = this.state.tokenRequestModel.Token;
        request.AracId = aracId;
        this.apiServices.getAracDetailsByAracId(request).then(responseJson => {
            if (responseJson.Data.wehicleList.length > 0) {

                this.setState({
                    aracDetailResponse: responseJson.Data.wehicleList[0]
                });
                this.getAracResimler(aracId);
                 this.getAracRuhsat(aracId);
                 this.getAracSigorta(aracId);
                 this.getAracImms(aracId);
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    getAracResimler(aracId) {
        var request = new GetAracDetailsByAracId();
        request.Token = this.state.tokenRequestModel.Token;
        request.AracId = aracId;
        request.SType = "9";
        request.DType = "9";
        this.apiServices.getAracResimlerByAracId(request).then(responseJson => {
            if (responseJson.Data.imageList.length > 0) {
                this.setState({
                    aracResimlerResponse: responseJson.Data.imageList,
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    getAracRuhsat(aracId) {
        var request = new GetAracDetailsByAracId();
        request.Token = this.state.tokenRequestModel.Token;
        request.AracId = aracId;
        this.apiServices.getAracRuhsatByAracId(request).then(responseJson => {

            if (responseJson.Data.imageList.length > 0) {
                this.setState({
                    aracRuhsatResimlerResponse: responseJson.Data.imageList,
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    getAracSigorta(aracId) {
        var request = new GetAracDetailsByAracId();
        request.Token = this.state.tokenRequestModel.Token;
        request.AracId = aracId;
        request.SType = 9;
        request.DType = "2";
        this.apiServices.getAracSigortaByAracId(request).then(responseJson => {
            console.log(responseJson.Data.insurance);
            this.setState({
                aracSigortaInfo: responseJson.Data.insurance,
            });
            if (responseJson.Data.imageList.length > 0) {
                this.setState({
                    aracSigortaResimlerResponse: responseJson.Data.imageList,
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    getAracImms(aracId) {
        var request = new GetAracDetailsByAracId();
        request.Token = this.state.tokenRequestModel.Token;
        request.AracId = aracId;
        request.SType = 2;
        request.DType = "3";
        this.apiServices.getAracSigortaByAracId(request).then(responseJson => {
            if (responseJson.Data.imageList.length > 0) {
                this.setState({
                    aracImmsResimlerResponse: responseJson.Data.imageList,
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    // openTab(aracId, tabIndex) {
    //     console.log("tabIndex", tabIndex);
    //     switch (tabIndex) {
    //         case 0:
    //             this.getAracDetails(aracId);
    //             break;
    //         case 1:
    //             this.getAracResimler(aracId);
    //             break;
    //         case 2:
    //             this.getAracRuhsat(aracId);
    //             break;

    //         default:
    //             break;
    //     }
    // }

    render() {

        return (
            <Container>
                <Header hasTabs />
                <Content>
                    <Grid style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 2 }}>
                        <Row size={20} style={{ marginBottom: 10 }}>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Image style={{ width: 50, height: 50 }} source={require('../../assets/bmsLoginLogo.png')} />
                            </Col>
                            <Col size={60} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-end', justifyContent: 'center'
                            }}>
                                <Image style={{ width: 110, height: 28 }} source={require('../../assets/ceturlogo300x77.png')} />
                            </Col>
                        </Row>
                        <Row size={5} style={{ marginBottom: 5 }}>
                            <Col size={55} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <TextInput
                                    onChangeText={(text) => this.setState({ searchTerm: text })}
                                    value={this.state.searchTerm}
                                />
                            </Col>
                            <Col size={5}></Col>
                            <Col size={40} style={{
                                backgroundColor: '#fffff',
                                justifyContent: 'flex-start', alignItems: 'flex-start'
                            }}>
                                <Button full light onPress={() => this.getAracListBySearchTerm()}>
                                    <Text>GETİR</Text>
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Tabs initialPage={-1} locked="true">
                                <Tab heading={<TabHeading><Icon name="bus" /></TabHeading>}>
                                    <AracInfoTab aracDetailResponse={this.state.aracDetailResponse} />
                                </Tab>
                                <Tab heading={<TabHeading><Icon name="camera" /></TabHeading>}>
                                    <AracResimInfoTab reloadAracResimler={this.getAracResimler} aracSigortaInfo={this.state.aracSigortaInfo} token={this.state.tokenRequestModel.Token} selectedAracId={this.state.selectedAracId} aracResimlerResponse={this.state.aracResimlerResponse} />
                                </Tab>
                                <Tab heading={<TabHeading><Icon type="FontAwesome" name="vcard" /></TabHeading>}>
                                    <AracRuhsatTab aracRuhsatResimlerResponse={this.state.aracRuhsatResimlerResponse} />
                                </Tab>
                                <Tab heading={<TabHeading><Icon type="FontAwesome" name="shield" /></TabHeading>}>
                                    <AracSigortaTab aracSigortaResimlerResponse={this.state.aracSigortaResimlerResponse}></AracSigortaTab>
                                </Tab>
                                <Tab heading={<TabHeading><Icon type="FontAwesome" name="car" /></TabHeading>}>
                                    <AracIMMSTab aracImmsResimlerResponse={this.state.aracImmsResimlerResponse}></AracIMMSTab>
                                </Tab>
                                <Tab heading={<TabHeading><Icon type="FontAwesome" name="hospital-o" /></TabHeading>}>
                                </Tab>
                                <Tab heading={<TabHeading><Icon type="FontAwesome" name="file-text" /></TabHeading>}>
                                </Tab>
                            </Tabs>
                        </Row>
                    </Grid>
                </Content>
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.isAracListModalVisible}
                    onRequestClose={() => {
                    }}>
                    <Row size={5} style={{ paddingLeft: 20, marginTop: 10, justifyContent: "flex-end", alignContent: "flex-end" }}>
                        <Content style={{ justifyContent: "flex-end", alignContent: "flex-end" }}>
                            <Button danger onPress={() => {
                                this.setState({
                                    isAracListModalVisible: false
                                });
                            }}>
                                <Icon name='close' />
                            </Button>
                        </Content>
                    </Row>
                    <Row size={10}>
                        <Content>
                            <ListItem style={{ padding: 0 }}>
                                <Body>
                                    <Text>Araç</Text>
                                </Body>
                            </ListItem>
                        </Content>
                    </Row>
                    <Row size={85}>
                        <Content>
                            <List dataArray={this.state.aracListTableData}
                                renderRow={(item, sectionID, rowID, higlightRow) =>
                                    <ListItem style={{ padding: 0 }} onPress={() => {
                                        this.setState({
                                            isAracListModalVisible: false
                                        });
                                        this.state.selectedAracId = item.AracId;
                                        this.getAracDetails(item.AracId);
                                    }}>
                                        <Col size={35} style={{ alignContent: "center" }}>
                                            <Row size={100}><Text>{item.Plaka}</Text></Row>
                                        </Col>
                                    </ListItem>
                                }>
                            </List>
                        </Content>
                    </Row>
                </Modal>
            </Container>
        );
    }

}