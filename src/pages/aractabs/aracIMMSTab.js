import React, { Component } from 'react';
import {
    Container, Content,
    Text, Thumbnail
} from 'native-base';
import { Image, Dimensions } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

export default class AracIMMSTab extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var images = [];

        for (let i = 0; i < this.props.aracImmsResimlerResponse.length; i++) {
            images.push(
                <ImageZoom cropWidth={Dimensions.get('window').width}
                    cropHeight={Dimensions.get('window').width}
                    imageWidth={300}
                    imageHeight={300}>
                    <Image style={{ width: 300, height: 300 }}
                        source={{ uri: this.props.aracImmsResimlerResponse[i].fullPath }} />
                </ImageZoom>
            )
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