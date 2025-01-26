import axios, { type AxiosInstance, type AxiosResponse } from 'axios'

const api: AxiosInstance = axios.create({
  baseURL: `https://site.bonit.ir/api/`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
})



api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error?.code === 'ECONNABORTED') {
      console.log('timeout')
    }
    else if (typeof error.response?.status === 'number' && error.response.status >= 500) {
      // const store = useStore()
      // if (!store.globalModalIsOpen) store.setGlobalModal('no-wifi')
      console.log('server error')
      // todo: show error same as above
    }

    return Promise.reject(error)
  },
)
export { api }
