"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppData } from "../contexts/AppDataContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAppData()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = await login(email, password)
    if (user) {
      navigate("/")
    } else {
      alert("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen bg-[#e6f3ff] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#161A34]">Login</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-[#161A34]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white border-[#161A34] focus:border-[#161A34] focus:ring-[#161A34] text-[#161A34]"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-[#161A34]">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white border-[#161A34] focus:border-[#161A34] focus:ring-[#161A34] text-[#161A34]"
            />
          </div>
          <Button type="submit" className="w-full bg-[#161A34] hover:bg-[#161A34]/90 text-white">
            Login
          </Button>
        </div>
      </form>
    </div>
  )
}
