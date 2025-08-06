import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css" // Certifique-se de que este arquivo existe

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CRM 4 Temperamentos",
  description: "Sistema de CRM para análise de temperamentos e comportamento.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  )
}
