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

    register(email, password, first_name, last_name, phone, country) {
        let body = {
            email,
            password,
            first_name,
            last_name,
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

    deviceBeep(imei, latitude, longitude, timezone, speed, pressed_button) {
        let body = {
            imei,
            latitude,
            longitude,
            timezone,
            speed,
            pressed_button
        }
        return this.api.post('devices/beep', body);
    }

    deviceBeepHelpList(token) {
        return this.api.get(`devices/beep/help?token=${token}`);
    }

    deviceBeepHelpLast(token) {
        return this.api.get(`devices/beep/help/last?token=${token}`);
    }

    // ### Contacts ###
    contactsList(deviceId) {
        return this.api.get(`contacts/list/all?device_id=${deviceId}`);
    }

    contactDelete(id) {
        return this.api.get(`contacts/delete?id=${id}`);
    }

    contactSave(id, device_id, name, email, message, phone) {
        let body = {
            id,
            device_id,
            name,
            email,
            message,
            phone
        }
        return this.api.post('contacts/save', body);
    }

}

export default (new Api());