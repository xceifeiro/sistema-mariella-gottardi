"use client"

import { useState, useEffect } from "react"
import { Download, Share2, FileText, User, Calendar, Clock } from "lucide-react"
import { toast } from "sonner"

interface FacialAnalysisResultProps {
  htmlContent: string
  imagens?: Record<string, string> | null
  clienteNome: string
  dataRealizacao: string
  observacoes?: string
}

export default function FacialAnalysisResultComponent({
  htmlContent,
  imagens,
  clienteNome,
  dataRealizacao,
  observacoes,
}: FacialAnalysisResultProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [processedHtml, setProcessedHtml] = useState("")

  useEffect(() => {
    // Processar o HTML para garantir compatibilidade com tema escuro
    const processed = htmlContent
      // Remover classes de container que podem conflitar
      .replace(/class="max-w-4xl mx-auto bg-white[^"]*"/g, 'class="analysis-container"')
      // Converter títulos principais
      .replace(/class="text-3xl font-bold[^"]*"/g, 'class="analysis-title"')
      .replace(/class="text-2xl font-semibold[^"]*"/g, 'class="section-title"')
      .replace(/class="text-xl font-semibold[^"]*"/g, 'class="subsection-title"')
      .replace(/class="text-lg font-bold[^"]*"/g, 'class="feature-title"')
      // Converter parágrafos
      .replace(/class="text-gray-700 italic[^"]*"/g, 'class="intro-text"')
      .replace(/class="text-gray-700[^"]*"/g, 'class="analysis-text"')
      .replace(/class="text-gray-600[^"]*"/g, 'class="muted-text"')
      .replace(/class="text-gray-800[^"]*"/g, 'class="analysis-text"')
      // Converter cards de síntese
      .replace(/class="mt-6 p-4 bg-blue-50[^"]*"/g, 'class="synthesis-card"')
      .replace(/class="mt-3 p-4 bg-yellow-50[^"]*"/g, 'class="identity-phrase"')
      .replace(/class="mt-3 p-4 bg-blue-100[^"]*"/g, 'class="identity-phrase"')
      // Converter grids
      .replace(/class="grid grid-cols-2[^"]*"/g, 'class="two-column-grid"')
      .replace(/class="flex flex-wrap[^"]*"/g, 'class="temperament-grid"')
      // Converter cards de potências/pontos
      .replace(/class="shadow-lg rounded-lg p-4 bg-green-50[^"]*"/g, 'class="positive-card"')
      .replace(/class="shadow-lg rounded-lg p-4 bg-red-50[^"]*"/g, 'class="attention-card"')
      // Converter temperamentos
      .replace(/class="inline-block bg-green-200[^"]*"/g, 'class="temperament-melancholic"')
      .replace(/class="inline-block bg-yellow-200[^"]*"/g, 'class="temperament-sanguine"')
      .replace(/class="inline-block bg-blue-200[^"]*"/g, 'class="temperament-phlegmatic"')
      .replace(/class="inline-block bg-red-200[^"]*"/g, 'class="temperament-choleric"')
      .replace(/class="bg-green-200[^"]*"/g, 'class="temperament-melancholic"')
      .replace(/class="bg-yellow-200[^"]*"/g, 'class="temperament-sanguine"')
      .replace(/class="bg-blue-200[^"]*"/g, 'class="temperament-phlegmatic"')
      .replace(/class="bg-red-200[^"]*"/g, 'class="temperament-choleric"')
      // Converter títulos de cards
      .replace(/class="font-semibold text-blue-900[^"]*"/g, 'class="info-title"')
      .replace(/class="font-semibold text-green-900[^"]*"/g, 'class="positive-title"')
      .replace(/class="font-semibold text-green-800[^"]*"/g, 'class="positive-title"')
      .replace(/class="font-semibold text-red-900[^"]*"/g, 'class="warning-title"')
      .replace(/class="font-semibold text-red-800[^"]*"/g, 'class="warning-title"')
      .replace(/class="font-semibold text-yellow-900[^"]*"/g, 'class="attention-title"')
      // Converter listas
      .replace(/class="list-disc list-inside[^"]*"/g, 'class="analysis-list"')
      // Converter tabelas
      .replace(/class="w-full text-sm text-left text-gray-700 border[^"]*"/g, 'class="analysis-table"')
      // Converter spans de ênfase
      .replace(/class="font-semibold[^"]*"/g, 'class="emphasis-text"')
      .replace(/class="text-blue-700[^"]*"/g, 'class="visual-style"')
      .replace(/class="text-blue-900[^"]*"/g, 'class="archetype-name"')
      // Limpar classes restantes que podem conflitar
      .replace(/class="[^"]*text-gray-[^"]*"/g, 'class="analysis-text"')
      .replace(/class="[^"]*bg-white[^"]*"/g, 'class="analysis-container"')

    setProcessedHtml(processed)
  }, [htmlContent])

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      const { jsPDF } = await import("jspdf")
      const html2canvas = (await import("html2canvas")).default

      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
            <h1 style="color: #333; margin-bottom: 10px;">Análise Facial - CRM 4 Temperamentos</h1>
            <p style="color: #666; font-size: 16px;">Cliente: ${clienteNome}</p>
            <p style="color: #666; font-size: 14px;">Data: ${dataRealizacao}</p>
          </div>
          <div style="line-height: 1.6; color: #333;">
            ${htmlContent}
          </div>
          ${
            observacoes
              ? `
            <div style="margin-top: 30px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #007bff;">
              <h3 style="margin-top: 0; color: #333;">Observações do Especialista</h3>
              <p style="margin-bottom: 0; color: #666;">${observacoes}</p>
            </div>
          `
              : ""
          }
          <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #ddd; padding-top: 20px;">
            <p>Relatório gerado automaticamente pelo CRM 4 Temperamentos</p>
            <p>© ${new Date().getFullYear()} - Todos os direitos reservados</p>
          </div>
        </div>
      `
      tempDiv.style.position = "absolute"
      tempDiv.style.left = "-9999px"
      tempDiv.style.top = "0"
      tempDiv.style.width = "800px"
      tempDiv.style.backgroundColor = "white"
      document.body.appendChild(tempDiv)

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      document.body.removeChild(tempDiv)

      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      const fileName = `analise-facial-${clienteNome.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`
      pdf.save(fileName)

      toast.success("PDF gerado com sucesso!")
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      toast.error("Erro ao gerar PDF. Tente novamente.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Análise Facial - ${clienteNome}`,
          text: `Confira a análise facial realizada para ${clienteNome}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Erro ao compartilhar:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copiado para a área de transferência!")
    }
  }

  return (
    <div className="facial-analysis-wrapper">
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0f172a",
          padding: "2rem",
          color: "#f1f5f9",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Header */}
          <div
            style={{
              background: "rgba(30, 41, 59, 0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: "1.5rem",
              padding: "2rem",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", margin: "0 0 0.5rem 0", color: "#f1f5f9" }}>
                  📋 Análise de Temperamento Facial
                </h1>
                <p style={{ color: "#cbd5e1", fontSize: "1.125rem", margin: 0 }}>
                  Relatório detalhado baseado em características faciais identificadas
                </p>
              </div>

              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <User style={{ width: "1.25rem", height: "1.25rem", color: "#60a5fa" }} />
                  <span style={{ fontWeight: "600", color: "#f1f5f9" }}>{clienteNome}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Calendar style={{ width: "1.25rem", height: "1.25rem", color: "#4ade80" }} />
                  <span style={{ color: "#e2e8f0" }}>{dataRealizacao}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Clock style={{ width: "1.25rem", height: "1.25rem", color: "#a855f7" }} />
                  <span
                    style={{
                      backgroundColor: "rgba(34, 197, 94, 0.2)",
                      color: "#4ade80",
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    Concluído
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1rem" }}>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="download-button"
                  style={{
                    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                    color: "white",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.5rem",
                    fontWeight: "500",
                    cursor: isGeneratingPDF ? "not-allowed" : "pointer",
                    opacity: isGeneratingPDF ? 0.7 : 1,
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.875rem",
                  }}
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="spinner" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Download style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
                      Baixar PDF
                    </>
                  )}
                </button>
                <button
                  onClick={handleShare}
                  style={{
                    background: "rgba(51, 65, 85, 0.6)",
                    backdropFilter: "blur(10px)",
                    color: "#f1f5f9",
                    border: "1px solid rgba(148, 163, 184, 0.3)",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.5rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.875rem",
                  }}
                >
                  <Share2 style={{ width: "1rem", height: "1rem", marginRight: "0.5rem" }} />
                  Compartilhar
                </button>
              </div>
            </div>
          </div>

          {/* Conteúdo da Análise */}
          <div
            style={{
              background: "rgba(30, 41, 59, 0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: "1rem",
              padding: "2rem",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <FileText style={{ width: "1.5rem", height: "1.5rem", color: "#4ade80" }} />
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0, color: "#f1f5f9" }}>
                  Resultado da Análise
                </h2>
              </div>
              <p style={{ color: "#cbd5e1", margin: 0 }}>
                Análise detalhada baseada nas características faciais identificadas
              </p>
            </div>

            {/* Renderizar HTML processado com classes CSS aplicadas */}
            <div
              style={{
                background: "rgba(51, 65, 85, 0.6)",
                backdropFilter: "blur(10px)",
                padding: "2rem",
                borderRadius: "0.75rem",
                border: "2px solid rgba(148, 163, 184, 0.3)",
              }}
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />
          </div>

          {/* Observações do Especialista */}
          {observacoes && (
            <div
              style={{
                background: "rgba(30, 41, 59, 0.8)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                borderRadius: "1rem",
                padding: "1.5rem",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  margin: "0 0 1rem 0",
                  color: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <User style={{ width: "1.25rem", height: "1.25rem", color: "#60a5fa" }} />
                Observações do Especialista
              </h2>

              <div
                style={{
                  background: "rgba(51, 65, 85, 0.6)",
                  backdropFilter: "blur(10px)",
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  border: "1px solid rgba(148, 163, 184, 0.3)",
                }}
              >
                <p style={{ color: "#e2e8f0", lineHeight: "1.6", margin: 0 }}>{observacoes}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ textAlign: "center", paddingTop: "2rem", paddingBottom: "2rem" }}>
            <div
              style={{
                background: "rgba(30, 41, 59, 0.8)",
                backdropFilter: "blur(20px)",
                padding: "1.5rem",
                borderRadius: "1rem",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                display: "inline-block",
              }}
            >
              <p style={{ color: "#cbd5e1", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                <strong style={{ color: "#f1f5f9" }}>CRM 4 Temperamentos</strong> - Sistema de Análise Facial
              </p>
              <p style={{ color: "#94a3b8", fontSize: "0.75rem", margin: 0 }}>
                Análise realizada por especialistas qualificados • Relatório gerado em{" "}
                {new Date().toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .facial-analysis-wrapper {
          /* Importar CSS específico */
        }

        .facial-analysis-wrapper :global(.analysis-container) {
          background: rgba(51, 65, 85, 0.6) !important;
          backdrop-filter: blur(10px) !important;
          border: 2px solid rgba(148, 163, 184, 0.3) !important;
          border-radius: 1rem !important;
          padding: 2rem !important;
          margin: 0 !important;
          max-width: 100% !important;
          color: #f1f5f9 !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
        }

        .facial-analysis-wrapper :global(.analysis-title) {
          font-size: 2.5rem !important;
          font-weight: bold !important;
          color: #f1f5f9 !important;
          margin: 0 0 1.5rem 0 !important;
          text-align: center !important;
          background: linear-gradient(135deg, #60a5fa 0%, #a855f7 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }

        .facial-analysis-wrapper :global(.section-title) {
          font-size: 2rem !important;
          font-weight: 600 !important;
          color: #60a5fa !important;
          margin: 2rem 0 1rem 0 !important;
          border-bottom: 2px solid rgba(96, 165, 250, 0.3) !important;
          padding-bottom: 0.5rem !important;
        }

        .facial-analysis-wrapper :global(.subsection-title) {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          color: #4ade80 !important;
          margin: 1.5rem 0 0.75rem 0 !important;
        }

        .facial-analysis-wrapper :global(.feature-title) {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          color: #f1f5f9 !important;
          margin: 1rem 0 0.5rem 0 !important;
        }

        .facial-analysis-wrapper :global(.analysis-text) {
          color: #e2e8f0 !important;
          line-height: 1.6 !important;
          margin: 0.5rem 0 !important;
        }

        .facial-analysis-wrapper :global(.intro-text) {
          color: #cbd5e1 !important;
          font-style: italic !important;
          line-height: 1.6 !important;
          margin: 0.75rem 0 !important;
        }

        .facial-analysis-wrapper :global(.muted-text) {
          color: #94a3b8 !important;
          font-size: 0.9rem !important;
          line-height: 1.5 !important;
          margin: 0.5rem 0 !important;
        }

        .facial-analysis-wrapper :global(.emphasis-text) {
          color: #f1f5f9 !important;
          font-weight: 600 !important;
        }

        .facial-analysis-wrapper :global(.temperament-sanguine) {
          background: rgba(251, 191, 36, 0.2) !important;
          color: #fbbf24 !important;
          border: 1px solid rgba(251, 191, 36, 0.4) !important;
          padding: 0.25rem 0.75rem !important;
          border-radius: 9999px !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          display: inline-block !important;
          margin: 0.25rem !important;
        }

        .facial-analysis-wrapper :global(.temperament-choleric) {
          background: rgba(239, 68, 68, 0.2) !important;
          color: #ef4444 !important;
          border: 1px solid rgba(239, 68, 68, 0.4) !important;
          padding: 0.25rem 0.75rem !important;
          border-radius: 9999px !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          display: inline-block !important;
          margin: 0.25rem !important;
        }

        .facial-analysis-wrapper :global(.temperament-melancholic) {
          background: rgba(34, 197, 94, 0.2) !important;
          color: #22c55e !important;
          border: 1px solid rgba(34, 197, 94, 0.4) !important;
          padding: 0.25rem 0.75rem !important;
          border-radius: 9999px !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          display: inline-block !important;
          margin: 0.25rem !important;
        }

        .facial-analysis-wrapper :global(.temperament-phlegmatic) {
          background: rgba(59, 130, 246, 0.2) !important;
          color: #3b82f6 !important;
          border: 1px solid rgba(59, 130, 246, 0.4) !important;
          padding: 0.25rem 0.75rem !important;
          border-radius: 9999px !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          display: inline-block !important;
          margin: 0.25rem !important;
        }

        .facial-analysis-wrapper :global(.synthesis-card) {
          background: rgba(30, 41, 59, 0.8) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(59, 130, 246, 0.3) !important;
          border-radius: 0.75rem !important;
          padding: 1.5rem !important;
          margin: 1.5rem 0 !important;
        }

        .facial-analysis-wrapper :global(.identity-phrase) {
          background: rgba(168, 85, 247, 0.1) !important;
          border: 1px solid rgba(168, 85, 247, 0.3) !important;
          border-left: 4px solid #a855f7 !important;
          border-radius: 0.5rem !important;
          padding: 1rem !important;
          margin: 1rem 0 !important;
        }

        .facial-analysis-wrapper :global(.positive-card) {
          background: rgba(34, 197, 94, 0.1) !important;
          border: 1px solid rgba(34, 197, 94, 0.3) !important;
          border-radius: 0.75rem !important;
          padding: 1.5rem !important;
          margin: 1rem 0 !important;
        }

        .facial-analysis-wrapper :global(.attention-card) {
          background: rgba(239, 68, 68, 0.1) !important;
          border: 1px solid rgba(239, 68, 68, 0.3) !important;
          border-radius: 0.75rem !important;
          padding: 1.5rem !important;
          margin: 1rem 0 !important;
        }

        .facial-analysis-wrapper :global(.two-column-grid) {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
          gap: 1.5rem !important;
          margin: 1rem 0 !important;
        }

        .facial-analysis-wrapper :global(.temperament-grid) {
          display: flex !important;
          flex-wrap: wrap !important;
          gap: 0.5rem !important;
          margin: 0.75rem 0 !important;
        }

        .facial-analysis-wrapper :global(.analysis-list) {
          list-style: disc !important;
          list-style-position: inside !important;
          color: #e2e8f0 !important;
          margin: 0.5rem 0 !important;
          padding-left: 1rem !important;
        }

        .facial-analysis-wrapper :global(.analysis-list li) {
          margin: 0.25rem 0 !important;
          color: #e2e8f0 !important;
        }

        .facial-analysis-wrapper :global(.analysis-table) {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 1rem 0 !important;
          background: rgba(51, 65, 85, 0.6) !important;
          border-radius: 0.5rem !important;
          overflow: hidden !important;
        }

        .facial-analysis-wrapper :global(.analysis-table th),
        .facial-analysis-wrapper :global(.analysis-table td) {
          border: 1px solid rgba(148, 163, 184, 0.3) !important;
          padding: 0.75rem !important;
          text-align: left !important;
          color: #e2e8f0 !important;
        }

        .facial-analysis-wrapper :global(.analysis-table th) {
          background: rgba(30, 41, 59, 0.8) !important;
          font-weight: 600 !important;
          color: #f1f5f9 !important;
        }

        .facial-analysis-wrapper :global(.info-title) {
          color: #60a5fa !important;
          font-weight: 600 !important;
          margin: 0.5rem 0 !important;
        }

        .facial-analysis-wrapper :global(.positive-title) {
          color: #22c55e !important;
          font-weight: 600 !important;
          margin: 0.5rem 0 !important;
        }

        .facial-analysis-wrapper :global(.warning-title) {
          color: #ef4444 !important;
          font-weight: 600 !important;
          margin: 0.5rem 0 !important;
        }

        .facial-analysis-wrapper :global(.attention-title) {
          color: #fbbf24 !important;
          font-weight: 600 !important;
          margin: 0.5rem 0 !important;
        }

        .facial-analysis-wrapper :global(.visual-style) {
          color: #a855f7 !important;
          font-weight: 500 !important;
        }

        .facial-analysis-wrapper :global(.archetype-name) {
          color: #60a5fa !important;
          font-weight: 600 !important;
        }

        .spinner {
          width: 1rem;
          height: 1rem;
          margin-right: 0.5rem;
          border: 2px solid white;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .facial-analysis-wrapper :global(.analysis-title) {
            font-size: 2rem !important;
          }
          
          .facial-analysis-wrapper :global(.section-title) {
            font-size: 1.5rem !important;
          }
          
          .facial-analysis-wrapper :global(.two-column-grid) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
