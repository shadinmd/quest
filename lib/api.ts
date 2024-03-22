import axios, { isAxiosError } from "axios";
import { toast } from "sonner";

const api = axios.create({
	baseURL: "/api"
})

api.interceptors.response.use(
	response => response,
	error => {
		if (isAxiosError(error)) {
			if (error.response?.data.error == "unauthorized") {
				localStorage.removeItem("token")
				toast.error(error.response.data.message)
				window.location.assign("/login")
			} else {
				return Promise.reject(error)
			}
		} else {
			return Promise.reject(error)
		}
	}
)

api.interceptors.request.use((request) => {
	if (localStorage.getItem("token"))
		request.headers.Authorization = localStorage.getItem("token")
	return request
})

export const handleAxiosError = (error: any) => {
	if (isAxiosError(error)) {
		if (error.response?.data.message) {
			toast(error.response.data.message)
		} else {
			toast.error(error.message)
		}
	} else {
		toast.error("something went wrong")
	}
}

export default api
