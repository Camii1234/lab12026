import { ArrowLeftRight, ArrowRight, History, ShieldCheck, UserPlus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const cards = [
    ['Clientes', 'Consulta las cuentas registradas', Users, '/clientes'],
    ['Transferencias', 'Realiza transferencias entre cuentas', ArrowLeftRight, '/transferir'],
    ['Historial', 'Consulta los movimientos de cada cuenta', History, '/historial'],
    ['Crear cliente', 'Registra una nueva cuenta bancaria', UserPlus, '/crear-cliente'],
  ]

  return <div className="home"><div className="hero"><div><span className="eyebrow">Laboratorio 1 · Arquitectura de Software</span><h1>Gestión bancaria<br /><em>clara y conectada.</em></h1><p>Administra clientes, cuentas y transferencias desde una interfaz conectada a la API REST.</p><Link className="button primary" to="/clientes">Explorar clientes <ArrowRight size={17}/></Link></div><div className="hero-panel"><ShieldCheck size={28}/><strong>Conexión con Spring Boot</strong><span>Las operaciones se procesan directamente en el backend y se guardan en MySQL.</span></div></div>
    <section className="section"><div className="section-heading"><span className="eyebrow">Accesos rápidos</span><h2>¿Qué necesitas hacer?</h2></div><div className="feature-grid">{cards.map(([title, desc, Icon, to]) => <Link className="feature-card" to={to} key={title}><span className="icon-box"><Icon size={20}/></span><span><h3>{title}</h3><p>{desc}</p></span><ArrowRight className="card-arrow" size={18}/></Link>)}</div></section>
  </div>
}
