import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function useApi() {
  return {
    getIndex: (c) => api.get(`/index/${c}`),
    getAllIndices: () => api.get('/index'),
    simulate: (b) => api.post('/simulate', b),
    getEfficientFrontier: () => api.get('/efficient-frontier'),
    optimize: (r) => api.post('/optimize', { risk_tolerance: r }),
    portfolioRisk: (b) => api.post('/portfolio-risk', b),
    getCorrelation: () => api.get('/correlation-matrix'),
    stressTest: (b) => api.post('/stress-test', b),
    backtest: (b) => api.post('/backtest', b),
    downloadReport: (b) => api.post('/report/pdf', b, { responseType: 'blob' }),
    login: (email, password) => api.post('/auth/login', { email, password }),
    signup: (email, password) => api.post('/auth/signup', { email, password }),
    savePortfolio: (p) => api.post('/portfolio/save', p),
    loadPortfolios: () => api.get('/portfolio/list'),
  }
}
