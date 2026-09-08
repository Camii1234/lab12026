import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Navbar } from './components'
import CreateCustomerPage from './pages/CreateCustomerPage'
import CustomersPage from './pages/CustomersPage'
import HistoryPage from './pages/HistoryPage'
import HomePage from './pages/HomePage'
import TransferPage from './pages/TransferPage'

export default function App() {
  return <BrowserRouter><Navbar /><main className="shell"><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/clientes" element={<CustomersPage />} />
    <Route path="/transferir" element={<TransferPage />} />
    <Route path="/historial" element={<HistoryPage />} />
    <Route path="/crear-cliente" element={<CreateCustomerPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></main><footer>Banco UdeA · Laboratorio 1 - Arquitectura de Software</footer></BrowserRouter>
}
