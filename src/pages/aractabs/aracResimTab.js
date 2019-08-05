import React, { Component } from 'react';
import {
    Container, Content,
    Text, Thumbnail, Button
} from 'native-base';
import { Image, Dimensions, ScrollView, Alert } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { ImagePicker, Permissions } from 'expo';
import AracServices from '../../services/aracServices';
import AddWehicleImageRequestModel from '../../models/addWehicleImageRequestModel';
import ImageBrowser from 'react-native-interactive-image-gallery'
import Utils from '../../common/utils';

export default class AracResimInfoTab extends Component {

    apiServices = new AracServices();
    utils = new Utils();
    state = {
        image: null,
    };

    constructor(props) {
        super(props);
    }

    addImage(image) {
        var request = new AddWehicleImageRequestModel();
        request.Token = this.props.token;
        request.ID = this.props.aracSigortaInfo.ID;
        request.startDate = "";
        request.endDate = "";
        request.entryID = this.props.selectedAracId;
        request.startEndDocumentType = "9"; //Image
        request.fileLocationType = "9"; //Image
        request.force = "false";
        request.image = image.uri;
        request.sigortaID = this.props.aracSigortaInfo.sigortaID;
        request.plaka = this.props.aracSigortaInfo.plaka;
        request.isDateRequired = "false";
        this.apiServices.addImage(request).then(responseJson => {           
            if (responseJson.IsSuccess) {
                Alert.alert("İşlem başarılı");
                this.props.reloadAracResimler(request.entryID);
            }
            else {
                Alert.alert(responseJson.ExceptionMsg);
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        var images = [];

        const imageURLs = this.props.aracResimlerResponse.map(
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
                            <Button full light onPress={() => this.utils.pickImage().then(t=> this.addImage(t))}>
                                <Text>Yeni Resim Ekle</Text>
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