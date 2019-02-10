import Environment from '../services/enviroenmet';

export default class PuantajServices {
    
    env = new Environment();

    getGarageList(request) {                     
        return fetch(this.env.ServiceUrl + 'Puntaj/SelectGarageByShiftResponsible', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        }).then(function (res) {
            return res.json();
        });
    }

    getProjectList(request) {   
           
        return fetch(this.env.ServiceUrl + 'Puntaj/Projeler', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
    }

    getPuantajListByDate(request) {
        return fetch(this.env.ServiceUrl + 'Puntaj/GetPuantajListByDate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        }).then(function (res) {
            return res.json();
        });
    }

    getBolgeAracListesi(request) {
        return fetch(this.env.ServiceUrl + 'Puntaj/GetBolgeAraclar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        }).then(function (res) {
            return res.json();
        });
    }

    getGuzergahFiyatListByGuzergahId(request) {
        return fetch(this.env.ServiceUrl + 'Puntaj/GetGuzergahFiyatlariList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        }).then(function (res) {
            return res.json();
        });
    }

    ozelPuantajAta(request) {
        return fetch(this.env.ServiceUrl + 'Puntaj/OzelPuantajAta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        }).then(function (res) {
            return res.json();
        });
    }

    deletePuantaj(request) {
        return fetch(this.env.ServiceUrl + 'Puntaj/PuantajSil', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        }).then(function (res) {
            return res.json();
        });
    }


    getPuantajDetailsByGuzergahId(request) {
        return fetch(this.env.ServiceUrl + 'Puntaj/GetPuantajDetailsByGuzergahId', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        }).then(function (res) {
            return res.json();
        });
    }
}


