import { NavLink, Link } from 'react-router-dom'
import { Landmark, LayoutDashboard, Users, ArrowLeftRight, History, UserPlus, LoaderCircle, AlertCircle, CheckCircle2, Inbox, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react'

export function Navbar() {
  const links = [['/', 'Inicio', LayoutDashboard], ['/clientes', 'Clientes', Users], ['/crear-cliente', 'Crear cliente', UserPlus], ['/transferir', 'Transferir', ArrowLeftRight], ['/historial', 'Historial', History]]
  return <header className="topbar"><Link to="/" className="brand"><span className="brand-mark"><Landmark size={21}/></span><span><strong>Banco UdeA</strong><small>Laboratorio 1</small></span></Link><nav>{links.map(([to, label, Icon]) => <NavLink key={to} to={to} end={to === '/'} className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}><Icon size={17}/><span>{label}</span></NavLink>)}</nav></header>
}
export function Loading({ text = 'Cargando información...' }) { return <div className="state"><LoaderCircle className="spin" size={24}/><span>{text}</span></div> }
export function Alert({ type = 'error', children }) { return <div className={`alert ${type}`} role="alert">{type === 'error' ? <AlertCircle size={18}/> : <CheckCircle2 size={18}/>}<span>{children}</span></div> }
export function EmptyState({ children }) { return <div className="empty"><Inbox size={28}/><p>{children}</p></div> }
export function PageHeader({ eyebrow = 'Banco UdeA', title, description, action }) { return <div className="page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div> }
export function StatIcon({ type }) { return type === 'in' ? <ArrowDownLeft size={18}/> : <ArrowUpRight size={18}/> }
export function Modal({ title, children, onClose }) { return <div className="modal-backdrop" role="presentation"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><h2 id="modal-title">{title}</h2><button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar"><X size={19}/></button></div>{children}</section></div> }
