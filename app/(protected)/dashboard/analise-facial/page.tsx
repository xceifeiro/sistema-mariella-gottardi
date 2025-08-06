import { getSession } from "@/lib/auth"
import sql from "@/lib/db"
import { redirect } from "next/navigation"
import FacialAnalysisForm from "./facial-analysis-form"

export default async function AnalyseFacialPage() {
  const session = await getSession()

  if (!session || session.tipo_usuario !== "cliente") {
    redirect("/login")
  }

  // Verificar se o cliente tem o serviço de Análise Facial contratado
  const pedidos = await sql`
    SELECT p.*, s.nome as servico_nome 
    FROM pedidos p
    JOIN servicos s ON p.servico_id = s.id
    WHERE p.cliente_id = ${session.sub} 
    AND s.nome = 'Análise Facial'
    ORDER BY p.id DESC
    LIMIT 1
  `

  if (pedidos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-6">
            Você precisa contratar o serviço de <strong>Análise Facial</strong> para acessar esta página.
          </p>
          <a
            href="/dashboard/servicos"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver Serviços Disponíveis
          </a>
        </div>
      </div>
    )
  }

  const pedido = pedidos[0]

  // Verificar se já enviou as imagens
  if (pedido.url_perfil_normal && pedido.url_perfil_sorrindo && pedido.url_perfil_lado && pedido.url_boca_sorrindo) {
    // Verificar se o resultado está concluído
    const resultadoConcluido = await sql`
      SELECT r.*, p.data_envio_imagens
      FROM resultados_testes r
      JOIN pedidos p ON r.pedido_id = p.id
      WHERE r.pedido_id = ${pedido.id}
      AND r.status = 'concluido'
      LIMIT 1
    `

    if (resultadoConcluido.length > 0) {
      const resultado = resultadoConcluido[0]
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%239C92AC fillOpacity=0.1%3E%3Ccircle cx=30 cy=30 r=4/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

          <div className="relative max-w-4xl mx-auto">
            <div className="glass-card p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-6 animate-float">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-slate-100 mb-4">✅ Análise Concluída!</h1>
                <p className="text-slate-300 max-w-2xl mx-auto mb-6">
                  Sua análise facial foi concluída com sucesso! Você pode visualizar os resultados detalhados agora.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="glass-card p-4">
                    <div className="text-2xl mb-2">📅</div>
                    <div className="text-sm text-slate-400">Enviado em</div>
                    <div className="text-slate-200 font-medium">
                      {new Date(pedido.data_envio_imagens).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <div className="glass-card p-4">
                    <div className="text-2xl mb-2">⏱️</div>
                    <div className="text-sm text-slate-400">Concluído em</div>
                    <div className="text-slate-200 font-medium">
                      {new Date(resultado.data_conclusao).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <div className="glass-card p-4">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-sm text-slate-400">Status</div>
                    <div className="text-green-400 font-medium">Concluído</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 mb-8">
                <div className="flex items-center mb-4">
                  <div className="text-green-400 mr-3 text-2xl">🎉</div>
                  <div>
                    <h3 className="font-semibold text-green-300 text-lg">Resultado Disponível</h3>
                    <p className="text-green-200/80 text-sm">
                      Sua análise facial detalhada está pronta para visualização
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`/dashboard/resultados/${resultado.id}`}
                  className="glass-button bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Ver Resultado Completo
                </a>

                <a
                  href="/dashboard"
                  className="glass-button bg-slate-600/20 text-slate-300 px-6 py-4 rounded-xl font-medium hover:bg-slate-600/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Voltar ao Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-600 to-slate-700 0 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg shadow-md p-10">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-gray-200 mb-2">Imagens Já Enviadas</h1>
              <p className="text-gray-400">
                Suas imagens foram enviadas em{" "}
                {new Date(pedido.data_envio_imagens).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-200">Imagens Enviadas:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <img
                      src={pedido.url_perfil_normal || "/placeholder.svg"}
                      alt="Perfil Normal"
                      className="w-50 h-37 object-cover rounded-lg border"
                    />
                    <p className="text-xs text-gray-300 mt-1">Perfil Normal</p>
                  </div>
                  <div className="text-center">
                    <img
                      src={pedido.url_perfil_sorrindo || "/placeholder.svg"}
                      alt="Perfil Sorrindo"
                      className="w-50 h-37 object-cover rounded-lg border"
                    />
                    <p className="text-xs text-gray-300 mt-1">Perfil Sorrindo</p>
                  </div>
                  <div className="text-center">
                    <img
                      src={pedido.url_perfil_lado || "/placeholder.svg"}
                      alt="Perfil de Lado"
                      className="w-50 h-37 object-cover rounded-lg border"
                    />
                    <p className="text-xs text-gray-300 mt-1">Perfil de Lado</p>
                  </div>
                  <div className="text-center">
                    <img
                      src={pedido.url_boca_sorrindo || "/placeholder.svg"}
                      alt="Boca Sorrindo"
                      className="w-50 h-37 object-cover rounded-lg border"
                    />
                    <p className="text-xs text-gray-300 mt-1">Boca Sorrindo</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-200">Status do Pedido:</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="text-yellow-600 mr-2">⏳</div>
                    <div>
                      <p className="font-medium text-yellow-800">Em Andamento</p>
                      <p className="text-sm text-yellow-700">
                        Sua análise está sendo processada e ficará pronta em até 48 horas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/dashboard"
                className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Voltar ao Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r to-slate-700 from-purple-600 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg shadow-md p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-200 mb-4">Análise Facial</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Para realizar sua análise facial, precisamos de 4 fotos específicas. Siga as instruções abaixo para obter
              os melhores resultados.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <img
              src="/foto-exemplo.jpeg" // substitua pelo caminho real da sua imagem
              alt="Exemplo de foto ideal"
              className="w-full rounded-md mb-4"
            />
            <h2 className="text-lg font-semibold text-blue-900 mb-4">📋 Instruções Importantes:</h2>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">💡</span>
                <span>Tire as fotos em um local bem iluminado (luz natural é ideal)</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">📱</span>
                <span>Use a câmera frontal do celular ou webcam do computador</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">👤</span>
                <span>Mantenha o rosto centralizado e bem visível</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">🚫</span>
                <span>Evite óculos escuros, chapéus ou acessórios que cubram o rosto</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">🚫</span>
                <span>Fundo com parede branca</span>
              </li>
            </ul>
          </div>


          <FacialAnalysisForm pedidoId={pedido.id.toString()} />
        </div>
      </div>
    </div>
  )
}
