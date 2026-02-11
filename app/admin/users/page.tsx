'use client'

import { useEffect, useState } from 'react'

export default function UsersPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // ================= FETCH USERS =================
  async function fetchUsers() {
    try {
      const res = await fetch('/api/users', { cache: 'no-store' })

      if (!res.ok) {
        setUsers([])
        return
      }

      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Fetch users error:', error)
      setUsers([])
    }
  }

  // ================= ADD USER =================
  async function addUser() {
    if (!username || !email || !contact || !password) {
      alert('All fields are required')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          contact,
          password,
        }),
      })

        if (!res.ok) {
        const data = await res.json()

        //  SHOW BACKEND ERROR MESSAGE
        alert(data.error || 'Failed to add user')
          return
      }


      // clear form
      setUsername('')
      setEmail('')
      setContact('')
      setPassword('')

      await fetchUsers()
    } catch (error) {
      console.error('Add user error:', error)
    } finally {
      setLoading(false)
    }
  }

  // ================= LOAD ON PAGE OPEN =================
  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {/* ========== ADD USER FORM ========== */}
      <div className="bg-white p-4 mb-8 border rounded">
        <div className="grid grid-cols-4 gap-3">
          <input
            className="border p-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="border p-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border p-2"
            placeholder="Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />

          <input
            type="password"
            className="border p-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={addUser}
          disabled={loading}
          className="mt-4 bg-black text-white px-4 py-2"
        >
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </div>

      {/* ========== USERS TABLE ========== */}
      <table className="w-full border bg-white text-sm">
        <thead>
          <tr>
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Contact</th>
            <th className="border p-2">Password</th>
            <th className="border p-2">Created At</th>
            <th className="border p-2">Updated At</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td className="border p-2">{user.username}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.contact}</td>
                <td className="border p-2">
                  {'•'.repeat(user.passwordLength || 0)}
                </td>
                <td className="border p-2">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
                <td className="border p-2">
                  {new Date(user.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
