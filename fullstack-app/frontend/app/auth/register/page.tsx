"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { validateEmail, validatePassword, validateConfirmPassword, validateWhatsapp } from "@/lib/validation";
import { createUser, createAccount, checkUsername } from "@/lib/auth";
import Link from "next/link";

export default function RegistrationCard() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);

  const debouncedWhatsapp = useDebounce(whatsapp, 500);
  const debouncedUsername = useDebounce(username, 500);
  const debouncedEmail = useDebounce(email, 500);
  const debouncedPassword = useDebounce(password, 500);
  const debouncedConfirmPassword = useDebounce(confirmPassword, 500);

  useEffect(() => {
    setEmailError(validateEmail(debouncedEmail));
  }, [debouncedEmail]); 

  useEffect(() => {
    setPasswordError(validatePassword(debouncedPassword));
  }, [debouncedPassword]);

  useEffect(() => {
    setConfirmPasswordError(validateConfirmPassword(debouncedPassword, debouncedConfirmPassword));
  }, [debouncedPassword, debouncedConfirmPassword]);

  useEffect(() => {
    setWhatsappError(validateWhatsapp(debouncedWhatsapp));
  }, [debouncedWhatsapp]);

  useEffect(() => {
    if (!debouncedUsername) {
      setUsernameError(null)
      setUsernameAvailable(null)
      return
    }
    if (debouncedUsername.length < 4) {
      setUsernameError("Minimal 4 karakter")
      setUsernameAvailable(null)
      return
    }
    checkUsername(debouncedUsername).then((result) => {
      if (result.available) {
        setUsernameError(null)
        setUsernameAvailable(true)
      } else {
        setUsernameError(result.message ?? "Username sudah digunakan")
        setUsernameAvailable(false)
      }
    })
  }, [debouncedUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (emailError || passwordError || confirmPasswordError || usernameError || whatsappError) {
      setError("Perbaiki input yang salah sebelum mendaftar")
      return
    }
    if (!firstName || !whatsapp || !username || !email || !password || !confirmPassword) {
      setError("Lengkapi semua field yang wajib diisi")
      return
    }
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok")
      return
    }

    setIsSubmitting(true)
    try {
      const user = await createUser({
        first_name: firstName,
        last_name: lastName,
        whatsapp,
      })

      await createAccount({
        user_id: user.id,
        role_id: 2,
        email,
        username,
        password,
      })

      router.push("/auth/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register new account</CardTitle>
          <CardDescription>
            Enter your credentials below to create your account
          </CardDescription>
          <CardAction>
            <Button variant="link" asChild>
              <Link href="/auth/login">Log in</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit}>
        <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="first-name">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="whatsapp">
                  Whatsapp <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="whatsapp"
                  type="text"
                  placeholder="081234567890"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 12))}
                  required
                  className={whatsappError ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {whatsappError && (
                  <p className="text-xs font-medium text-destructive">{whatsappError}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="username">
                    Username <span className="text-destructive">*</span>
                  </Label>
                </div>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  required
                  className={usernameError ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {usernameError ? (
                  <p className="text-xs font-medium text-destructive">{usernameError}</p>
                ) : usernameAvailable && (
                  <p className="text-xs font-medium text-green-600">Username tersedia</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={emailError ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {emailError && (
                  <p className="text-xs font-medium text-destructive">{emailError}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">
                    Password <span className="text-destructive">*</span>
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={passwordError ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {passwordError && (
                  <p className="text-xs font-medium text-destructive">{passwordError}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirm-password">
                    Confirm Password <span className="text-destructive">*</span>
                  </Label>
                </div>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={confirmPasswordError ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {confirmPasswordError && (
                  <p className="text-xs font-medium text-destructive">{confirmPasswordError}</p>
                )}
              </div>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          {error && (
            <p className="w-full text-xs font-medium text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Mendaftarkan..." : "Register"}
          </Button>
        </CardFooter>
        </form>
      </Card>
    </div>
  )
}
