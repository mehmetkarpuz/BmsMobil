import React from 'react';
import { ImagePicker, Permissions } from 'expo';

export default class Utils {
    pickImage = async () => {
        return await this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Uygulama kamera erişimi verilmelidir!');
        }
        else {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
            });

            if (!result.cancelled) {
                return result;
            }
        }
    }
}