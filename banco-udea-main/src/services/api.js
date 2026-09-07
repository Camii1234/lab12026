import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getCustomers = () => api.get('/customers')
export const getCustomerById = (id) => api.get(`/customers/${encodeURIComponent(id)}`)
export const createCustomer = (customer) => api.post('/customers', customer)
export const transferMoney = (transaction) => api.post('/transactions', transaction)
export const getTransactionsByAccount = (accountNumber) => api.get(`/transactions/${encodeURIComponent(accountNumber)}`)

export function getApiError(error) {
  const data = error?.response?.data
  if (typeof data === 'string' && data.trim()) return data
  if (data && typeof data === 'object') {
    const mainMessage = [data.message, data.error, data.detail, data.title].find((value) => typeof value === 'string' && value.trim())
    if (mainMessage) return mainMessage
    const validationMessages = Object.values(data).filter((value) => typeof value === 'string' && value.trim())
    if (validationMessages.length) return validationMessages.join(' ')
  }
  if (!error?.response) return 'No fue posible conectar con el backend. Verifica que Spring Boot esté ejecutándose.'
  return `El backend respondió con el estado HTTP ${error.response.status}.`
}
