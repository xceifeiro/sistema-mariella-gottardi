import { redirect } from 'next/navigation';
import sql from '@/lib/db';
import TesteDeTemperamento from '@/components/temperament-test';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function PaginaTesteTemperamentos() {
  const session = await getSession();
  if (!session?.sub) redirect('/login');

  const usuarioId = session.sub;

  // Verifica se há pedido válido
  const pedidos = await sql`
    SELECT p.id
    FROM pedidos p
    JOIN servicos s ON p.servico_id = s.id
    WHERE p.cliente_id = ${usuarioId}
      AND s.slug = 'teste-temperamentos'
      AND p.status = 'pendente'
    ORDER BY p.data_pedido DESC
    LIMIT 1
  `;

  const pedidoValido = pedidos[0];

  if (!pedidoValido) {
    redirect('/dashboard/');
  }

  // ✅ Só consulta resultados se existe pedido válido
  const testeJaFeito = await sql`
    SELECT id FROM resultados_testes WHERE pedido_id = ${pedidoValido.id}
  `;

  if (testeJaFeito.length > 0) {
    console.log("Teste Realizado");
    redirect('/dashboard/resultados');
    
  }

  return (
    <TesteDeTemperamento pedidoId={pedidoValido.id} usuarioId={usuarioId} />
  );
}
