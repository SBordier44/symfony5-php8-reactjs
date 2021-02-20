import axios from "axios";
import jwtDecode from "jwt-decode";

function authenticate(credentials) {
    return axios.post('/api/login_check', credentials)
        .then(response => response.data.token)
        .then(token => {
            localStorage.setItem('authToken', token)
            setAxiosToken(token)
        })
}

function setAxiosToken(token) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + token
}

function logout() {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers['Authorization']
}

function setup() {
    const token = localStorage.getItem('authToken')
    if (token) {
        const {exp: expiration} = jwtDecode(token)
        if (expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token)
        } else {
            logout()
        }
    } else {
        logout()
    }
}

function isAuthenticated() {
    const token = localStorage.getItem('authToken')
    if (token) {
        const {exp: expiration} = jwtDecode(token)
        return expiration * 1000 > new Date().getTime();
    }
    return false
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
}
