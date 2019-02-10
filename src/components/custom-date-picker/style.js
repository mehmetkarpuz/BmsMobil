import {Dimensions} from "react-native";
import Colors from "../../assets/color";

let {width, height} = Dimensions.get('window');
export default styles = {

    formItem: {
        paddingTop:5,
        paddingBottom:5,
        backgroundColor: Colors.white
        // marginBottom: 15,
        // marginTop: 10
    },
    label: {
        paddingTop:5,
        paddingBottom:5,
        fontSize: 15,
        width:200
    },

}