import { useEffect, useState } from 'react'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Alert, EmptyState, Loading, PageHeader } from '../components'
import { getApiError, getCustomers, transferMoney } from '../services/api'
import { formatCurrency, fullName } from '../utils/formatters'

export default function TransferPage() {
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({ senderAccountNumber: '', receiverAccountNumber: '', amount: '' })
  const [loading, setLoading] = useState(true), [sending, setSending] = useState(false), [message, setMessage] = useState(null), [error, setError] = useState('')
  const location = useLocation()
  const load = async () => {
    setLoading(true)
    try { setCustomers((await getCustomers()).data) } catch (e) { setError(getApiError(e)) } finally { setLoading(false) }
  }
  useEffect(() => { load(); const origin = new URLSearchParams(location.search).get('origen'); if (origin) setForm((current) => ({ ...current, senderAccountNumber: origin })) }, [location.search])
  const sender = customers.find((c) => String(c.accountNumber) === form.senderAccountNumber)
  const submit = async (event) => {
    event.preventDefault(); setError(''); setMessage(null)
    const amount = Number(form.amount)
    if (!form.senderAccountNumber || !form.receiverAccountNumber) return setError('Selecciona las cuentas de origen y destino.')
    if (form.senderAccountNumber === form.receiverAccountNumber) return setError('Las cuentas de origen y destino deben ser diferentes.')
    if (!Number.isFinite(amount) || amount <= 0) return setError('El monto debe ser mayor que cero.')
    if (sender && amount > Number(sender.balance)) return setError('El monto no puede superar el saldo disponible.')
    setSending(true)
    try { await transferMoney({ senderAccountNumber: form.senderAccountNumber, receiverAccountNumber: form.receiverAccountNumber, amount }); setMessage({ ...form, amount }); setForm((current) => ({ ...current, amount: '' })); await load() } catch (e) { setError(getApiError(e)) } finally { setSending(false) }
  }
  const update = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }))
  return <><PageHeader title="Realizar transferencia" description="Envía dinero entre cuentas registradas."/><div className="form-card">{error && <Alert>{error}</Alert>}{message && <Alert type="success">Transferencia realizada correctamente. {formatCurrency(message.amount)} enviados de {message.senderAccountNumber} a {message.receiverAccountNumber}.</Alert>}{loading ? <Loading text="Cargando cuentas..."/> : !customers.length ? <EmptyState>No hay cuentas disponibles.</EmptyState> : <form onSubmit={submit}><div className="form-grid"><label>Cuenta de origen<select name="senderAccountNumber" value={form.senderAccountNumber} onChange={update} required><option value="">Selecciona una cuenta</option>{customers.map((c) => <option key={c.accountNumber} value={c.accountNumber}>{fullName(c)} · {c.accountNumber}</option>)}</select>{sender && <small className="balance">Saldo disponible: {formatCurrency(sender.balance)}</small>}</label><label>Cuenta de destino<select name="receiverAccountNumber" value={form.receiverAccountNumber} onChange={update} required><option value="">Selecciona una cuenta</option>{customers.map((c) => <option key={c.accountNumber} value={c.accountNumber}>{fullName(c)} · {c.accountNumber}</option>)}</select></label><label className="wide">Monto a transferir<div className="amount-input"><span>$</span><input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={update} required /></div></label></div><button className="button primary" disabled={sending}>{sending ? <><RefreshCw className="spin" size={16}/> Procesando transferencia...</> : <>Realizar transferencia <ArrowRight size={17}/></>}</button></form>}</div></>
}
