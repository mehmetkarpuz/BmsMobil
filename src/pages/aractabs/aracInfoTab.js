import React, { Component } from 'react';
import {
    Container, Content,
    Text, Button, Image
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import AracServices from '../../services/aracServices';


export default class AracInfoTab extends Component {
   
    apiServices = new AracServices();

    constructor(props) {
        super(props);
    }

    render() {       

        return (
            <Container>
                <Content>
                    <Grid style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 2 }}>                       
                        <Row size={10} style={{ marginBottom: 5 }}>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>Sahibi : </Text>
                            </Col>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>{this.props.aracDetailResponse.owner.name + " " + this.props.aracDetailResponse.owner.surname}</Text>
                            </Col>
                        </Row>
                        <Row size={10} style={{ marginBottom: 5 }}>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>Plaka : </Text>
                            </Col>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>{this.props.aracDetailResponse.plaka}</Text>
                            </Col>
                        </Row>
                        <Row size={10} style={{ marginBottom: 5 }}>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>Takip Cihaz NO : </Text>
                            </Col>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>{this.props.aracDetailResponse.plaka}</Text>
                            </Col>
                        </Row>
                        <Row size={10} style={{ marginBottom: 5 }}>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>Marka : </Text>
                            </Col>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>{this.props.aracDetailResponse.wehicleBrand.brand}</Text>
                            </Col>
                        </Row>
                        <Row size={10} style={{ marginBottom: 5 }}>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>Model : </Text>
                            </Col>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>{this.props.aracDetailResponse.wehicleModel.model}</Text>
                            </Col>
                        </Row>
                        <Row size={10} style={{ marginBottom: 5 }}>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>Araç Kirası : </Text>
                            </Col>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>{this.props.aracDetailResponse.wehicleRentAmount}</Text>
                            </Col>
                        </Row>
                        <Row size={10} style={{ marginBottom: 5 }}>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>Kapasite : </Text>
                            </Col>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>{this.props.aracDetailResponse.wehicleModel.wehicleCapacity.capacityName}</Text>
                            </Col>
                        </Row>
                        <Row size={10} style={{ marginBottom: 5 }}>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>Model Yılı : </Text>
                            </Col>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>{this.props.aracDetailResponse.modelYear}</Text>
                            </Col>
                        </Row>
                        <Row size={10} style={{ marginBottom: 5 }}>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>GPS Bedeli : </Text>
                            </Col>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>{this.props.aracDetailResponse.gpsBedeli}</Text>
                            </Col>
                        </Row>
                        <Row size={10} style={{ marginBottom: 5 }}>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>Açıklama : </Text>
                            </Col>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>{this.props.aracDetailResponse.description}</Text>
                            </Col>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        );
    }
}