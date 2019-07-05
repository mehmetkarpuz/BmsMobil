import React, { Component } from 'react';
import {
    Container, Content,
    Text, Thumbnail,Button
} from 'native-base';
import { Image, Dimensions, ScrollView,Alert } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { ImagePicker, Permissions } from 'expo';
import AracServices from '../../services/aracServices';
import AddWehicleImageRequestModel from '../../models/addWehicleImageRequestModel';


export default class AracResimInfoTab extends Component {
    
    apiServices = new AracServices();

    state = {
        image: null,
    };

    constructor(props) {
        super(props);
    }
    
    pickImage = async () => {
        await this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Uygulama kamera erişimi verilmelidir!');
        }
        else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
            });

            console.log(result);
            this.addImage(result);


            if (!result.cancelled) {
                this.setState({ image: result.uri });
            }
        }
    }

    addImage(image){
        var request = new AddWehicleImageRequestModel();
        request.Token = this.props.token;
        request.ID = this.props.aracSigortaInfo.ID;
        request.startDate = "";
        request.endDate = "";
        request.entryID = this.props.selectedAracId;
        request.startEndDocumentType = "9"; //Image
        request.fileLocationType = "9"; //Image
        request.force = "false";
        request.image = image;
        request.sigortaID = this.props.aracSigortaInfo.sigortaID;
        request.plaka = this.props.aracSigortaInfo.plaka;
        request.isDateRequired = "false";
        this.apiServices.addImage(request).then(responseJson => {
            console.log(responseJson);
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
        var images = [];

        if (this.props.aracResimlerResponse != null) {
            for (let i = 0; i < this.props.aracResimlerResponse.length; i++) {
                images.push(
                    <Col size={30} style={{ marginTop: 10, marginLeft: 1, marginRight: 1 }}>
                        <Image
                            style={{ width: 150, height: 150 }}
                            source={{ uri: this.props.aracResimlerResponse[i].fullPath }}>
                        </Image>
                        {/* <ImageZoom cropWidth={Dimensions.get('window').width}
                                    cropHeight={Dimensions.get('window').width}
                                    imageWidth={150}
                                    imageHeight={150}>
                                    <Image style={{ width: 150, height: 150 }}
                                        source={{ uri: this.props.aracResimlerResponse[i].fullPath }} />
                                </ImageZoom> */}
                    </Col>
                )
            }
        }

        return (
            <ScrollView vertical={true}>
                <Content>
                    <Grid style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 2 }}>
                    <Row size={10} style={{ marginBottom: 5 }}>
                            <Button full light onPress={() => this.pickImage()}>
                                <Text>Resim Ekle</Text>
                            </Button>                               
                        </Row>
                        <Row size={90}>
                            {images}
                        </Row>
                    </Grid>
                </Content>
            </ScrollView>
        );
    }
}