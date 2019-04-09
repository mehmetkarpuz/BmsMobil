import React, { Component } from 'react';
import {
    Text
} from 'react-native';
import AracServices from '../../services/aracServices';
export default class AracInfoTab extends Component {

    apiServices = new AracServices();

    constructor(props) {
        super(props);
        this.state = {
            aracDetailResponse: {}
        };
    }

    componentDidMount() {
        this.getAracDetails(this.props.selectedAracId);
    }

    getAracDetails(aracId) {
        var request = new GetAracListBySearchTermRequestModel();
        request.SearchTerm = this.state.searchTerm;
        request.Token = this.state.tokenRequestModel.Token;
        this.apiServices.getAracListBySearchTerm(request).then(responseJson => {
            if (responseJson.Data.length > 0) {
                this.setState({
                    aracDetailResponse: responseJson.Data
                });
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        return (
            <Container>
                <Content>
                    <Grid style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 2 }}>
                        <Row size={10} style={{ marginBottom: 10 }}>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>Sahibi</Text>
                            </Col>
                            <Col size={40} style={{
                                backgroundColor: '#ffffff', height: 50,
                                alignItems: 'flex-start', justifyContent: 'center'
                            }}>
                                <Text>{this.state.aracDetailResponse.Owner}</Text>
                            </Col>
                        </Row>
                    </Grid>
                </Content>
            </Container>
        );
    }
}