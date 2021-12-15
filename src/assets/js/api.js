export class ApiCore {
    static headers = {
        json: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    static json(url, data) {
        return fetch(url, {
            method: 'POST',
            headers: this.headers.json,
            body: JSON.stringify(data)
        }).then(res => res.json());
    }
}

export default class Api {
    static generateLink(url, inputsData) {
        return ApiCore.json(url, {
            inputs: inputsData
        })
            .then(res => {
                if (!res.hasOwnProperty('uid') || !res.uid) {
                    throw new Error("Invalid response data, please try again later.")
                }

                return res.uid;
            });
    }
}