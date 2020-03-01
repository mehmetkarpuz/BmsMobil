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
import AracMuayeneTab from './aractabs/aracMuayeneTab';
import AracGuzergahIzinTab from './aractabs/aracGuzergahIzinBelgesi';
import GetAracDetailsByAracId from '../models/getAracDetailsByAracId';
import { navigation } from 'react-navigation';



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
            aracRuhsatResponse: {},
            aracRuhsatResimlerResponse: [],
            aracSigortaResimlerResponse: [],
            aracImmsResponse: {},
            aracImmsResimlerResponse: [],
            aracMuayeneResponse: {},
            aracMuayeneResimlerResponse: [],
            aracGuzergahResponse: {},
            aracGuzergahResimlerResponse: [],
            aracSigortaInfo: {},
            aracSigortaSigortaInfo: {}
        };

        this.getAracResimler = this.getAracResimler.bind(this);
        this.getAracRuhsat = this.getAracRuhsat.bind(this);

        console.log(props);
        var params = props.navigation.state.params;
        if (params != undefined && params != null) {
            if (!params.newArac && params.newArac.wehicleList > 0) {
                this.setState({ searchTerm: params.newArac.wehicleList[0].plaka });
            }
        }
    }

    async componentWillMount() {
        // await Expo.Font.loadAsync({
        //     Roboto: require("../../node_modules/native-base/Fonts/Roboto.ttf"),
        //     Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf"),
        // });
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
                this.getAracMuayene(aracId);
                this.getAracGuzergah(aracId);
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
            if (responseJson.Data) {
                this.setState({
                    aracSigortaInfo: responseJson.Data.insurance,
                });
                if (responseJson.Data.imageList.length > 0) {
                    this.setState({
                        aracResimlerResponse: responseJson.Data.imageList,
                    });
                }
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
            if (responseJson.Data) {
                this.setState({
                    aracRuhsatResponse: responseJson.Data.ruhsat
                });
                if (responseJson.Data.imageList.length > 0) {
                    this.setState({
                        aracRuhsatResimlerResponse: responseJson.Data.imageList
                    });
                }
            }

        }).catch((error) => {
            console.error(error);
        });
    }

    getAracSigorta(aracId) {
        var request = new GetAracDetailsByAracId();
        request.Token = this.state.tokenRequestModel.Token;
        request.AracId = aracId;
        request.SType = 1;
        request.DType = "2";
        this.apiServices.getAracSigortaByAracId(request).then(responseJson => {
            if (responseJson.Data) {
                if (responseJson.Data.imageList.length > 0) {
                    this.setState({
                        aracSigortaResimlerResponse: responseJson.Data.imageList,
                        aracSigortaSigortaInfo: responseJson.Data.insurance
                    });
                }
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    onNewArac = data => {
        this.setState(data);
    };

    getAracImms(aracId) {
        var request = new GetAracDetailsByAracId();
        request.Token = this.state.tokenRequestModel.Token;
        request.AracId = aracId;
        request.SType = 2;
        request.DType = "3";
        this.apiServices.getAracSigortaByAracId(request).then(responseJson => {
            if (responseJson.Data) {
                this.setState({
                    aracImmsResponse: responseJson.Data.insurance
                });
                if (responseJson.Data.imageList.length > 0) {
                    this.setState({
                        aracImmsResimlerResponse: responseJson.Data.imageList
                    });
                }
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    getAracMuayene(aracId) {
        var request = new GetAracDetailsByAracId();
        request.Token = this.state.tokenRequestModel.Token;
        request.AracId = aracId;
        request.SType = 3;
        request.DType = "4";
        this.apiServices.getAracSigortaByAracId(request).then(responseJson => {
            if (responseJson.Data) {
                this.setState({
                    aracMuayeneResponse: responseJson.Data.insurance
                });
                if (responseJson.Data.imageList.length > 0) {
                    this.setState({
                        aracMuayeneResimlerResponse: responseJson.Data.imageList
                    });
                }
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    getAracGuzergah(aracId) {
        var request = new GetAracDetailsByAracId();
        request.Token = this.state.tokenRequestModel.Token;
        request.AracId = aracId;
        this.apiServices.getGuzergahIzinByAracId(request).then(responseJson => {
            if (responseJson.Data) {
                this.setState({
                    aracGuzergahResponse: responseJson.Data.guzergahIzin
                });
                if (responseJson.Data.imageList.length > 0) {
                    this.setState({
                        aracGuzergahResimlerResponse: responseJson.Data.imageList
                    });
                }
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
        if (this.state.loading) {
            return <Expo.AppLoading />;
        }
        return (
            <Container>
                <Header style={{ backgroundColor: '#37bcc7' }} hasTabs />
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
                            <Col size={35} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <TextInput
                                    onChangeText={(text) => this.setState({ searchTerm: text })}
                                    value={this.state.searchTerm}
                                />
                            </Col>
                            <Col size={2}></Col>
                            <Col size={25} style={{
                                backgroundColor: '#fffff',
                                justifyContent: 'flex-start', alignItems: 'flex-start'
                            }}>
                                <Button full light onPress={() => this.getAracListBySearchTerm()}>
                                    <Text>GETİR</Text>
                                </Button>
                            </Col>
                            <Col size={5}></Col>
                            <Col size={30} style={{
                                backgroundColor: '#fffff',
                                justifyContent: 'flex-start', alignItems: 'flex-start'
                            }}>
                                <Button full light onPress={() => this.props.navigation.navigate('YeniArac',{ onNewArac: this.onNewArac })}>
                                    <Text>YENi ARAÇ</Text>
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Tabs initialPage={0}>
                                <Tab heading={<TabHeading style={{ backgroundColor: '#37bcc7' }}><Icon type="FontAwesome" name="file-text" /></TabHeading>}>
                                    <AracInfoTab aracDetailResponse={this.state.aracDetailResponse} />
                                </Tab>
                                <Tab heading={<TabHeading style={{ backgroundColor: '#37bcc7' }}><Icon type="FontAwesome" name="bus" /></TabHeading>}>
                                    <AracResimInfoTab reloadAracResimler={this.getAracResimler} aracSigortaInfo={this.state.aracSigortaInfo} token={this.state.tokenRequestModel.Token} selectedAracId={this.state.selectedAracId} aracResimlerResponse={this.state.aracResimlerResponse} />
                                </Tab>
                                <Tab heading={<TabHeading style={{ backgroundColor: '#37bcc7' }}><Icon type="FontAwesome" name="vcard" /></TabHeading>}>
                                    <AracRuhsatTab reloadAracRuhsatResimler={this.getAracRuhsat} token={this.state.tokenRequestModel.Token} selectedAracId={this.state.selectedAracId} aracRuhsatResponse={this.state.aracRuhsatResponse} aracRuhsatResimlerResponse={this.state.aracRuhsatResimlerResponse} />
                                </Tab>
                                <Tab heading={<TabHeading style={{ backgroundColor: '#37bcc7' }}><Icon type="FontAwesome" name="shield" /></TabHeading>}>
                                    <AracSigortaTab reloadAracSigortaResimler={this.getAracSigorta} token={this.state.tokenRequestModel.Token} aracSigortaResimlerResponse={this.state.aracSigortaResimlerResponse} aracSigortaSigortaInfo={this.state.aracSigortaSigortaInfo} selectedAracId={this.state.selectedAracId}></AracSigortaTab>
                                </Tab>
                                <Tab heading={<TabHeading style={{ backgroundColor: '#37bcc7' }}><Icon type="Entypo" name="shield" /></TabHeading>}>
                                    <AracIMMSTab reloadAracImmsResimler={this.getAracImms} aracImmsResponse={this.state.aracImmsResponse} aracImmsResimlerResponse={this.state.aracImmsResimlerResponse} token={this.state.tokenRequestModel.Token} selectedAracId={this.state.selectedAracId}></AracIMMSTab>
                                </Tab>
                                <Tab heading={<TabHeading style={{ backgroundColor: '#37bcc7' }}><Icon type="MaterialCommunityIcons" name="car-wash" /></TabHeading>}>
                                    <AracMuayeneTab reloadAracMuayeneResimler={this.getAracMuayene} aracMuayeneResponse={this.state.aracMuayeneResponse} aracMuayeneResimlerResponse={this.state.aracMuayeneResimlerResponse} token={this.state.tokenRequestModel.Token} selectedAracId={this.state.selectedAracId}></AracMuayeneTab>
                                </Tab>
                                <Tab heading={<TabHeading style={{ backgroundColor: '#37bcc7' }}><Icon type="FontAwesome" name="road" /></TabHeading>}>
                                    <AracGuzergahIzinTab reloadAracGuzergahResimler={this.getAracGuzergah} aracGuzergahResponse={this.state.aracGuzergahResponse} aracGuzergahResimlerResponse={this.state.aracGuzergahResimlerResponse} token={this.state.tokenRequestModel.Token} selectedAracId={this.state.selectedAracId}></AracGuzergahIzinTab>
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
                    <Row size={5} contentContainerStyle={{ paddingLeft: 20, marginTop: 10, justifyContent: "flex-end", alignContent: "flex-end" }}>
                        <Content contentContainerStyle={{ justifyContent: "flex-end", alignContent: "flex-end" }}>
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
                                            isAracListModalVisible: false,
                                            selectedAracId: item.AracId
                                        });
                                        this.getAracDetails(item.AracId);
                                        this.setState({ searchTerm: item.Plaka })
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