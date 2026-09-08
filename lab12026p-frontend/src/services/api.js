import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const getCustomers = () => api.get('/customers')
export const getCustomerById = (id) => api.get(`/customers/${encodeURIComponent(id)}`)
export const createCustomer = (customer) => api.post('/customers', customer)
export const updateCustomer = (id, customer) => api.put(`/customers/${encodeURIComponent(id)}`, customer)
export const deleteCustomer = (id) => api.delete(`/customers/${encodeURIComponent(id)}`)
export const transferMoney = (transaction) => api.post('/transactions', transaction)
export const getTransactionsByAccount = (accountNumber) => api.get(`/transactions/${encodeURIComponent(accountNumber)}`)

export function getApiError(error) {
  const data = error?.response?.data
  if (typeof data === 'string' && data.trim()) return data
  if (data?.message) return data.message
  if (!error?.response) return 'No fue posible conectar con el backend. Verifica que Spring Boot esté ejecutándose.'
  return `El backend respondió con el estado HTTP ${error.response.status}.`
}
