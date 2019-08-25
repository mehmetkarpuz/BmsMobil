import React, { Component } from 'react';
import {
    Container, Content,
    Text, Thumbnail, Button, Icon, DatePicker
} from 'native-base';
import { Image, Dimensions, ScrollView, Alert, Modal } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import AracServices from '../../services/aracServices';
import AddWehicleImageRequestModel from '../../models/addWehicleImageRequestModel';
import Utils from '../../common/utils';
import ImageBrowser from 'react-native-interactive-image-gallery'

export default class AracIMMSTab extends Component {

    apiServices = new AracServices();
    utils = new Utils();
    constructor(props) {
        super(props);
        this.state = {
            immsAddModalVisible: false,
            datePickerDefaultDate: new Date(),
            chosenStartDate: new Date(),
            chosenEndDate: new Date(),
            selectedImageUri: ""
        }
    }

    setSelectedImage(image) {
        this.setState({ selectedImageUri: image.uri })
    }

    addImmsImage(image) {
        var request = new AddWehicleImageRequestModel();
        request.Token = this.props.token;
        request.ID = this.props.aracImmsResponse.ID;
        request.startDate = this.state.chosenStartDate.toString();
        request.endDate = this.state.chosenEndDate.toString();
        request.entryID = this.props.selectedAracId;
        request.startEndDocumentType = "3"; //IMMS
        request.fileLocationType = "3"; //IMMS
        request.force = "false";
        request.image = this.state.selectedImageUri;
        request.sigortaID = this.props.aracImmsResponse.sigortaID;
        request.plaka = this.props.aracImmsResponse.plaka;
        request.isDateRequired = "false";
        this.apiServices.addImage(request).then(responseJson => {
            this.props.reloadAracImmsResimler(this.props.selectedAracId);
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
        const imageURLs = this.props.aracImmsResimlerResponse.map(
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
                        <Row size={5} style={{ marginBottom: 5, alignContent: "center", alignItems: "center" }}>
                            <Text> <Text style={{ fontWeight: "bold" }}>Plaka : </Text>{this.props.aracImmsResponse.plaka}</Text>
                        </Row>
                        <Row size={5} style={{ marginBottom: 5, alignContent: "center", alignItems: "center" }}>
                            <Text> <Text style={{ fontWeight: "bold" }}>Baş. Tarihi : </Text>{this.props.aracImmsResponse.sigorta_baslangic}</Text>
                        </Row>
                        <Row size={5} style={{ marginBottom: 5, alignContent: "center", alignItems: "center" }}>
                            <Text> <Text style={{ fontWeight: "bold" }}>Bit. Tarihi : </Text>{this.props.aracImmsResponse.sigorta_bitis}</Text>
                        </Row>
                        <Row size={10} style={{ marginBottom: 5 }}>
                        <Button full light onPress={() => this.setState({ immsAddModalVisible: true })}>
                                <Text>Yeni IMMS Ekle</Text>
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
                    visible={this.state.immsAddModalVisible}
                    onRequestClose={() => {
                    }}>
                    <Content>
                        <Grid style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 50 }}>
                            <Row size={5} style={{ paddingLeft: 20, marginBottom: 10, marginTop: 10, justifyContent: "flex-end", alignContent: "flex-end" }}>
                                <Content style={{ justifyContent: "flex-end", alignContent: "flex-end" }}>
                                    <Button danger onPress={() => {
                                        this.setState({
                                            immsAddModalVisible: false
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
                                    <Button full light onPress={() => this.addImmsImage()}>
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