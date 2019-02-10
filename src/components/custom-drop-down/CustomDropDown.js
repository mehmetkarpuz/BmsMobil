import React, {Component} from 'react';
import CustomModalDropdown from "../custom-modal-dropdown";
import {Text, TouchableHighlight, View} from "react-native";
import {Item, Label, Right, Icon} from "native-base";
import globalStyle from "../../assets/globalStyle";
import styles from "./style";
import renderIf from "../../utility/renderIf";
import Colors from '../../assets/color';


class CustomDropDown extends Component {

   
    constructor(props) {
        super(props);
        this.state = {
            selectedText: "Seçiniz",
            lastDataOptions: null,
            isOpen: false
        }
        this.modalOpening = this.modalOpening.bind(this);
        this.modalClosing = this.modalClosing.bind(this);
    }
    modalOpening(e) {
        this.setState({
          isOpen: true
        })
      }
    modalClosing(){
        this.setState({
            isOpen:false
        })
    }
    componentDidMount() {
        const { defaultIndex, dataOptions} = this.props
        if(defaultIndex > -1) {
            this.setState({
                selectedText: dataOptions[defaultIndex].Value
            })
        }
    }

    _renderButtonText(rowData, onChange) {
        const {value, key} = rowData;
        this.setState(
            {selectedText: `${value}`}
        );
        if (onChange) {
            onChange(key);
        }
        return;
    }

    _renderRow = (rowData, rowID, highlighted) => {
        let evenRow = rowID % 2;
        return (
            <TouchableHighlight>
                <View style={highlighted ? styles.dropdown_2_rowHighlight :styles.dropdown_2_row}>
                    <Text style={highlighted ? styles.dropdown_2_row_textHighlight : styles.dropdown_2_row_text}>
                        {`${rowData.value}`}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    _renderSeparator(sectionID, rowID, adjacentRowHighlighted, dataOptions) {
        if (rowID == dataOptions.length - 1) return;
        let key = `spr_${rowID}`;
        return (<View style={styles.dropdown_2_separator} key={key}/>);
    }

    _customizeStyle(style, dataOptions) {
        if (dataOptions.length > 3) {
            style.height += 70;
        }
        return style;
    }

    _convertOptionsData(dataOptions, keyName, valueName, showInDropDown) {
        let array = [];
        dataOptions.map((item) => {
            array.push({
                "key": item[keyName],
                "value": item[valueName],
                "showInDropDown": showInDropDown ? item[showInDropDown] : true
            });
        });
        array = array.filter(item => item.showInDropDown == true);
        return array;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.dataOptions !== null && nextProps.dataOptions !== null) {

            if (this.props.dataOptions !== nextProps.dataOptions && this.state.selectedText !== "Seçiniz") {
                this.setState(
                    {selectedText: "Seçiniz", isOpen:false,lastDataOptions:null}
                );
            }

        }
    }

    render() {
        let {input, label, dataOptions, meta, disabled, onSelect, dropdownStyle, defaultIndex,flexWidth, flexHeight} = this.props;
        if (dataOptions) {
            let {keyName, valueName, showInDropDown} = this.props;
            dataOptions = this._convertOptionsData(dataOptions, keyName, valueName, showInDropDown);
        }

        if (input) {
            var {value, onChange} = input;
        }

        if (meta) {
            var {error, touched, pristine} = meta;
        }

        var hasError = false;
        if (error !== undefined && touched) {
            hasError = true;
        }
        return (
            <Item error={hasError} style={styles.item}>

                {renderIf(label !== undefined, <Label style={globalStyle.inputLabel}>{label}</Label>)}

                <CustomModalDropdown
                    flexWidth={flexWidth}
                    flexHeight={flexHeight}
                    options={dataOptions}
                    disabled={disabled}
                    defaultIndex={defaultIndex}
                    adjustFrame={style => this._customizeStyle(style, dataOptions)}
                    style={styles.dropdown_2}
                    IsModalOpen={this.modalOpening}
                    IsModalClose={this.modalClosing}
                    textStyle={styles.dropdown_2_text}
                    dropdownStyle={[styles.dropdown_2_dropdown, dropdownStyle]}
                    renderButtonText={(rowData) => this._renderButtonText(rowData, onChange)}
                    renderRow={this._renderRow}
                    onSelect={onSelect}
                    
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._renderSeparator(sectionID, rowID, adjacentRowHighlighted, dataOptions)}
                >
                    <View style={[styles.selectButton, this.state.isOpen && this.state.selectedText =="Seçiniz" ? {backgroundColor:Colors.SeaBlue}:null, this.props.borderStyle?this.props.borderStyle:null] } >
                        <Text style={[this.state.isOpen && this.state.selectedText =="Seçiniz" ?styles.selectButtonTextHighlight:styles.selectButtonText, {flex: 1}]} numberOfLines={1}>
                            {this.state.selectedText ? this.state.selectedText : "Seçiniz"}
                        </Text>
                        {this.state.isOpen && this.state.selectedText =="Seçiniz" ? <Icon name="" style={{height:25}}/>:  <Icon name="arrow-down"/>}
                    </View>

                    {hasError ? <Text style={styles.formErrorText}>{error}</Text> : null}

                </CustomModalDropdown>

            </Item>
        )

    }
}

export default CustomDropDown;