'use client'

import { useEffect, useState } from 'react'

export default function ClientLogoPage() {
  const [clients, setClients] = useState<any[]>([])
  const [logos, setLogos] = useState<any[]>([])

  const [clientId, setClientId] = useState('')
  const [logoName, setLogoName] = useState('')

  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const [editId, setEditId] = useState<string | null>(null)

  // ================= LOAD DATA =================
  async function load() {
    const c = await fetch('/api/client').then(r => r.json())
    const l = await fetch('/api/client-logo').then(r => r.json())

    setClients(Array.isArray(c) ? c : [])
    setLogos(Array.isArray(l) ? l : [])
  }

  useEffect(() => {
    load()
  }, [])

  // ================= SAVE / UPDATE =================
  async function saveLogo() {
    if (!clientId || !logoName) {
      alert('Client and Logo Name required')
      return
    }

    if (!editId && files.length === 0) {
      alert('Please select at least one logo image')
      return
    }

    const formData = new FormData()
    formData.append('clientId', clientId)
    formData.append('logoName', logoName)

    if (editId) {
      formData.append('id', editId)
      if (files[0]) formData.append('file', files[0])
    } else {
      files.forEach(f => formData.append('files', f))
    }

    const res = await fetch('/api/client-logo', {
      method: editId ? 'PUT' : 'POST',
      body: formData,
    })

    let data
    try {
      data = await res.json()
    } catch {
      return alert('Server error')
    }

    if (!res.ok) return alert(data.error || 'Failed')

    resetForm()
    load()
  }

  function resetForm() {
    setClientId('')
    setLogoName('')
    setFiles([])
    setPreviews([])
    setEditId(null)
  }

  // ================= EDIT =================
  function editLogo(l: any) {
    setEditId(l._id)
    setClientId(l.clientId)
    setLogoName(l.logoName)
    setFiles([])
    setPreviews([l.logoUrl])
  }

  // ================= DELETE =================
  async function deleteLogo(id: string) {
    if (!confirm('Delete this logo?')) return

    const res = await fetch('/api/client-logo', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) return alert('Failed to delete')

    load()
  }

  // ================= TOGGLE STATUS =================
  async function toggleStatus(id: string) {
    const res = await fetch('/api/client-logo', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      alert('Failed to update status')
      return
    }

    load()
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Client Logos</h1>

      {/* ================= FORM ================= */}
      <div className="bg-white p-6 border rounded mb-6 max-w-3xl">
        <h2 className="font-semibold mb-4">
          {editId ? 'Edit Client Logo' : 'Add Client Logos'}
        </h2>

        {/* CLIENT */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Client</label>
          <select
            className="border p-2 w-full rounded"
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

        {/* LOGO NAME */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Logo Name</label>
          <input
            className="border p-2 w-full rounded"
            value={logoName}
            onChange={(e) => setLogoName(e.target.value)}
            placeholder="Enter logo name"
          />
        </div>

        {/* MULTI FILE */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            {editId ? 'Replace Logo Image' : 'Upload Logo Images '}
          </label>

          <input
            type="file"
            multiple={!editId}
            accept="image/*"
            className="border p-2 w-full"
            onChange={(e) => {
              const selected = Array.from(e.target.files || [])
              setFiles(selected)

              const urls = selected.map(f => URL.createObjectURL(f))
              setPreviews(urls)
            }}
          />
        </div>

        {/* PREVIEWS */}
        {previews.length > 0 && (
          <div className="mb-6 grid grid-cols-4 gap-4">
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                className="h-24 w-24 object-contain border rounded"
              />
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={saveLogo}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold"
          >
            {editId ? 'Update Logo' : 'Save Logos'}
          </button>

          {editId && (
            <button
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <table className="w-full bg-white border shadow-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 w-16">ID</th>
            <th className="border p-2">Client</th>
            <th className="border p-2">Logo Name</th>
            <th className="border p-2">Logo</th>
            <th className="border p-2">Status</th>
            <th className="border p-2 w-56">Actions</th>
          </tr>
        </thead>
        <tbody>
          {logos.map((l: any, i: number) => (
            <tr key={l._id}>
              <td className="border p-2 text-center">{i + 1}</td>
              <td className="border p-2">{l.clientName}</td>
              <td className="border p-2">{l.logoName}</td>
              <td className="border p-2">
                <img src={l.logoUrl} className="h-14 object-contain" />
              </td>
              {/* STATUS COLUMN */}
              {/* STATUS COLUMN (CLICKABLE) */}
              <td
                className="border p-2 text-center cursor-pointer"
                onClick={() => toggleStatus(l._id)}
              >
                {l.status === 'active' ? (
                  <div className="flex items-center justify-center gap-2 text-green-700 font-semibold">
                    <span className="bg-green-100 px-3 py-1 rounded text-xs">
                      Active
                    </span>
                    <span className="text-green-600 text-lg">✔</span>
                  </div>
                ) : (
                  <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded text-xs font-semibold">
                    Inactive
                  </span>
                )}
              </td>



              {/* ACTIONS COLUMN */}
              <td className="border p-2 text-center flex gap-2 justify-center flex-wrap">


                {/* EDIT */}
                <button
                  onClick={() => editLogo(l)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>

                {/* DELETE */}
                <button
                  onClick={() => deleteLogo(l._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
