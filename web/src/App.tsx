import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EmBreve from './pages/EmBreve';

const MENU = [
  { to: '/', label: 'Dashboard' },
  { to: '/importar', label: 'Importar pedidos' },
  { to: '/conferir', label: 'Conferir pedidos' },
  { to: '/automatizar', label: 'Automatizar lançamentos' },
  { to: '/historico', label: 'Histórico de pedidos' },
  { to: '/configuracoes', label: 'Configurações' },
];

export default function App() {
  return (
    <div className="layout">
      <aside className="menu">
        <div className="marca">WorkList Alto</div>
        <nav>
          {MENU.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.to === '/'}>
              {m.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="conteudo">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/importar" element={<EmBreve titulo="Importar pedidos" fase="Fase 3" />} />
          <Route path="/conferir" element={<EmBreve titulo="Conferir pedidos" fase="Fase 3" />} />
          <Route path="/automatizar" element={<EmBreve titulo="Automatizar lançamentos" fase="Fase 4" />} />
          <Route path="/historico" element={<EmBreve titulo="Histórico de pedidos" fase="Fase 3" />} />
          <Route path="/configuracoes" element={<EmBreve titulo="Configurações" fase="Fase 3" />} />
        </Routes>
      </main>
    </div>
  );
}
