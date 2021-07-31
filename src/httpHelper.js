import axios from 'axios';

const endpoint = "http://localhost:8081/api"

export function get(url) {
    return axios.get(endpoint +url,{
        headers: {Authorization: `Bearer ${localStorage.getItem('accessToken')}`},
    });
}

export function put(url,body) {
    return axios.put(endpoint + url ,body,{
        headers: {Authorization: `Bearer ${localStorage.getItem('accessToken')}`},
    });
}

export function post(url,body) {
    return axios.post(endpoint+url,body,{
        headers: {Authorization: `Bearer ${localStorage.getItem('accessToken')}`},
    });
}

export function del(url) {
    return axios.delete(endpoint+url,{
        headers: {Authorization: `Bearer ${localStorage.getItem('accessToken')}`},
    });
}
export function uploadImage(url,file) {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(endpoint+url,formData,{
        headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-type': 'multipart/form-data'
        },
    });
}

export const UploadImageCP = async (url,file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const resp = await axios.post(endpoint+url,formData,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-type': 'multipart/form-data'
            },
        });
        console.log(resp.data);
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};