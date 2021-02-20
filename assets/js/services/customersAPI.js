import axios from "axios";
import {CUSTOMERS_API} from "../config";

function findAll() {
    return axios
        .get(CUSTOMERS_API)
        .then(response => response.data['hydra:member'])
}

function destroy(id) {
    return axios
        .delete(CUSTOMERS_API + '/' + id)
}

function find(id) {
    return axios
        .get(CUSTOMERS_API + '/' + id)
        .then(response => response.data)
}

function edit(id, payload) {
    return axios
        .put(CUSTOMERS_API + '/' + id, payload)
        .then(response => response.data)
}

function create(payload) {
    return axios
        .post(CUSTOMERS_API, payload)
        .then(response => response.data)
}

export default {
    findAll,
    destroy,
    find,
    create,
    edit
}
