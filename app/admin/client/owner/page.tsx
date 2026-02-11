'use client'

import { useEffect, useState } from 'react'

export default function ClientOwnerPage() {
  const [clients, setClients] = useState<any[]>([])
  const [owners, setOwners] = useState<any[]>([])
  const [search, setSearch] = useState('')

  const [clientId, setClientId] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')

  const [loading, setLoading] = useState(false)

  // ================= LOAD OWNERS =================
  async function loadOwners() {
    try {
      const res = await fetch('/api/client-owner')
      const data = await res.json()
      setOwners(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Load owners error:', err)
      setOwners([])
    }
  }

  // ================= SEARCH OWNERS =================
  async function searchOwners() {
    if (!search.trim()) {
      loadOwners()
      return
    }

    try {
      const res = await fetch(`/api/client-owner?q=${search}`)
      const data = await res.json()
      setOwners(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Search owners error:', err)
      setOwners([])
    }
  }

  // ================= LOAD CLIENTS =================
  async function loadClients() {
    try {
      const res = await fetch('/api/client')
      const data = await res.json()
      setClients(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Load clients error:', err)
      setClients([])
    }
  }

  // ================= ADD OWNER =================
  async function addOwner() {
    //  FRONTEND VALIDATION (MATCH BACKEND)
    if (!clientId || !ownerName || !email || !mobile) {
      alert('Client, Owner Name, Email and Mobile are required')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/client-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          ownerName,
          email,
          mobile,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Failed to add owner')
        setLoading(false)
        return
      }

      // reset form
      setClientId('')
      setOwnerName('')
      setEmail('')
      setMobile('')

      // reload list
      loadOwners()
    } catch (err) {
      console.error('Add owner error:', err)
      alert('Network error adding owner')
    } finally {
      setLoading(false)
    }
  }

  // ================= INITIAL LOAD =================
  useEffect(() => {
    loadClients()
    loadOwners()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Client Owners</h1>

      {/* ================= ADD OWNER FORM ================= */}
      <div className="bg-white p-6 border rounded mb-6 max-w-3xl">
        <h2 className="font-semibold mb-4">Add Client Owner</h2>

        {/* CLIENT */}
        <div className="mb-4">
          <label className="block mb-1">Client</label>
          <select
            className="border p-2 w-full"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.clientName || c.ClientName || '-'}
              </option>
            ))}
          </select>
        </div>

        {/* OWNER NAME */}
        <div className="mb-4">
          <label className="block mb-1">Owner Name</label>
          <input
            className="border p-2 w-full"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            className="border p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* MOBILE */}
        <div className="mb-6">
          <label className="block mb-1">Mobile</label>
          <input
            className="border p-2 w-full"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        <button
          onClick={addOwner}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Add Owner'}
        </button>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="flex gap-2 mb-4">
        <input
          placeholder="Search Owner / Email / Mobile / Client"
          className="border p-2 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={searchOwners}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
        <button
          onClick={() => {
            setSearch('')
            loadOwners()
          }}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <table className="w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Client</th>
            <th className="border p-2">Owner Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Mobile</th>
          </tr>
        </thead>
        <tbody>
          {owners.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No owners found
              </td>
            </tr>
          ) : (
            owners.map((o, i) => (
              <tr key={o._id}>
                <td className="border p-2">{i + 1}</td>

                {/*  CLIENT NAME SAVED IN BACKEND */}
                <td className="border p-2">
                  {o.clientName || '-'}
                </td>

                <td className="border p-2">{o.ownerName}</td>
                <td className="border p-2">{o.email || 'None'}</td>
                <td className="border p-2">{o.mobile || 'None'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
