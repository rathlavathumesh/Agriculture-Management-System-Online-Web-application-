import axios from 'axios'

const inferredBase = (() => {
  const envUrl = import.meta.env.VITE_API_URL
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  // If env URL exists but points to localhost while we are on a LAN host, override to current host
  if (envUrl) {
    const isEnvLocal = /(^|\/)localhost(?=[:/]|$)|(^|\/)127\.0\.0\.1(?=[:/]|$)/i.test(envUrl)
    const isWindowLocal = /^(localhost|127\.0\.0\.1)$/i.test(host)
    if (isEnvLocal && !isWindowLocal) {
      return `http://${host}:4000/api`
    }
    return envUrl
  }
  return `http://${host}:4000/api`
})()

const api = axios.create({ baseURL: inferredBase })

api.interceptors.request.use((config) => {
  const token = (typeof window !== 'undefined' ? sessionStorage.getItem('token') : null) || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
