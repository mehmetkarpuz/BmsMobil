import {StyleSheet} from "react-native";
import Fonts from "../../assets/fonts";
import Colors from "../../assets/color";
export default StyleSheet.create({

    item: {
        // paddingTop: 8,
        // paddingBottom: 8,
        marginLeft:0,
        backgroundColor: Colors.Transparent,
        borderRadius:3,
        borderBottomWidth:0
    },
    dropdownLabel: {
        fontSize: 14,
        width: 165
    },
    selectedText: {},
    dropdown_2: {

        flex:1,
        alignSelf: 'flex-end',
        // width: 150,
        // top: -6,
        // right: 8,
        borderWidth: 0,
        borderRadius: 3,
        // backgroundColor: '#ccc',
        // color:"#ccc"
    },
    dropdown_2_text: {
       
    },
    dropdown_2_dropdown: {
        /*
        width: 220,
        height: 90,
        borderColor: 'cornflowerblue',
        borderWidth: 2,
        borderRadius: 3,
        */
    },
    dropdown_2_row: {
        padding: 15
    },
    dropdown_2_rowHighlight:{
        padding: 15,
        backgroundColor: Colors.SeaBlue,
    },
    dropdown_2_row_text: {
      
      //  fontFamily: Fonts.GreyliffMedium,
        fontSize: 16,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: -0.26,
        textAlign: "left",
        color: "#12203e"
    },
    dropdown_2_row_textHighlight: {
        
     //   fontFamily: Fonts.GreyliffMedium,
        fontSize: 16,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: -0.26,
        textAlign: "left",
        color: Colors.white
    },
    dropdown_2_separator: {
        height: 1,
        backgroundColor: Colors.globalBackground,
    },

    selectButton : {
        flexDirection : "row",
        paddingTop : 10,
        paddingBottom : 5,
        backgroundColor: Colors.white
    },

    selectButtonTextHighlight : {
        paddingLeft:20,
     //   fontFamily: Fonts.GreyliffMedium,
        fontSize: 16,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: -0.26,
        textAlign: "left",
        color: Colors.white
    },

    selectButtonText : {
        paddingLeft:20,
     //   fontFamily: Fonts.GreyliffMedium,
        fontSize: 16,
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: -0.26,
        textAlign: "left",
        color: "#12203e"
    },

    formErrorText : {
        width: "100%",
     //   fontFamily: Fonts.GreyliffMedium,
        fontSize: 13,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: -0.26,
        textAlign: "left",
        color: "red",
    }


});