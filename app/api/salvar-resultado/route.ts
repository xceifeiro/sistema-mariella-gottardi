import { NextResponse } from 'next/server';
import sql from '@/lib/db';

type Scores = {
  sanguineo: number;
  colerico: number;
  melancolico: number;
  fleumatico: number;
};

type RequestBody = {
  usuarioId: string;
  pedidoId: string;
  scores: Scores;
};

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const { usuarioId, pedidoId, scores } = body;

    if (!usuarioId || !pedidoId || !scores) {
      return NextResponse.json(
        { message: 'Dados incompletos. usuarioId, pedidoId e scores são obrigatórios.' },
        { status: 400 }
      );
    }

    const result = await sql.begin(async (transactionSql) => {
      // 1. Verifica se o serviço existe
      const servicoSlug = 'teste-temperamentos';
      const servicos = await transactionSql`
        SELECT id FROM servicos WHERE slug = ${servicoSlug} AND ativo = true
      `;
      if (servicos.length === 0) {
        throw new Error(`Serviço com slug "${servicoSlug}" não encontrado ou inativo.`);
      }
      const servicoId = servicos[0].id;

      // 2. Valida se o usuário existe
      const usuarios = await transactionSql`
        SELECT id FROM usuarios WHERE id = ${usuarioId}
      `;
      if (usuarios.length === 0) {
        throw new Error(`Usuário com ID ${usuarioId} não encontrado.`);
      }

      // 3. Garante que existe na tabela de clientes
      await transactionSql`
        INSERT INTO clientes (id)
        VALUES (${usuarioId})
        ON CONFLICT (id) DO NOTHING
      `;

      // 4. Insere o resultado do teste
      await transactionSql`
        INSERT INTO resultados_testes (
          pedido_id,
          tipo_teste,
          resultado,
          status
        )
        VALUES (
          ${pedidoId},
          'teste-temperamentos',
          ${sql.json(scores)},
          'concluido'
        )
      `;

      // ✅ 5. Atualiza o status do pedido para "concluido"
      await transactionSql`
        UPDATE pedidos
        SET status = 'concluido',
            atualizado_em = timezone('utc', now())
        WHERE id = ${pedidoId}
      `;

      return { usuarioId };
    });

    return NextResponse.json(
      { message: 'Resultado salvo com sucesso!', usuarioId: result.usuarioId },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Erro ao salvar o resultado:', error);
    return NextResponse.json(
      { message: `Erro ao salvar o resultado: ${error.message || 'Erro desconhecido.'}` },
      { status: 500 }
    );
  }
}
