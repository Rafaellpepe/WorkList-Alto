import { useEffect, useState } from 'react';

type Resumo = {
  importados: number;
  aguardandoLancamento: number;
  lancados: number;
  comErro: number;
  processadosHoje: number;
};

const CARDS: { chave: keyof Resumo; rotulo: string }[] = [
  { chave: 'importados', rotulo: 'Pedidos importados' },
  { chave: 'aguardandoLancamento', rotulo: 'Aguardando lançamento' },
  { chave: 'lancados', rotulo: 'Pedidos lançados' },
  { chave: 'comErro', rotulo: 'Pedidos com erro' },
  { chave: 'processadosHoje', rotulo: 'Processados hoje' },
];

export default function Dashboard() {
  const [resumo, setResumo] = useState<Resumo | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setResumo)
      .catch(() => setErro(true));
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      {erro && <p className="aviso">Não consegui falar com o servidor. Ele está rodando?</p>}
      <div className="cards">
        {CARDS.map((c) => (
          <div key={c.chave} className="card">
            <div className="numero">{resumo ? resumo[c.chave] : '–'}</div>
            <div className="rotulo">{c.rotulo}</div>
          </div>
        ))}
      </div>
    </>
  );
}
