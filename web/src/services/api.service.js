import { Config } from '../Config'
const axios = require('axios');

const httpClient = axios.create({
    baseURL: Config.appBaseUrl,
    timeout: 5 * 1e3,
});

const setHeaders = () => {
    const userinfo = localStorage.getItem('userinfo');
    const token = userinfo ? JSON.parse(userinfo).token : null;
    const datas = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    return datas;
}

export async function register(formData) {
    try {
        const res = await httpClient.post(`/api/user/register`, formData, setHeaders());
        // console.log('register', res.data);
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function login(formData) {
    try {
        const res = await httpClient.post(`/api/user/login`, formData, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function logout(params) {
    try {
        const res = await httpClient.post(`/api/user/logout`, params, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function tokenLogin(params) {
    try {
        const res = await httpClient.post(`/api/user/tokenLogin`, params, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function profile(id, formData) {
    try {
        const res = await httpClient.put(`/api/user/profile/${id}`, formData, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function inactive(id, params) {
    try {
        const res = await httpClient.put(`/api/user/inactive/${id}`, params, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}


// role list
export async function roleList(params) {
    try {
        const res = await httpClient.get(`/api/role`, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function roleAdd(formData) {
    try {
        const res = await httpClient.post(`/api/role`, formData, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function roleUpdate(id, formData) {
    try {
        const res = await httpClient.put(`/api/role/${id}`, formData, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function roleDelete(id) {
    try {
        const res = await httpClient.delete(`/api/role/${id}`, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

// user api list
export async function userList(params) {
    try {
        const res = await httpClient.get(`/api/user`, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function userExport(params) {
    try {
        const res = await httpClient.get(`/api/user/export`, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function userAdd(formData) {
    try {
        const res = await httpClient.post(`/api/user`, formData, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function userUpdate(id, formData) {
    try {
        const res = await httpClient.put(`/api/user/${id}`, formData, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function userRecover(id, formData) {
    try {
        const res = await httpClient.put(`/api/user/recover/${id}`, formData, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function userDelete(id) {
    try {
        const res = await httpClient.delete(`/api/user/${id}`, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

// category api list
export async function categoryList(params) {
    try {
        const res = await httpClient.get(`/api/category`, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function categoryAdd(formData) {
    try {
        const res = await httpClient.post(`/api/category`, formData, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function categoryUpdate(id, formData) {
    try {
        const res = await httpClient.put(`/api/category/${id}`, formData, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function categoryDelete(id) {
    try {
        const res = await httpClient.delete(`/api/category/${id}`, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

// item api list
export async function itemList(params) {
    try {
        const res = await httpClient.get(`/api/item`, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function itemAdd(formData) {
    try {
        const res = await httpClient.post(`/api/item`, formData, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function itemUpdate(id, formData) {
    try {
        const res = await httpClient.put(`/api/item/${id}`, formData, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function itemDelete(id) {
    try {
        const res = await httpClient.delete(`/api/item/${id}`, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function itemRecover(id, formData) {
    try {
        const res = await httpClient.put(`/api/item/recover/${id}`, formData, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function itemExport(params) {
    try {
        const res = await httpClient.get(`/api/item/export`, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function upload(file) {
    const formData = new FormData();
    formData.append('image', file);
    let headers = setHeaders();
    headers['Content-Type'] = 'multipart/form-data';
    return await httpClient.post(`/api/upload/${file.uid}`, formData, headers);
}

export async function itemUpload(file) {
    const formData = new FormData();
    formData.append('image', file);
    let headers = setHeaders();
    headers['Content-Type'] = 'multipart/form-data';
    return await httpClient.post(`/api/item/upload/${file.uid}`, formData, headers);
}

// sales api list
export async function salesList(params) {
    try {
        const res = await httpClient.get(`/api/sales`, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function salesAdd(formData) {
    try {
        const res = await httpClient.post(`/api/sales`, formData, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function salesUpdate(id, formData) {
    try {
        const res = await httpClient.put(`/api/sales/${id}`, formData, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function salesDelete(id) {
    try {
        const res = await httpClient.delete(`/api/sales/${id}`, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function salesRecover(id, formData) {
    try {
        const res = await httpClient.put(`/api/sales/recover/${id}`, formData, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}

export async function salesExport(params) {
    try {
        const res = await httpClient.get(`/api/sales/export`, setHeaders());
        return res.data;
    } catch (error) {
        throw error.response;
    }
}