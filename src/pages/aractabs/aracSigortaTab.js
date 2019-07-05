import React, { Component } from 'react';
import {
    Container, Content,
    Text, Thumbnail
} from 'native-base';
import { Image, Dimensions } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { Row } from 'react-native-easy-grid';

export default class AracSigortaTab extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var images = [];

        if (this.props.aracSigortaResimlerResponse != null) {
            for (let i = 0; i < this.props.aracSigortaResimlerResponse.length; i++) {
                images.push(
                    <ImageZoom cropWidth={Dimensions.get('window').width}
                        cropHeight={Dimensions.get('window').width}
                        imageWidth={300}
                        imageHeight={300}>
                        <Image style={{ width: 300, height: 300 }}
                            source={{ uri: this.props.aracSigortaResimlerResponse[i].fullPath }} />
                    </ImageZoom>
                )
            }
        }        

        return (
            <Container>
                <Content>
                    <Row size={10}>
                                    
                    </Row>
                    <Row size={90}>
                        {images}
                    </Row>
                </Content>
            </Container>
        );
    }
}