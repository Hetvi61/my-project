'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function login() {
    if (!email || !password) {
      alert('Email and password required')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Invalid credentials')
        return
      }

      //  LOGIN SUCCESS
      // cookie is already set by backend (httpOnly)
      localStorage.setItem('admin-auth', 'true')
      router.push('/admin')

    } catch (error) {
      console.error('Login error:', error)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-80 space-y-4">
        <h1 className="text-xl font-bold text-center">Admin Login</h1>

        <Input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="w-full" onClick={login} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </div>
  )
}
