import axios from "axios";
const instance = axios.create({ baseURL: "http://localhost:8080" })


instance.interceptors.request.use((req) => {
    if (req.url == "/users/login" && "/users/register") {
        return req
    } else {
        const t = localStorage.getItem("token")
        if (t) {
            req.headers.Authorization = t
        }
        return req
    }
}, (error) => {
    return Promise.reject(error)
})

instance.interceptors.response.use((response) => response, (error) => {
    if (error && error.response && error.response.status == 401) {
        localStorage.clear()
        window.location = '/login';
    }
    return Promise.reject(error)
})
        
export default instance

