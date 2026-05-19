const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function checkUsername(username: string) {
  if (username.length < 4) return { available: false, message: "Minimal 4 karakter" }

  try {
    const res = await fetch(`${API_URL}/accounts/check-username/${username}`)
    if (!res.ok) return { available: true }
    const body = await res.json()
    return body as { available: boolean }
  } catch {
    return { available: true }
  }
}

export async function createUser(data: {
  first_name: string
  last_name: string
  whatsapp: string
}) {
  const res = await fetch(`${API_URL}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const body = await res.json()
  if (!res.ok) throw new Error(body.detail ?? "Gagal membuat user")
  return body as { id: number; first_name: string; last_name: string; whatsapp: string }
}

export async function createAccount(data: {
  user_id: number
  role_id: number
  email: string
  username: string
  password: string
}) {
  const res = await fetch(`${API_URL}/accounts/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const body = await res.json()
  if (!res.ok) throw new Error(body.detail ?? "Gagal membuat akun")
  return body
}

export async function loginUser(data: {
  email: string
  password: string
}) {
  const res = await fetch(`${API_URL}/accounts/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const body = await res.json()
  if (!res.ok) throw new Error(body.detail ?? "Email atau password salah")
  return body as { access_token: string; token_type: string }
}

