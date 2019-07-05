import React, { Component } from 'react';
import {
    Container, Content,
    Text, Thumbnail
} from 'native-base';
import { Image, Dimensions } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import AracServices from '../../services/aracServices';
import ImageZoom from 'react-native-image-pan-zoom';

export default class AracRuhsatTab extends Component {

    apiServices = new AracServices();

    constructor(props) {
        super(props);
    }

    render() {
        var images = [];

        if (this.props.aracRuhsatResimlerResponse != null) {
            for (let i = 0; i < this.props.aracRuhsatResimlerResponse.length; i++) {
                images.push(
                    <ImageZoom cropWidth={Dimensions.get('window').width}
                        cropHeight={Dimensions.get('window').width}
                        imageWidth={300}
                        imageHeight={300}>
                        <Image style={{ width: 300, height: 300 }}
                            source={{ uri: this.props.aracRuhsatResimlerResponse[i].fullPath }} />
                    </ImageZoom>
                )
            }
        }
        

        return (
            <Container>
                <Content>
                {images}
                </Content>
            </Container>
        );
    }
}