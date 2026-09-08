import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Alert, EmptyState, Loading, PageHeader, StatIcon } from '../components'
import { getApiError, getCustomers, getTransactionsByAccount } from '../services/api'
import { formatCurrency, formatDate, fullName } from '../utils/formatters'

export default function HistoryPage() {
  const location = useLocation()
  const [customers, setCustomers] = useState([])
  const [selected, setSelected] = useState(new URLSearchParams(location.search).get('cuenta') || '')
  const [transactions, setTransactions] = useState([])
  const [loadingCustomers, setLoadingCustomers] = useState(true), [loadingTransactions, setLoadingTransactions] = useState(false), [error, setError] = useState('')
  const customer = customers.find((c) => String(c.accountNumber) === selected)
  useEffect(() => { getCustomers().then(({ data }) => setCustomers(data)).catch((e) => setError(getApiError(e))).finally(() => setLoadingCustomers(false)) }, [])
  useEffect(() => {
    if (!selected) { setTransactions([]); return }
    setError(''); setLoadingTransactions(true)
    getTransactionsByAccount(selected).then(({ data }) => setTransactions(data)).catch((e) => { setTransactions([]); setError(getApiError(e)) }).finally(() => setLoadingTransactions(false))
  }, [selected])
  return <><PageHeader title="Historial de transacciones" description="Revisa los movimientos de cada cuenta."/><div className="select-card"><label>Selecciona una cuenta<select value={selected} onChange={(e) => setSelected(e.target.value)} disabled={loadingCustomers}><option value="">{loadingCustomers ? 'Cargando cuentas...' : 'Selecciona una cuenta'}</option>{customers.map((c) => <option key={c.accountNumber} value={c.accountNumber}>{fullName(c)} · {c.accountNumber}</option>)}</select></label></div>{error && <Alert>{error}</Alert>}{customer && <div className="account-summary"><div><span className="eyebrow">Cuenta seleccionada</span><h2>{fullName(customer)}</h2><span className="account">{customer.accountNumber}</span></div><div><small>Saldo actual</small><strong>{formatCurrency(customer.balance)}</strong></div></div>}{selected && (loadingTransactions ? <Loading text="Cargando movimientos..."/> : !transactions.length ? <EmptyState>Esta cuenta todavía no tiene movimientos registrados.</EmptyState> : <div className="table-wrap"><table><thead><tr><th>Fecha y hora</th><th>Cuenta origen</th><th>Cuenta destino</th><th>Tipo</th><th>Monto</th></tr></thead><tbody>{transactions.map((t) => { const incoming = String(t.receiverAccountNumber) === selected; return <tr key={t.id}><td>{formatDate(t.timestamp)}</td><td>{t.senderAccountNumber}</td><td>{t.receiverAccountNumber}</td><td><span className={`movement ${incoming ? 'received' : 'sent'}`}><StatIcon type={incoming ? 'in' : 'out'}/>{incoming ? 'Recibida' : 'Enviada'}</span></td><td className={incoming ? 'positive' : 'negative'}>{incoming ? '+' : '-'}{formatCurrency(t.amount)}</td></tr> })}</tbody></table></div>)}</>
}
