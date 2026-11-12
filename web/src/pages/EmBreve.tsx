export default function EmBreve({ titulo, fase }: { titulo: string; fase: string }) {
  return (
    <>
      <h1>{titulo}</h1>
      <p className="vazio">Esta tela será construída na {fase}.</p>
    </>
  );
}
