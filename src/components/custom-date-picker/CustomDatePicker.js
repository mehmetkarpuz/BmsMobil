import React, {Component} from 'react';
import {CheckBox, Item, Label, Text} from 'native-base';
import styles from "./style";
import CustomNativeDatePicker from '../custom-native-datepicker/CustomNativeDatePicker'


class CustomDatePicker extends Component {

    constructor(props) {
        super(props);
        this.state = {date: null}
    }

    render() {
        let {date, frontValue, label, type} = this.props;

        return (
            <Item style={styles.formItem}>
                <CustomNativeDatePicker
                    style={{width: "100%", height: 36}}
                    mode="date"
                    showIcon={true}
                    hideText={false}
                    format="YYYY.MM.DD"
                    minDate="2018-01-01"
                    maxDate="2100-01-01"
                    confirmBtnText="Seçim"
                    cancelBtnText="İptal"
                    date={this.state.date}
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 4,
                            top: 4,
                            marginLeft: 0
                        }
                    }}
                    onDateChange={(date) => {
                        this.setState({date: date});
                        //value = onChange(date);
                        frontValue(date);
                    }}
                />
                {/*{hasError ? <Text>{error}</Text> : <Text/>}*/}
            </Item>
        );
    }
}

export default CustomDatePicker;