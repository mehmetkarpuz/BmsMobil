import React, { Component } from 'react';
import {
    Container, Content,
    Text, Thumbnail, Button, Icon, DatePicker, Picker,
} from 'native-base';
import { Image, Dimensions, ScrollView, Alert, Modal, TextInput, AsyncStorage } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import AracServices from '../services/aracServices';
import Utils from '../common/utils';
import { navigation } from 'react-navigation';
import TokenRequestModel from '../models/tokenRequestModel';
import insertAracRequestModel from '../models/insertAracRequestModel';

export default class YeniAracPage extends Component {

    apiServices = new AracServices();
    utils = new Utils();
    constructor(props) {
        super(props);
        this.state = {
            tokenRequestModel: new TokenRequestModel(),
            plaka: "",
            plakaFirst: "",
            plakaMiddle: "",
            plakaLast: "",
            type: "",
            capacity: "",
            ownerID: "",
            description: "",
            WBID: "",
            WMID: "",
            aracKira: "",
            modelYear: "",
            gpsBedeli: "",
            prm_strTrackingDeviceNo: "",
            prm_itrackingDeviceFirmId: 0,
            modelList: [],
            capacityList: [],
            subContractorList: [],
            showSubContractorCombo: false,
            newArac: {}
        }
    }

    GetUserData() {
        AsyncStorage.getItem('UserInfo').then((res) => {
            var parsed = JSON.parse(res);
            let tempTokenObject = {
                Token: parsed.Token
            };
            this.setState({ tokenRequestModel: tempTokenObject });
            this.getCapacityList();
        });
    }

    componentDidMount() {
        this.GetUserData();
    }

    onBrandChange(value) {
        this.setState({
            WBID: value
        });
        this.getModelList(value);
    }

    onSubCotractorChange(value) {
        this.setState({ ownerID: value });
    }

    onWehicleTypeChange(value) {
        this.setState({ type: value });
        if (value == "2" || value == "3") { //Taşeron , Kiralık
            this.setState({ showSubContractorCombo: true });
            this.getSubContractors();

        }
        if (value == "1") { //Şirket
            this.setState({ showSubContractorCombo: false });
            this.setState({ ownerID: "" });
        }
    }

    //this.setState({ type : val })

    getModelList(brandId) {
        var request = {
            brandID: brandId,
            Token: this.state.tokenRequestModel.Token
        };
        this.apiServices.getModelList(request).then(responseJson => {
            if (responseJson.IsSuccess == true) {
                let tempModelList = responseJson.Data.wehicleModelList.map((x, i) => {
                    return (<Picker.Item label={x.model} key={x.ID} value={x.ID} />)
                });
                this.setState({
                    modelList: tempModelList
                });
            }
            else {
                Alert.alert(responseJson.ExceptionMsg);
            }

        }).catch((error) => {
            console.log(error);
        });
    }


    getCapacityList() {
        this.apiServices.getCapacityList(this.state.tokenRequestModel).then(responseJson => {
            if (responseJson.IsSuccess == true) {
                let tempCapacityList = responseJson.Data.wehicleCapacities.map((x, i) => {
                    return (<Picker.Item label={x.capacityName} key={x.wehicleCapacityID} value={x.wehicleCapacityID} />)
                });
                this.setState({
                    capacityList: tempCapacityList
                });
            }
            else {
                Alert.alert(responseJson.ExceptionMsg);
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    getSubContractors() {
        var request = {
            Token: this.state.tokenRequestModel.Token,
            type: "0",
            active: "true",
            dataRequestStatus: "2"
        };
        this.apiServices.getSubContractors(request).then(responseJson => {
            if (responseJson.IsSuccess == true) {
                let tempSubContractorList = responseJson.Data.map((x, i) => {
                    return (<Picker.Item label={x.Name} key={x.Id} value={x.Id} />)
                });
                this.setState({
                    subContractorList: tempSubContractorList
                });
            }
            else {
                Alert.alert(responseJson.ExceptionMsg);
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    goBack() {
        const { navigation } = this.props;
        navigation.goBack();
        navigation.state.params.onNewArac({ newArac: this.state.newArac });
    }


    saveArac() {
        if (this.state.type == "1")
            this.state.ownerID = "";
            else if  (this.state.type == "2"){
                Alert.alert("Taşeron seçimi yapılmalıdır.");
                return;
            }
        if (this.state.prm_itrackingDeviceFirmId == null || this.state.prm_itrackingDeviceFirmId == undefined || this.state.prm_itrackingDeviceFirmId == "")
            this.prm_itrackingDeviceFirmId = 0;
        var request = new insertAracRequestModel();
        request.Token = this.state.tokenRequestModel.Token;
        request.WBID = this.state.WBID;
        request.WMID = this.state.WMID;
        request.aracKira = this.state.aracKira;
        request.capacity = this.state.capacity;
        request.description = this.state.description;
        request.gpsBedeli = this.state.gpsBedeli;
        request.modelYear = this.state.modelYear;
        request.ownerID = this.state.ownerID;
        request.plaka = this.state.plakaFirst + " " + this.state.plakaMiddle + " " + this.state.plakaLast;
        request.plakaFirst = this.state.plakaFirst;
        request.plakaLast = this.state.plakaLast;
        request.plakaMiddle = this.state.plakaMiddle;
        request.prm_itrackingDeviceFirmId = this.state.prm_itrackingDeviceFirmId;
        request.prm_strTrackingDeviceNo = this.state.prm_strTrackingDeviceNo;
        request.type = this.state.type;
        request.isUpdate = false;
        this.apiServices.insertArac(request).then(responseJson => {
            if (responseJson.IsSuccess) {
                this.setState({
                    newArac: responseJson.Data
                });
                Alert.alert("Başarılı");
                this.goBack();
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        const display1 = this.state.showSubContractorCombo ? "flex" : "none";

        return (
            <ScrollView vertical={true}>
                <Content>
                    <Grid style={{ marginTop: 10, paddingLeft: 5, paddingRight: 5, paddingTop: 8 }}>
                        <Row size={5} style={{ marginTop: 10, marginBottom: 5, alignContent: "center", alignItems: "center" }}>
                            <Col size={30} style={{ marginBottom: 5 }}>
                                <Text style={{ fontWeight: "bold" }}>Araç Tipi : </Text>
                            </Col>
                            <Col size={70} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.type}
                                    onValueChange={this.onWehicleTypeChange.bind(this)}
                                >
                                    <Picker.Item label="Şirket Aracı" value="1" />
                                    <Picker.Item label="Taşeron Aracı" value="2" />
                                    <Picker.Item label="Kiralık Araç" value="3" />
                                </Picker>
                            </Col>
                        </Row>
                        <Row size={5} style={{ display: display1, marginTop: 10, marginBottom: 5, alignContent: "center", alignItems: "center" }}>
                            <Col size={30} style={{ marginBottom: 5 }}>
                                <Text style={{ fontWeight: "bold" }}>Taşeronlar : </Text>
                            </Col>
                            <Col size={70} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.ownerID}
                                    onValueChange={this.onSubCotractorChange.bind(this)}
                                >
                                    <Picker.Item label="Seçim Yapınız" value="-1" />
                                    {this.state.subContractorList}
                                </Picker>
                            </Col>
                        </Row>
                        <Row size={5} style={{ marginBottom: 5, alignContent: "center", alignItems: "center" }}>
                            <Col size={30} style={{ marginBottom: 5 }}>
                                <Text style={{ fontWeight: "bold" }}>Plaka : </Text>
                            </Col>
                            <Col size={20} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <TextInput
                                    onChangeText={(text) => this.setState({ plakaFirst: text })}
                                    value={this.state.plakaFirst}
                                />
                            </Col>
                            <Col size={30} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <TextInput
                                    onChangeText={(text) => this.setState({ plakaMiddle: text })}
                                    value={this.state.plakaMiddle}
                                />
                            </Col>
                            <Col size={20} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <TextInput
                                    onChangeText={(text) => this.setState({ plakaLast: text })}
                                    value={this.state.plakaLast}
                                />
                            </Col>
                        </Row>
                        <Row size={5} style={{ marginBottom: 5, alignContent: "center", alignItems: "center" }}>
                            <Col size={30} style={{ marginBottom: 5 }}>
                                <Text style={{ fontWeight: "bold" }}>Takip Cihazı Firması : </Text>
                            </Col>
                            <Col size={70} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.prm_itrackingDeviceFirmId}
                                    onValueChange={(val) => {
                                        this.setState({
                                            prm_itrackingDeviceFirmId: val
                                        });
                                    }} >
                                    <Picker.Item label="Seç" value="" />
                                    <Picker.Item label="Arvento" value="1" />
                                    <Picker.Item label="Infotech" value="2" />
                                </Picker>
                            </Col>
                        </Row>
                        <Row size={5} style={{ marginBottom: 5, alignContent: "center", alignItems: "center" }}>
                            <Col size={30} style={{ marginBottom: 5 }}>
                                <Text style={{ fontWeight: "bold" }}>Takip Cihazı No : </Text>
                            </Col>
                            <Col size={70} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <TextInput
                                    onChangeText={(text) => this.setState({ prm_strTrackingDeviceNo: text })}
                                    value={this.state.prm_strTrackingDeviceNo}
                                />
                            </Col>
                        </Row>
                        <Row size={5} style={{ marginBottom: 5, alignContent: "center", alignItems: "center" }}>
                            <Col size={30} style={{ marginBottom: 5 }}>
                                <Text style={{ fontWeight: "bold" }}>Marka : </Text>
                            </Col>
                            <Col size={70} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.WBID}
                                    onValueChange={this.onBrandChange.bind(this)}
                                >
                                    <Picker.Item label="Marka Seç" value="-1" />
                                    <Picker.Item label="Mercedes" value="1" />
                                    <Picker.Item label="Wolksvagen" value="2" />
                                    <Picker.Item label="Temsa" value="3" />
                                    <Picker.Item label="Isuzu" value="4" />
                                    <Picker.Item label="Iveco" value="5" />
                                    <Picker.Item label="Otokar" value="6" />
                                    <Picker.Item label="Fiat" value="7" />
                                    <Picker.Item label="Citroen" value="8" />
                                    <Picker.Item label="Ford" value="9" />
                                    <Picker.Item label="Renault" value="10" />
                                    <Picker.Item label="Peugeot" value="11" />
                                    <Picker.Item label="Opel" value="12" />
                                    <Picker.Item label="Mıtsubıshi" value="13" />
                                    <Picker.Item label="Man" value="14" />
                                    <Picker.Item label="Mercedes" value="15" />
                                    <Picker.Item label="Dacia" value="16" />
                                    <Picker.Item label="Peugeot" value="17" />
                                    <Picker.Item label="Karsan" value="18" />
                                    <Picker.Item label="Toyota" value="19" />
                                    <Picker.Item label="Audi" value="20" />
                                    <Picker.Item label="Hyundai" value="21" />
                                </Picker>
                            </Col>
                        </Row>
                        <Row size={5} style={{ marginBottom: 5, alignContent: "center", alignItems: "center" }}>
                            <Col size={30} style={{ marginBottom: 5 }}>
                                <Text style={{ fontWeight: "bold" }}>Model : </Text>
                            </Col>
                            <Col size={70} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.WMID}
                                    onValueChange={(val) => {
                                        this.setState({
                                            WMID: val
                                        });
                                    }} >
                                    <Picker.Item label="Model Seç" value="-1" />
                                    {this.state.modelList}
                                </Picker>
                            </Col>
                        </Row>
                        <Row size={5} style={{ marginBottom: 5, alignContent: "center", alignItems: "center" }}>
                            <Col size={30} style={{ marginBottom: 5 }}>
                                <Text style={{ fontWeight: "bold" }}>Araç Kirası : </Text>
                            </Col>
                            <Col size={70} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <TextInput
                                    onChangeText={(text) => this.setState({ aracKira: text })}
                                    value={this.state.aracKira}
                                />
                            </Col>
                        </Row>
                        <Row size={5} style={{ marginBottom: 5, alignContent: "center", alignItems: "center" }}>
                            <Col size={30} style={{ marginBottom: 5 }}>
                                <Text style={{ fontWeight: "bold" }}>Kapasite : </Text>
                            </Col>
                            <Col size={70} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.capacity}
                                    onValueChange={(val) => {
                                        this.setState({
                                            capacity: val
                                        });
                                    }} >
                                    <Picker.Item label="Kapasite Seç" value="-1" />
                                    {this.state.capacityList}
                                </Picker>
                            </Col>
                        </Row>
                        <Row size={5} style={{ marginBottom: 5, alignContent: "center", alignItems: "center" }}>
                            <Col size={30} style={{ marginBottom: 5 }}>
                                <Text style={{ fontWeight: "bold" }}>Model Yılı : </Text>
                            </Col>
                            <Col size={70} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <Picker
                                    mode="dropdown"
                                    iosIcon={<Icon name="ios-arrow-down-outline" />}
                                    placeholderStyle={{ color: "#bfc6ea" }}
                                    placeholderIconColor="#007aff"
                                    selectedValue={this.state.modelYear}
                                    onValueChange={(val) => {
                                        this.setState({
                                            modelYear: val
                                        });
                                    }} >
                                    <Picker.Item label="2000" value="2000" />
                                    <Picker.Item label="2001" value="2001" />
                                    <Picker.Item label="2002" value="2002" />
                                    <Picker.Item label="2003" value="2003" />
                                    <Picker.Item label="2004" value="2004" />
                                    <Picker.Item label="2005" value="2005" />
                                    <Picker.Item label="2006" value="2006" />
                                    <Picker.Item label="2007" value="2007" />
                                    <Picker.Item label="2008" value="2008" />
                                    <Picker.Item label="2009" value="2009" />
                                    <Picker.Item label="2010" value="2010" />
                                    <Picker.Item label="2011" value="2011" />
                                    <Picker.Item label="2012" value="2012" />
                                    <Picker.Item label="2013" value="2013" />
                                    <Picker.Item label="2014" value="2014" />
                                    <Picker.Item label="2015" value="2015" />
                                    <Picker.Item label="2016" value="2016" />
                                    <Picker.Item label="2017" value="2017" />
                                    <Picker.Item label="2017" value="2017" />
                                    <Picker.Item label="2018" value="2018" />
                                    <Picker.Item label="2019" value="2019" />
                                    <Picker.Item label="2020" value="2020" />
                                </Picker>
                            </Col>
                        </Row>
                        <Row size={5} style={{ marginBottom: 5, alignContent: "center", alignItems: "center" }}>
                            <Col size={30} style={{ marginBottom: 5 }}>
                                <Text style={{ fontWeight: "bold" }}>GPS Bedeli : </Text>
                            </Col>
                            <Col size={70} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <TextInput
                                    onChangeText={(text) => this.setState({ gpsBedeli: text })}
                                    value={this.state.gpsBedeli}
                                />
                            </Col>
                        </Row>
                        <Row size={5} style={{ marginBottom: 5, alignContent: "center", alignItems: "center" }}>
                            <Col size={30} style={{ marginBottom: 5 }}>
                                <Text style={{ fontWeight: "bold" }}>Açıklama : </Text>
                            </Col>
                            <Col size={70} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <TextInput
                                    onChangeText={(text) => this.setState({ description: text })}
                                    value={this.state.description}
                                />
                            </Col>
                        </Row>
                        <Row size={5} style={{ marginBottom: 5, alignContent: "center", alignItems: "center" }}>
                            <Col size={40} style={{ marginBottom: 5 }}>
                                <Button full light onPress={() => this.goBack}>
                                    <Text>VAZGEÇ</Text>
                                </Button>
                            </Col>
                            <Col size={10} style={{ marginBottom: 5 }}>

                            </Col>
                            <Col size={40} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <Button full light onPress={() => this.saveArac()}>
                                    <Text>KAYDET</Text>
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </Content>
            </ScrollView>
        );
    }
}