import React, { Component } from 'react';
import { TouchableOpacity, Alert, Dimensions, Image, View, Platform, Modal, TimePickerAndroid, AsyncStorage, StyleSheet } from 'react-native';
import PuantajServices from '../services/puantajServices';
import {
    Container, Header, DatePicker, Content,
    Icon, Picker, Button, List, ListItem, Text, Left, Body, Right, Switch, Label
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as Expo from "expo";
import PuantajAtaRequestModel from '../models/puantajAtaRequestModel'
import GetPuantajDetailRequest from '../models/getPuantajDetailRequest'
import LoginServices from '../services/loginService';
import TokenRequestModel from '../models/tokenRequestModel';
import GetProjectRequestByGarageModel from '../models/getProjectRequestByGarageModel';
import GetPuantajListByDateRequestModel from '../models/getPuantajListByDateModel';
import GetBolgeAracRequestModel from '../models/getBolgeAracRequestModel';
import GetGuzergahFiyatRequestModel from '../models/getGuzzergahFiyatListModel';
import DeletePuantajRequestModel from '../models/deletePuantajRequestModel';

export default class PuantajListPage extends Component {
    apiServices = new PuantajServices();
    loginService = new LoginServices();

    constructor(props) {
        super(props);
        this.state = {
            chosenDate: new Date(),
            selectedGarage: undefined,
            selectedProject: undefined,
            loading: true,
            garageListPickerOptions: [],
            projectListPickerOptions: [],
            puantajListTable: [],
            bolgeAracListPickerOptions: [],
            guzergahFiyatListPickerOptions: [],
            aracFiyatListPickerOptions: [],
            isPuantajModalVisible: false,
            selectedBolgeAracId: 0,
            selectedGuzergahFiyati: "-11",
            selectedAracFiyati: "-11",
            selectedTime: "00:00",
            selectedGuzergahId: -1,
            selectedDagitmaToplama: "1",
            pauntajKisitiVarmi: false,
            datePickerDefaultDate: new Date(),

            isPuantajDetailModalVisible: false,
            guzergahDetailListTable: [],
            selectedDetailPlaka: "",
            selectedDetailGuzergahId: -1,
            tokenRequestModel: new TokenRequestModel()
        };
        this.setDate = this.setDate.bind(this);
    }

    setDate(newDate) {
        var d = new Date(newDate);
        d.setMinutes(d.getMinutes() + d.getTimezoneOffset() * -1);
        this.setState({ chosenDate: d });
    }

    onGarageChange(value) {
        this.setState({
            selectedGarage: value
        });
        this.projectList(value);
        this.getBolgeAracList(value);
    }

    onProjectChange(value) {
        this.setState({
            selectedProject: value
        });
    }

    onPressRouteList() {
        let splt = this.state.selectedProject.split("-");
        var request = new GetPuantajListByDateRequestModel();
        request.EntryId = splt[0];
        request.EntryTypeID = splt[1];
        request.SelectedDate = this.state.chosenDate;
        request.Token = this.state.tokenRequestModel.Token;
        this.apiServices.getPuantajListByDate(request).then(responseJson => {
            if (responseJson.Data.length > 0) {
                this.setState({
                    pauntajKisitiVarmi: responseJson.Data[0].PuantajBlockluMu
                });
            }

            this.setState({
                puantajListTable: responseJson.Data
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    setModalVisible(visible) {
        this.setState({ isPuantajModalVisible: visible });
    }


    ozelPuantajAta() {
        let request = new PuantajAtaRequestModel();
        request.GuzergahId = this.state.selectedGuzergahId;
        request.MusteriFiyatiId = this.state.selectedGuzergahFiyati == -11 ? null : this.state.selectedGuzergahFiyati;
        request.TaseronFiyatiId = this.state.selectedAracFiyati == -11 ? null : this.state.selectedAracFiyati;;
        request.Time = this.state.selectedTime;
        request.AracId = this.state.selectedBolgeAracId;
        request.Tarih = this.state.chosenDate;
        request.DagitmaToplama = this.state.selectedDagitmaToplama;
        request.Token = this.state.tokenRequestModel.Token;
        if (request.MusteriFiyatiId == -1) {
            request.MusteriFiyatiUygulansin = false;
        }
        else {
            request.MusteriFiyatiUygulansin = true;
        }
        this.apiServices.ozelPuantajAta(request).then(responseJson => {
            if (responseJson.IsSuccess) {
                Alert.alert("Kayıt başarılı");
                this.setModalVisible(false);
            }
            else {
                Alert.alert(responseJson.ExceptionMsg);
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getSelectedGuzergahPuantajDetails(guzergahId) {
        this.setState({ guzergahDetailListTable: [] });
        let request = new GetPuantajDetailRequest();
        request.GuzergahId = guzergahId;
        request.SelectedDate = this.state.chosenDate;
        request.Token = this.state.tokenRequestModel.Token;
        this.apiServices.getPuantajDetailsByGuzergahId(request).then(responseJson => {
            this.setState({
                guzergahDetailListTable: responseJson.Data
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    async openTimePicker() {
        try {
            const { action, hour, minute } = await TimePickerAndroid.open({
                hour: 14,
                minute: 0,
                is24Hour: true
            });
            if (action !== TimePickerAndroid.dismissedAction) {
                let tempHour = hour;
                tempHour = tempHour.toString().length == 1 ? "0" + tempHour : tempHour;
                this.setState({
                    selectedTime: tempHour.toString() + ":" + minute.toString()
                });
            }
        } catch ({ code, message }) {
            console.warn('Cannot open time picker', message);
        }
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
            this.garageList();
        });
    }

    componentDidMount() {
        this.GetUserData();
    }

    getBolgeAracList(bolgeId) {
        var request = new GetBolgeAracRequestModel();
        request.BolgeId = bolgeId;
        request.Token = this.state.tokenRequestModel.Token;

        this.apiServices.getBolgeAracListesi(request).then(responseJson => {
            let tempList = responseJson.Data.map((x, i) => {
                return (<Picker.Item label={x.Plaka} key={x.AracId} value={x.AracId} />)
            });
            this.setState({
                bolgeAracListPickerOptions: tempList
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    garageList() {
        this.apiServices.getGarageList(this.state.tokenRequestModel).then(responseJson => {
            if (responseJson.IsSuccess == true) {
                let tempGarageList = responseJson.Data.map((x, i) => {
                    return (<Picker.Item label={x.Name} key={x.Id} value={x.Id} />)
                });
                this.setState({
                    garageListPickerOptions: tempGarageList
                });
            }
            else {
                Alert.alert(responseJson.ExceptionMsg);
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    projectList(garagId) {
        if (garagId == "-1" || garagId == undefined)
            return;
        var request = new GetProjectRequestByGarageModel();
        request.GarageId = garagId;
        request.Token = this.state.tokenRequestModel.Token;
        this.apiServices.getProjectList(request).then(response => { return response.json() }).then(responseJson => {
            let tempList = responseJson.Data.map((x, i) => {
                let itemVal = x.EntryID + "-" + x.EntryTypeID
                return (<Picker.Item label={x.Name} key={i} value={itemVal} />)
            });
            this.setState({
                projectListPickerOptions: tempList
            });
        }).catch((error) => {
            console.error(error);
        });
    }


    getGuzergahFiyatListByGuzergahId(guzergahId) {
        if (guzergahId == "-1" || guzergahId == undefined)
            return;
        this.setState({
            selectedGuzergahId: guzergahId
        });
        var request = new GetGuzergahFiyatRequestModel();
        request.GuzergahId = guzergahId;
        request.Token = this.state.tokenRequestModel.Token;

        this.apiServices.getGuzergahFiyatListByGuzergahId(request).then(responseJson => {
            let tempList = responseJson.Data.map((x, i) => {
                return (<Picker.Item label={x.Kapasite} key={i} value={x.AracKapasiteID} />)
            });
            this.setState({
                guzergahFiyatListPickerOptions: tempList
            });
            this.setState({
                aracFiyatListPickerOptions: tempList
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    deletePuantaj(plaka, guzergahId, seferId) {
        var request = new DeletePuantajRequestModel();
        request.GuzergahId = guzergahId;
        request.Plaka = plaka;
        request.SeferId = seferId;
        request.Tarih = this.state.chosenDate;
        request.Token = this.state.tokenRequestModel.Token;
        this.apiServices.deletePuantaj(request).then(responseJson => {
            if (responseJson.IsSuccess) {
                Alert.alert("İşlem başarılı");
            }
            else {
                Alert.alert(responseJson.ExceptionMsg);
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        if (this.state.loading) {
            return <Expo.AppLoading />;
        }
        const state = this.state;
        // const deviceWidth = Dimensions.get("window").width;
        // const deviceHeight = Platform.OS === "ios"
        //     ? Dimensions.get("window").height
        //     : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");

        return (
            <Container>
                <Header />
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
                        <Row size={5} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                placeholder="Bölge"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.selectedGarage}
                                onValueChange={this.onGarageChange.bind(this)}>
                                <Picker.Item label="Bölge Seç" value="-1" />
                                {this.state.garageListPickerOptions}
                            </Picker>
                        </Row>
                        <Row size={5} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                placeholder="Proje"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.selectedProject}
                                onValueChange={this.onProjectChange.bind(this)} >
                                <Picker.Item label="Proje Seç" value="-1" />
                                {this.state.projectListPickerOptions}
                            </Picker>
                        </Row>
                        <Row size={5} style={{ marginBottom: 5 }}>
                            <Col size={55} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                <DatePicker
                                    defaultDate={this.state.datePickerDefaultDate}
                                    minimumDate={this.state.datePickerDefaultDate}
                                    maximumDate={new Date(2100, 12, 31)}
                                    locale={"tr"}
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode={"default"}
                                    placeHolderText="Tarih Seçiniz"
                                    textStyle={{ color: "green" }}
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onDateChange={this.setDate} />
                            </Col>
                            <Col size={5}></Col>
                            <Col size={40} style={{
                                backgroundColor: '#fffff',
                                justifyContent: 'flex-start', alignItems: 'flex-start'
                            }}>
                                <Button full light onPress={() => this.onPressRouteList()}>
                                    <Text>GETİR</Text>
                                </Button>
                            </Col>
                        </Row>
                        <Row size={5} style={{ padding: 0 }}>
                            <Content style={{ padding: 0 }}>
                                <ListItem style={{ padding: 0 }}>
                                    <Col size={15}><Text>Ekle</Text></Col>
                                    <Col size={50}><Text>Güzergah</Text></Col>
                                    <Col size={15}><Text>Tek</Text></Col>
                                    <Col size={20}><Text>Detay</Text></Col>
                                </ListItem>
                            </Content>
                        </Row>
                        <Row size={60} style={{ padding: 0 }}>
                            <Content>
                                <List dataArray={this.state.puantajListTable}
                                    renderRow={(item) =>
                                        <ListItem style={{ padding: 0 }}>
                                            <Col size={10} style={{ alignContent: "flex-start", padding: 0 }}>
                                                <Row style={{ padding: 0 }} >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            if (item.PuantajBlockluMu == false) {
                                                                this.getGuzergahFiyatListByGuzergahId(item.GuzergahId);
                                                                this.setModalVisible(true);
                                                            }
                                                            else {
                                                                Alert.alert("Seçtiğiniz tarih için puantaj kısıtı mevcuttur.");
                                                            }
                                                        }}>
                                                        <Icon style={{ color: '#28a745', padding: 0 }} name="md-add-circle"></Icon>
                                                    </TouchableOpacity>
                                                </Row>
                                            </Col>
                                            <Col size={60} style={{ alignContent: "center" }}>
                                                <Row size={100}><Text>{item.GuzergahAdi}</Text></Row>
                                            </Col>
                                            <Col size={15} style={{ alignContent: "flex-end" }}>
                                                <Row size={100}><Text>{item.Tek}</Text></Row>
                                            </Col>
                                            <Col size={15} style={{ alignContent: "flex-end" }}>
                                                <Row size={100}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            if (item.Tek > 0) {
                                                                this.setState({ isPuantajDetailModalVisible: true });
                                                                this.getSelectedGuzergahPuantajDetails(item.GuzergahId);
                                                            }
                                                        }}>
                                                        <Icon style={{ padding: 0, color: '#30FE05' }} name="list"></Icon>
                                                    </TouchableOpacity>
                                                </Row>
                                            </Col>
                                        </ListItem>
                                    }>
                                </List>
                            </Content>
                        </Row>
                    </Grid>
                </Content>
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.isPuantajModalVisible}
                    onRequestClose={() => {
                    }}>
                    <Content>
                        <Grid style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 200 }}>
                            <Row size={15} style={styles.detailRows}>
                                <Col size={100}>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                                        placeholder="Plaka"
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        placeholderIconColor="#007aff"
                                        selectedValue={this.state.selectedBolgeAracId}
                                        onValueChange={(val) => {
                                            this.setState({
                                                selectedBolgeAracId: val
                                            });
                                        }}>
                                        <Picker.Item label="Araç Seç" value="-1" />
                                        {this.state.bolgeAracListPickerOptions}
                                    </Picker>
                                </Col>
                            </Row>
                            <Row size={15} style={styles.detailRows}>
                                <Col size={100}>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        selectedValue={this.state.selectedDagitmaToplama}
                                        placeholderIconColor="#007aff" >
                                        <Picker.Item label="Dağıtma" value="1" />
                                        <Picker.Item label="Toplama" value="2" />
                                    </Picker>
                                </Col>
                            </Row>
                            <Row size={15} style={styles.detailRows}>
                                <Col size={100}>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        placeholderIconColor="#007aff"
                                        selectedValue={this.state.selectedGuzergahFiyati}
                                        onValueChange={(val) => {
                                            this.setState({
                                                selectedGuzergahFiyati: val
                                            });
                                        }} >
                                        <Picker.Item label="Müşteri Kapasitesi" value="-11" />
                                        <Picker.Item label="Fiyat Uygulanmasın" value="-1" />
                                        {this.state.guzergahFiyatListPickerOptions}
                                    </Picker>
                                </Col>
                            </Row>
                            <Row size={15} style={styles.detailRows}>
                                <Col size={100}>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="ios-arrow-down-outline" />}
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        placeholderIconColor="#007aff"
                                        selectedValue={this.state.selectedAracFiyati}
                                        onValueChange={(val) => {
                                            this.setState({
                                                selectedAracFiyati: val
                                            });
                                        }}>
                                        <Picker.Item label="Araç Fiyatı" value="-11" />
                                        {this.state.aracFiyatListPickerOptions}
                                    </Picker>
                                </Col>
                            </Row>
                            <Row size={20} style={{ marginBottom: 20, marginTop:10 }}>
                                <Col size={100} style={{ justifyContent: "center" }}>
                                    <Button iconLeft rounded light block onPress={() => this.openTimePicker()}>
                                        <Icon name='clock' />
                                        <Text>{this.state.selectedTime}</Text>
                                    </Button>
                                </Col>
                            </Row>
                            <Row size={20}>
                                <Col size={45}>
                                    <Button block rounded light
                                        onPress={() => {
                                            this.ozelPuantajAta();
                                        }}>
                                        <Text>EKLE</Text>
                                    </Button>
                                </Col>
                                <Col size={5}>
                                </Col>
                                <Col size={45}>
                                    <Button block rounded light
                                        onPress={() => {
                                            this.setModalVisible(false);
                                        }}>
                                        <Text>VAZGEÇ</Text>
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>
                    </Content>
                </Modal>


                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.isPuantajDetailModalVisible}
                    onRequestClose={() => {
                    }}>
                    <Row size={3}></Row>
                    <Row size={5} style={{ paddingLeft: 20, marginTop: 10, justifyContent: "flex-end", alignContent: "flex-end" }}>
                        <Content style={{ justifyContent: "flex-end", alignContent: "flex-end" }}>
                            <Button iconRight transparent danger onPress={() => {
                                this.setState({
                                    isPuantajDetailModalVisible: false
                                });
                            }}>
                                <Icon name='close' />
                            </Button>
                        </Content>
                    </Row>
                    <Row size={10}>
                        <Content>
                            <ListItem style={{ padding: 0 }}>
                                <Left style={{ padding: 0 }}>
                                    <Text>Güzergah</Text>
                                </Left>
                                <Body>
                                    <Text>Plaka</Text>
                                </Body>
                                <Body>
                                    <Text>Sefer Zamanı</Text>
                                </Body>
                                <Right>
                                    <Text></Text>
                                </Right>
                            </ListItem>
                        </Content>
                    </Row>
                    <Row size={85}>
                        <Content>
                            <List dataArray={this.state.guzergahDetailListTable}
                                renderRow={(item) =>
                                    <ListItem style={{ padding: 0 }}>
                                        <Col size={35} style={{ alignContent: "center" }}>
                                            <Row size={100}><Text>{item.GuzergahAdi}</Text></Row>
                                        </Col>
                                        <Col size={30} style={{ alignContent: "flex-end" }}>
                                            <Row size={100}><Text>{item.Plaka}</Text></Row>
                                        </Col>
                                        <Col size={25} style={{ alignContent: "flex-end" }}>
                                            <Row size={100}><Text>{item.SeferZamani}</Text></Row>
                                        </Col>
                                        <Col size={10} style={{ alignContent: "flex-end" }}>
                                            <Row size={100}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        if (this.state.pauntajKisitiVarmi == false) {
                                                            this.deletePuantaj(item.Plaka, item.GuzergahId, item.SeferId);
                                                        }
                                                        else {
                                                            Alert.alert("Seçtiğiniz tarih için puantaj kısıtı mevcuttur.");
                                                        }
                                                    }}>
                                                    <Icon style={{ color: '#dc3545', padding: 0 }} name="remove-circle"></Icon>
                                                </TouchableOpacity>
                                            </Row>
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


const styles = StyleSheet.create({
    detailRows: {
        borderBottomColor: '#d6d7da',
        borderBottomWidth: 1
    }
});