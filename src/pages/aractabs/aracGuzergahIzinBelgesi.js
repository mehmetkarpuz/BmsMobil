import React, { Component } from 'react';
import {
    Container, Content,
    Text, Thumbnail,Button,Icon, DatePicker
} from 'native-base';
import { Image, Dimensions,ScrollView,Alert,Modal } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import AracServices from '../../services/aracServices';
import AddWehicleImageRequestModel from '../../models/addWehicleImageRequestModel';
import Utils from '../../common/utils';
import ImageBrowser from 'react-native-interactive-image-gallery'
import moment from 'moment';


export default class AracGuzergahIzinTab extends Component {

    apiServices = new AracServices();
    utils = new Utils();
    constructor(props) {
        super(props);
        this.state = {
            guzergahIzinAddModalVisible: false,
            datePickerDefaultDate: new Date(),
            chosenStartDate: new Date(),
            chosenEndDate: new Date(),
            selectedImageUri: ""
        }
    }

    setSelectedImage(image) {
        this.setState({ selectedImageUri: image.uri })
    }

    addGuzergahImage() {
        var request = new AddWehicleImageRequestModel();
        var start = moment(this.state.chosenStartDate).format("DD-MM-YYYY");
        var end = moment(this.state.chosenEndDate).format("DD-MM-YYYY");
        request.Token = this.props.token;
        request.ID = this.props.aracGuzergahResponse.ID;
        request.startDate = start.toString();
        request.endDate = end.toString();
        request.entryID = this.props.selectedAracId;
        request.startEndDocumentType = "5"; //Guzergah
        request.fileLocationType = "5"; //Guzergah
        request.force = "false";
        request.image = this.state.selectedImageUri;
        request.sigortaID = this.props.aracGuzergahResponse.guzargahIzinID;
        request.plaka = this.props.aracGuzergahResponse.plaka;
        request.isDateRequired = "false";
        this.apiServices.addImage(request).then(responseJson => {
            this.props.reloadAracGuzergahResimler(this.props.selectedAracId);
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
        const imageURLs = this.props.aracGuzergahResimlerResponse.map(
            (img, index) => ({
                URI: img.fullPath,
                thumbnail: img.fullPath,
                id: String(index),
                title: "",
                description: ""
            })
        )

        return (
            <ScrollView vertical={true}>
                <Content>
                    <Grid style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 2 }}>
                        <Row size={10} style={{ marginBottom: 5 }}>
                        <Button full light onPress={() => this.setState({ guzergahAddModalVisible: true })}>
                                <Text>Yeni Guzergah Ekle</Text>
                            </Button>
                        </Row>
                        <Row size={80}>
                            <ImageBrowser images={imageURLs} />
                        </Row>
                    </Grid>
                </Content>
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.guzergahAddModalVisible}
                    onRequestClose={() => {
                    }}>
                    <Content>
                        <Grid style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 50 }}>
                            <Row size={5} style={{ paddingLeft: 20,marginBottom: 10, marginTop: 10, justifyContent: "flex-end", alignContent: "flex-end" }}>
                                <Content style={{ justifyContent: "flex-end", alignContent: "flex-end" }}>
                                    <Button danger onPress={() => {
                                        this.setState({
                                            guzergahAddModalVisible: false
                                        });
                                    }}>
                                        <Icon name='close' />
                                    </Button>
                                </Content>
                            </Row>
                            <Row size={10}>
                                <Col size={40} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                    <DatePicker
                                        defaultDate={this.state.datePickerDefaultDate}
                                        minimumDate={this.state.datePickerDefaultDate}
                                        maximumDate={new Date(2100, 12, 31)}
                                        locale={"tr"}
                                        timeZoneOffsetInMinutes={undefined}
                                        modalTransparent={false}
                                        animationType={"fade"}
                                        androidMode={"default"}
                                        placeHolderText="Başlangıç Tarihi Seçiniz"
                                        textStyle={{ color: "green" }}
                                        placeHolderTextStyle={{ color: "#d3d3d3" }}
                                        onDateChange={(dt) => {
                                            var d = new Date(dt);
                                            d.setMinutes(d.getMinutes() + d.getTimezoneOffset() * -1);
                                            this.setState({ chosenStartDate: d });
                                        }} />
                                </Col>
                                <Col size={40} style={{ borderWidth: 1, borderColor: '#d6d7da', marginBottom: 5 }}>
                                    <DatePicker
                                        defaultDate={this.state.datePickerDefaultDate}
                                        minimumDate={this.state.datePickerDefaultDate}
                                        maximumDate={new Date(2100, 12, 31)}
                                        locale={"tr"}
                                        timeZoneOffsetInMinutes={undefined}
                                        modalTransparent={false}
                                        animationType={"fade"}
                                        androidMode={"default"}
                                        placeHolderText="Bitiş Tarih Seçiniz"
                                        textStyle={{ color: "green" }}
                                        placeHolderTextStyle={{ color: "#d3d3d3" }}
                                        onDateChange={(dt) => {
                                            var d = new Date(dt);
                                            d.setMinutes(d.getMinutes() + d.getTimezoneOffset() * -1);
                                            this.setState({ chosenEndDate: d });
                                        }} />
                                </Col>
                            </Row>
                            <Row size={20} style={{ marginBottom: 10 }}>
                                <Col size={100}>
                                    <Button full light onPress={() => this.utils.pickImage().then(t => this.setSelectedImage(t))}>
                                        <Text>Resim Seç</Text>
                                    </Button>
                                </Col>
                            </Row>
                            <Row size={20}>
                                <Col size={50}>
                                    <Button full light onPress={() => this.addGuzergahImage()}>
                                        <Text>Kaydet</Text>
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>
                    </Content>
                </Modal>
            </ScrollView>
        );
    }
}