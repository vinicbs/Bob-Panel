import axios from 'axios'
import { API_ROOT } from './config'

class Api {
    constructor() {
        let baseURL;
        if (API_ROOT === 'local') {
            baseURL = 'http://localhost:3000/'
        } else if (API_ROOT === 'dev') {
            baseURL = 'https://bob-api-dev.herokuapp.com/';
        } else if (API_ROOT === 'stag') {
            baseURL = 'https://bob-api-stag.herokuapp.com/';
        } else if (API_ROOT === 'prod') {
            baseURL = 'https://bob-api.herokuapp.com/';
        }

        this.api = axios.create({
            baseURL: baseURL,
            timeout: 60000
        });

        this.api.interceptors.response.use(response => {
            if (response.status) {
                if (response.data !== undefined) {
                    return Promise.resolve(response);
                }
                else {
                    return Promise.resolve(Response);
                }
            }
            else {
                return Promise.reject(response);
            }
        }, error => {
            return Promise.reject(error);
        });
    }

    // ### Authentication ###
    login(email, password) {
        return this.api.get(`users/signin?email=${email}&password=${password}`);
    }

    register(email, password, name, phone, country) {
        let body = {
            email,
            password,
            name,
            phone,
            country
        }
        return this.api.post('users/signup', body);
    }

    verifyToken(token) {
        return this.api.get(`users/verifyToken?token=${token}`);
    }

    async getToken() {
        return await localStorage.getItem('userToken');
    }

    async setTokenInHeader(token) {
        await localStorage.setItem('userToken', token);
        this.api.defaults.headers.common['x-access-token'] = token;
        this.api.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
    }

    // ### Devices ###
    devicesList(page, pageSize) {
        return this.api.get(`devices/list?page=${page}&pageSize=${pageSize}`);
    }

    deviceDelete(id) {
        return this.api.get(`devices/delete?id=${id}`);
    }

    deviceSave(id, name, imei) {
        let body = {
            id,
            name,
            imei
        }
        return this.api.post('devices/save', body);
    }


}

export default (new Api());