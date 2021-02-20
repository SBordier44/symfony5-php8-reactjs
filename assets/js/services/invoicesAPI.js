import axios from "axios";
import {INVOICES_API} from "../config";

function fetchAll() {
    return axios
        .get(INVOICES_API)
        .then(response => response.data['hydra:member'])
}

function destroy(id) {
    return axios
        .delete(INVOICES_API + '/' + id)
}

function find(id) {
    return axios
        .get(INVOICES_API + '/' + id)
        .then(response => response.data)
}

function edit(id, payload) {
    return axios
        .put(INVOICES_API + '/' + id, {
            ...payload, customer: '/api/customers/' + payload.customer
        })
        .then(response => response.data)
}

function create(payload) {
    return axios
        .post(INVOICES_API, {
            ...payload, customer: `/api/customers/${payload.customer}`
        })
        .then(response => response.data)
}

export default {
    fetchAll, destroy, find, edit, create
}
