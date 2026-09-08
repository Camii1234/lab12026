import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Alert, PageHeader } from '../components'
import { createCustomer, getApiError } from '../services/api'

const EMPTY = { firstName: '', lastName: '', accountNumber: '', balance: '' }

export default function CreateCustomerPage() {
  const [form, setForm] = useState(EMPTY), [error, setError] = useState(''), [success, setSuccess] = useState(''), [saving, setSaving] = useState(false)
  const submit = async (event) => {
    event.preventDefault(); setError(''); setSuccess('')
    const data = { firstName: form.firstName.trim(), lastName: form.lastName.trim(), accountNumber: form.accountNumber.trim(), balance: Number(form.balance) }
    if (!data.firstName || !data.lastName || !data.accountNumber || form.balance === '') return setError('Todos los campos son obligatorios.')
    if (!Number.isFinite(data.balance) || data.balance < 0) return setError('El saldo debe ser un número mayor o igual que cero.')
    setSaving(true)
    try { await createCustomer(data); setSuccess('Cliente creado correctamente.'); setForm(EMPTY) } catch (e) { setError(getApiError(e)) } finally { setSaving(false) }
  }
  const update = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }))
  return <><PageHeader title="Crear cliente" description="Registra una nueva cuenta bancaria en el sistema."/><div className="form-card narrow">{error && <Alert>{error}</Alert>}{success && <Alert type="success">{success}</Alert>}<form onSubmit={submit}><div className="form-grid"><label>Nombre<input name="firstName" value={form.firstName} onChange={update} required /></label><label>Apellido<input name="lastName" value={form.lastName} onChange={update} required /></label><label>Número de cuenta<input name="accountNumber" value={form.accountNumber} onChange={update} required /></label><label>Saldo inicial<input name="balance" type="number" min="0" step="0.01" value={form.balance} onChange={update} required /></label></div><div className="form-actions"><button className="button primary" disabled={saving}>{saving ? 'Creando cliente...' : 'Crear cliente'} <ArrowRight size={17}/></button><Link className="button secondary" to="/clientes">Ver clientes</Link></div></form></div></>
}
