'use client'

import { useState } from 'react'
import AuthGuard from '@/components/AuthGuard'

export default function ProfilePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function updatePassword() {
    if (!email || !password) {
      alert('Email and new password required')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          newPassword: password,
        }),
      }) 

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to update password')
        return
      }

      alert('Password updated successfully')

      setEmail('')
      setPassword('')
    } catch (error) {
      console.error('Update password error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthGuard>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow w-full max-w-md">
          <h1 className="text-xl font-bold mb-4 text-center">
            Update Password
          </h1>

          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            className="border p-2 w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={updatePassword}
            disabled={loading}
            className="bg-black text-white w-full py-2"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </AuthGuard>
  )
}
