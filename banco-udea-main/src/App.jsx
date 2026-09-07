import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { ArrowLeftRight, ArrowRight, History, RefreshCw, ShieldCheck, UserPlus, Users } from 'lucide-react'
import { Alert, EmptyState, Loading, Navbar, PageHeader, StatIcon } from './components'
import { createCustomer, getApiError, getCustomers, getTransactionsByAccount, transferMoney } from './services/api'
import { formatCurrency, formatDate, fullName } from './utils/formatters'

const EMPTY_CUSTOMER = { firstName: '', lastName: '', accountNumber: '', balance: '' }
const EMPTY_TRANSFER = { senderAccountNumber: '', receiverAccountNumber: '', amount: '' }

function Shell({ children }) {
  return <><Navbar /><main className="shell">{children}</main><footer>Banco UdeA · Laboratorio 1 - Arquitectura de Software</footer></>
}

function HomePage() {
  const cards = [
    ['Clientes', 'Consulta las cuentas registradas', Users, '/clientes'],
    ['Transferencias', 'Realiza transferencias entre cuentas', ArrowLeftRight, '/transferir'],
    ['Historial', 'Consulta los movimientos de cada cuenta', History, '/historial'],
    ['Crear cliente', 'Registra una nueva cuenta bancaria', UserPlus, '/crear-cliente'],
  ]
  return <div className="home"><div className="hero"><div>
    <span className="eyebrow">Laboratorio 1 · Arquitectura de Software</span><h1>Gestión bancaria<br /><em>clara y conectada.</em></h1>
    <p>Administra clientes, cuentas y transferencias del Banco UdeA desde una interfaz sencilla conectada a tu API REST.</p>
    <Link className="button primary" to="/clientes">Explorar clientes <ArrowRight size={17} /></Link>
  </div><div className="hero-panel"><ShieldCheck size={28} /><strong>Conexión con Spring Boot</strong><span>Las operaciones se procesan de forma segura en el backend institucional.</span></div></div>
  <section className="section"><div className="section-heading"><span className="eyebrow">Accesos rápidos</span><h2>¿Qué necesitas hacer?</h2></div>
    <div className="feature-grid">{cards.map(([title, description, Icon, to]) => <Link className="feature-card" to={to} key={title}><span className="icon-box"><Icon size={20} /></span><span><h3>{title}</h3><p>{description}</p></span><ArrowRight className="card-arrow" size={18} /></Link>)}</div>
  </section></div>
}

function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const loadCustomers = async () => {
    setLoading(true); setError('')
    try { setCustomers((await getCustomers()).data) } catch (requestError) { setError(getApiError(requestError)) } finally { setLoading(false) }
  }
  useEffect(() => { loadCustomers() }, [])
  return <><PageHeader title="Clientes" description="Consulta las cuentas registradas en el banco." action={<button className="button secondary" onClick={loadCustomers} disabled={loading}><RefreshCw className={loading ? 'spin' : ''} size={16} /> Actualizar</button>} />
    {error && <Alert>{error}</Alert>}
    {loading ? <Loading text="Cargando clientes..." /> : !customers.length ? <EmptyState>No hay clientes registrados.</EmptyState> : <div className="table-wrap"><table>
      <thead><tr><th>ID</th><th>Nombre completo</th><th>Número de cuenta</th><th>Saldo disponible</th><th>Acciones</th></tr></thead>
      <tbody>{customers.map((customer) => <tr key={customer.id}><td className="muted">#{customer.id}</td><td><strong>{fullName(customer)}</strong></td><td><span className="account">{customer.accountNumber}</span></td><td className="money">{formatCurrency(customer.balance)}</td><td><div className="actions"><Link className="text-button" to={`/historial?cuenta=${encodeURIComponent(customer.accountNumber)}`}>Ver historial</Link><Link className="text-button" to={`/transferir?origen=${encodeURIComponent(customer.accountNumber)}`}>Transferir</Link></div></td></tr>)}</tbody>
    </table></div>}
  </>
}

function TransferPage() {
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState(EMPTY_TRANSFER)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState('')
  const location = useLocation()
  const loadCustomers = async () => {
    setLoading(true)
    try { setCustomers((await getCustomers()).data) } catch (requestError) { setError(getApiError(requestError)) } finally { setLoading(false) }
  }
  useEffect(() => {
    loadCustomers()
    const origin = new URLSearchParams(location.search).get('origen')
    if (origin) setForm((current) => ({ ...current, senderAccountNumber: origin }))
  }, [location.search])
  const sender = customers.find(({ accountNumber }) => String(accountNumber) === form.senderAccountNumber)
  const update = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }))
  const submit = async (event) => {
    event.preventDefault(); setError(''); setMessage(null)
    const amount = Number(form.amount)
    if (!form.senderAccountNumber || !form.receiverAccountNumber) return setError('Selecciona las cuentas de origen y destino.')
    if (form.senderAccountNumber === form.receiverAccountNumber) return setError('Las cuentas de origen y destino deben ser diferentes.')
    if (!Number.isFinite(amount) || amount <= 0) return setError('El monto debe ser mayor que 0.')
    if (sender && amount > Number(sender.balance)) return setError('El monto no puede superar el saldo disponible.')
    setSending(true)
    try {
      await transferMoney({ senderAccountNumber: form.senderAccountNumber, receiverAccountNumber: form.receiverAccountNumber, amount })
      setMessage({ amount, from: form.senderAccountNumber, to: form.receiverAccountNumber }); setForm((current) => ({ ...current, amount: '' })); await loadCustomers()
    } catch (requestError) { setError(getApiError(requestError)) } finally { setSending(false) }
  }
  return <><PageHeader title="Realizar transferencia" description="Envía dinero entre cuentas registradas." /><div className="form-card">
    {error && <Alert>{error}</Alert>}{message && <Alert type="success">Transferencia realizada correctamente. {formatCurrency(message.amount)} enviados de {message.from} a {message.to}.</Alert>}
    {loading ? <Loading text="Cargando cuentas..." /> : !customers.length ? <EmptyState>No hay cuentas disponibles para transferir.</EmptyState> : <form onSubmit={submit}><div className="form-grid">
      <label>Cuenta de origen<select name="senderAccountNumber" value={form.senderAccountNumber} onChange={update} required><option value="">Selecciona una cuenta</option>{customers.map((customer) => <option key={customer.accountNumber} value={customer.accountNumber}>{fullName(customer)} · {customer.accountNumber}</option>)}</select>{sender && <small className="balance">Saldo disponible: {formatCurrency(sender.balance)}</small>}</label>
      <label>Cuenta de destino<select name="receiverAccountNumber" value={form.receiverAccountNumber} onChange={update} required><option value="">Selecciona una cuenta</option>{customers.map((customer) => <option key={customer.accountNumber} value={customer.accountNumber}>{fullName(customer)} · {customer.accountNumber}</option>)}</select></label>
      <label className="wide">Monto a transferir<div className="amount-input"><span>$</span><input name="amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={update} placeholder="0" required /></div></label>
    </div><button className="button primary" disabled={sending}>{sending ? <><RefreshCw className="spin" size={16} /> Procesando transferencia...</> : <>Realizar transferencia <ArrowRight size={17} /></>}</button></form>}
  </div></>
}

function HistoryPage() {
  const location = useLocation()
  const [customers, setCustomers] = useState([])
  const [selected, setSelected] = useState(new URLSearchParams(location.search).get('cuenta') || '')
  const [transactions, setTransactions] = useState([])
  const [loadingCustomers, setLoadingCustomers] = useState(true)
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [error, setError] = useState('')
  const customer = customers.find(({ accountNumber }) => String(accountNumber) === selected)
  useEffect(() => {
    setError(''); getCustomers().then(({ data }) => setCustomers(data)).catch((requestError) => setError(getApiError(requestError))).finally(() => setLoadingCustomers(false))
  }, [])
  useEffect(() => {
    if (!selected) { setTransactions([]); setLoadingTransactions(false); return }
    setError(''); setLoadingTransactions(true)
    getTransactionsByAccount(selected).then(({ data }) => setTransactions(data)).catch((requestError) => { setTransactions([]); setError(getApiError(requestError)) }).finally(() => setLoadingTransactions(false))
  }, [selected])
  return <><PageHeader title="Historial de transacciones" description="Revisa los movimientos de cada cuenta." />
    <div className="select-card"><label>Selecciona una cuenta<select value={selected} onChange={(event) => setSelected(event.target.value)} disabled={loadingCustomers}><option value="">{loadingCustomers ? 'Cargando cuentas...' : 'Selecciona una cuenta'}</option>{customers.map((item) => <option key={item.accountNumber} value={item.accountNumber}>{fullName(item)} · {item.accountNumber}</option>)}</select></label></div>
    {error && <Alert>{error}</Alert>}{customer && <div className="account-summary"><div><span className="eyebrow">Cuenta seleccionada</span><h2>{fullName(customer)}</h2><span className="account">{customer.accountNumber}</span></div><div><small>Saldo actual</small><strong>{formatCurrency(customer.balance)}</strong></div></div>}
    {selected && (loadingTransactions ? <Loading text="Cargando movimientos..." /> : !transactions.length ? <EmptyState>Esta cuenta todavía no tiene movimientos registrados.</EmptyState> : <div className="table-wrap"><table>
      <thead><tr><th>Fecha y hora</th><th>Cuenta origen</th><th>Cuenta destino</th><th>Tipo</th><th>Monto</th></tr></thead><tbody>{transactions.map((transaction) => {
        const incoming = String(transaction.receiverAccountNumber) === selected
        return <tr key={transaction.id}><td>{formatDate(transaction.timestamp)}</td><td>{transaction.senderAccountNumber}</td><td>{transaction.receiverAccountNumber}</td><td><span className={`movement ${incoming ? 'received' : 'sent'}`}><StatIcon type={incoming ? 'in' : 'out'} />{incoming ? 'Recibida' : 'Enviada'}</span></td><td className={incoming ? 'positive' : 'negative'}>{incoming ? '+' : '-'}{formatCurrency(transaction.amount)}</td></tr>
      })}</tbody>
    </table></div>)}
  </>
}

function CreateCustomerPage() {
  const [form, setForm] = useState(EMPTY_CUSTOMER)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)
  const update = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }))
  const submit = async (event) => {
    event.preventDefault(); setError(''); setSuccess('')
    const firstName = form.firstName.trim(), lastName = form.lastName.trim(), accountNumber = form.accountNumber.trim(), balance = Number(form.balance)
    if (!firstName || !lastName || !accountNumber || form.balance === '') return setError('Todos los campos son obligatorios.')
    if (!Number.isFinite(balance)) return setError('El saldo debe ser numérico.')
    if (balance < 0) return setError('El saldo no puede ser negativo.')
    setSaving(true)
    try { await createCustomer({ firstName, lastName, accountNumber, balance }); setSuccess('Cliente creado correctamente.'); setForm(EMPTY_CUSTOMER) }
    catch (requestError) { setError(getApiError(requestError)) } finally { setSaving(false) }
  }
  return <><PageHeader title="Crear cliente" description="Registra una nueva cuenta bancaria en el sistema." /><div className="form-card narrow">
    {error && <Alert>{error}</Alert>}{success && <Alert type="success">{success}</Alert>}<form onSubmit={submit}><div className="form-grid">
      <label>Nombre<input name="firstName" value={form.firstName} onChange={update} placeholder="Ej. María" required /></label><label>Apellido<input name="lastName" value={form.lastName} onChange={update} placeholder="Ej. Castañeda" required /></label><label>Número de cuenta<input name="accountNumber" value={form.accountNumber} onChange={update} placeholder="Ej. 100001" required /></label><label>Saldo inicial<input name="balance" type="number" min="0" step="0.01" value={form.balance} onChange={update} placeholder="0" required /></label>
    </div><div className="form-actions"><button className="button primary" disabled={saving}>{saving ? 'Creando cliente...' : 'Crear cliente'} <ArrowRight size={17} /></button><Link className="button secondary" to="/clientes">Ver clientes</Link></div></form>
  </div></>
}

function App() {
  return <BrowserRouter><Shell><Routes><Route path="/" element={<HomePage />} /><Route path="/clientes" element={<CustomersPage />} /><Route path="/transferir" element={<TransferPage />} /><Route path="/historial" element={<HistoryPage />} /><Route path="/crear-cliente" element={<CreateCustomerPage />} /></Routes></Shell></BrowserRouter>
}

export default App
