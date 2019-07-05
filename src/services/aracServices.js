import Environment from '../services/enviroenmet';

export default class AracServices {

    env = new Environment();

    getAracListBySearchTerm(request) {
        return fetch(this.env.ServiceUrl + 'Puntaj/GetAracListBySearchTerm', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        }).then(function (res) {
            return res.json();
        });
    }

    getAracDetailsByAracId(request) {
        return fetch(this.env.ServiceUrl + 'Puntaj/GetAracDetailsByAracId', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        }).then(function (res) {
            ;
            return res.json();
        }).catch(function (ex) {
            console.log("err", ex);
        });
    }

    getAracResimlerByAracId(request) {
        return fetch(this.env.ServiceUrl + 'Puntaj/GetAracResimlerByAracId', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        }).then(function (res) {
            return res.json();
        });
    }

    getAracRuhsatByAracId(request) {
        return fetch(this.env.ServiceUrl + 'Puntaj/GetRuhsatByAracId', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        }).then(function (res) {
            return res.json();
        });
    }

    getAracSigortaByAracId(request) {
        return fetch(this.env.ServiceUrl + 'Puntaj/GetSigortaByAracId', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        }).then(function (res) {
            return res.json();
        });
    }

    addImage(request) {
        var formData = new FormData();

        // formData.append('token', request.Token);        
        formData.append('file', {
            uri: request.image 
        });
        // formData.append('startDate', request.startDate);
        // formData.append('endDate', request.endDate);
        // formData.append('entryID', request.entryID);
        // formData.append('startEndDocumentType', request.startEndDocumentType);
        // formData.append('fileLocationType', request.fileLocationType);
        // formData.append('force', request.force);
        // formData.append('sigortaID', request.sigortaID);
        // formData.append('plaka', request.plaka);
        // formData.append('isDateRequired', request.isDateRequired);

        return fetch(this.env.ServiceUrl + 'Puntaj/AddWehicleImage', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        }).then(function (res) {
            console.log("res",res);
            return res.json();
        }).catch(function(err){
            console.log("err",err);
        });
    }
}


