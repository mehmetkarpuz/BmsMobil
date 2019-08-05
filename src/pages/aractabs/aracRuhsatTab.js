import React, { Component } from 'react';
import {
    Container, Content,
    Text, Thumbnail,Button
} from 'native-base';
import { Image, Dimensions,ScrollView,Alert } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import AracServices from '../../services/aracServices';
import AddWehicleImageRequestModel from '../../models/addWehicleImageRequestModel';
import Utils from '../../common/utils';
import ImageBrowser from 'react-native-interactive-image-gallery'

export default class AracRuhsatTab extends Component {

    apiServices = new AracServices();
    utils = new Utils();
    constructor(props) {
        super(props);
    }

    addRuhsatImage(image) {
        var request = new AddWehicleImageRequestModel();
        request.Token = this.props.token;
        request.ID = this.props.aracRuhsatResponse.ID;
        request.startDate = "";
        request.endDate = "";
        request.entryID = this.props.selectedAracId;
        request.startEndDocumentType = "1"; //Ruhsat
        request.fileLocationType = "1"; //Ruhsat
        request.force = "false";
        request.image = image.uri;
        request.sigortaID = this.props.aracRuhsatResponse.ruhsatID;
        request.plaka = this.props.aracRuhsatResponse.plaka;
        request.isDateRequired = "false";
        this.apiServices.addImage(request).then(responseJson => {
            this.props.reloadAracRuhsatResimler(this.props.selectedAracId);
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
        const imageURLs = this.props.aracRuhsatResimlerResponse.map(
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
                            <Button full light onPress={() => this.utils.pickImage().then(t=> this.addRuhsatImage(t))}>
                                <Text>Yeni Ruhsat Ekle</Text>
                            </Button>
                        </Row>
                        <Row size={80}>
                            <ImageBrowser images={imageURLs} />
                        </Row>
                    </Grid>
                </Content>
            </ScrollView>
        );
    }
}