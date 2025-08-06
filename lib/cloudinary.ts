export const runtime = 'nodejs'

interface CloudinaryUploadResponse {
  public_id: string
  version: number
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: string[]
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  access_mode: string
  original_filename: string
}

export async function uploadToCloudinary(
  file: File,
  folder = "facial-analysis",
  publicId?: string,
): Promise<CloudinaryUploadResponse> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Credenciais do Cloudinary não configuradas")
  }

  // Converter arquivo para base64
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64 = buffer.toString("base64")
  const dataURI = `data:${file.type};base64,${base64}`

  // Criar assinatura para upload seguro
  const timestamp = Math.round(new Date().getTime() / 1000)
  const paramsToSign = {
    timestamp: timestamp,
    folder: folder,
    ...(publicId && { public_id: publicId }),
  }

  // Criar string para assinatura
  const sortedParams = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key as keyof typeof paramsToSign]}`)
    .join("&")

  // Gerar assinatura SHA1
  const crypto = require("crypto")
  const signature = crypto
    .createHash("sha1")
    .update(sortedParams + apiSecret)
    .digest("hex")

  // Preparar dados do formulário
  const formData = new FormData()
  formData.append("file", dataURI)
  formData.append("api_key", apiKey)
  formData.append("timestamp", timestamp.toString())
  formData.append("signature", signature)
  formData.append("folder", folder)
  if (publicId) {
    formData.append("public_id", publicId)
  }

  // Fazer upload para Cloudinary
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Erro no upload para Cloudinary: ${response.status} - ${errorText}`)
  }

  const result: CloudinaryUploadResponse = await response.json()
  return result
}

export function generateCloudinaryUrl(publicId: string, transformations?: string): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  if (!cloudName) {
    throw new Error("CLOUDINARY_CLOUD_NAME não configurado")
  }

  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`
  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`
  }
  return `${baseUrl}/${publicId}`
}
