import axios from 'axios';

const endpoint = "http://localhost:8081/api"
const token = localStorage.getItem('accessToken');

export function get(url) {
    return axios.get(endpoint +url,{
        headers: {Authorization: `Bearer ${token}`},
    });
}

export function put(url,body) {
    return axios.put(endpoint + url ,body);
}

export function post(url,body) {
    return axios.post(endpoint+url,body,{
        headers: {Authorization: `Bearer ${token}`},
    });
}

export function del(url) {
    return axios.del(endpoint+url);
}