import axios from "axios";

function register(payload) {
    axios
        .post('/api/users', payload)
        .then(response => response.data)
}

export default {register}
