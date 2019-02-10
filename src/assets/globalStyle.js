import {StyleSheet} from "react-native";
import Color from "./color";
import Fonts from "./fonts";

export default StyleSheet.create({

    inputLabel: {
        fontSize: 14,
        width: 150
    },

    content: {
        //paddingLeft: 16,
        //paddingRight: 16,
        // paddingTop: 30,
      
        backgroundColor: Color.globalBackground
    },

    globalButton : {
        width: "100%",
        height:50,
        alignItems: 'center',
        justifyContent:'center',
        padding: 15,
        backgroundColor: Color.black
    },

    globalButtonText : {
        color:'#fff',
        fontSize:17,
        alignSelf: 'center'
    },
    globalDisabledTabButton:{
        backgroundColor: Color.grey,
        height:40,
    },
    globalTabButton:{
        backgroundColor: Color.Gold,
        height:40,
    },
    globalTabButtonText:{
        height: 20,
        color: Color.globalBackground,
        //fontFamily: "Lato",
        fontSize: 14,
        fontWeight:"700",
        lineHeight:18,
        textAlign:"center",
        letterSpacing: 0.46
    },
    globalMatteGoldButton:{
        height:38,
        borderRadius: 3,
        backgroundColor: Color.Gold, 
    },

    globalDisabledMatteGoldButton:{
        height:38,
        borderRadius: 3,
        backgroundColor: Color.matteGold,
    },
    globalDisabledRedButton:{
        height:38,
        borderRadius: 3,
        backgroundColor: Color.red, 
    },
    globalRedButton:{
        height:38,
        borderRadius: 3,
        backgroundColor: Color.red,
    },
    globalRedButtonText:{
        height: 20,
        color: Color.white,
        //fontFamily: "Lato",
        fontSize: 13,
        fontWeight:"700",
        lineHeight:18,
        textAlign:"center",
        letterSpacing: 0.46

    },
    globalMatteGoldButtonText:{
        height: 20,
        color: Color.globalBackground,
        //fontFamily: "Lato",
        fontSize: 13,
        fontWeight:"700",
        lineHeight:18,
        textAlign:"center",
        letterSpacing: 0.46

    },
    globalHeaderDescriptionText : {
        color: Color.white,
        fontSize: 16,
        width: 335,
        height: 58,
        paddingLeft: 10,
        paddingRight: 10,
     //   fontFamily: Fonts.GreyliffBold,
        fontWeight: "700",
        textAlign: "center",
        /* Text style for "Turkcell i" */
        letterSpacing: 0.43,
    },

    globalInputTitle : {
        height: 15,
        color: Color.white,
       // fontFamily: Fonts.GreyliffBold,
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.43,
        marginBottom: 10
    },
    globalTextArea: {
        backgroundColor: Color.white,
        paddingLeft:15,
        width: "100%",
        height: 80,
    //    fontFamily: Fonts.GreyliffMedium,
        fontSize: 16,
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0.43,
        textAlign: "left",
        color: "#293064",
        borderWidth : 0,
        borderRadius: 3,
        marginBottom:1,
    }
});