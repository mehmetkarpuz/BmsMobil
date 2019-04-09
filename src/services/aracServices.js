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
}


