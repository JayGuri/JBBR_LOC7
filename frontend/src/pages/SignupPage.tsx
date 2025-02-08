"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppData } from "../contexts/AppDataContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const { signup } = useAppData()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = await signup(name, email, password)
    if (user) {
      setMessage("Signup successful! Redirecting to home page...")
      setTimeout(() => navigate("/"), 2000)
    } else {
      setMessage("Signup failed. User may already exist.")
    }
  }

  return (
    <div className="min-h-screen bg-[#e6f3ff] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#161A34]">Sign Up</h2>
        {message && <p className="mb-4 text-center text-[#161A34]">{message}</p>}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-[#161A34]">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-white border-[#161A34] focus:border-[#161A34] focus:ring-[#161A34] text-[#161A34]"
            />
          </div>
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
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  )
}

