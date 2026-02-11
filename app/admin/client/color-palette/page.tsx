'use client'

import { useEffect, useState } from 'react'

export default function ClientColorPalettePage() {
  const [clients, setClients] = useState<any[]>([])
  const [palettes, setPalettes] = useState<any[]>([])

  const [clientId, setClientId] = useState('')
  const [clientName, setClientName] = useState('')
  const [paletteName, setPaletteName] = useState('')

  const [colors, setColors] = useState([
    '#ffffff',
    '#ffffff',
    '#ffffff',
    '#ffffff',
    '#ffffff',
  ])

  const [editId, setEditId] = useState<string | null>(null)

  // ================= LOAD DATA =================
  async function load() {
    const c = await fetch('/api/client').then(r => r.json())
    const p = await fetch('/api/client-palette').then(r => r.json())

    setClients(Array.isArray(c) ? c : [])
    setPalettes(Array.isArray(p) ? p : [])
  }

  useEffect(() => {
    load()
  }, [])

  const allColors = colors.filter(c => c).join(',')

  // ================= SAVE / UPDATE =================
  async function savePalette() {
    if (!clientId || !paletteName) {
      alert('Client and Palette Name required')
      return
    }

    const payload = {
      clientId: clientId,
      clientName,
      paletteName,
      allColors,
      colors,
    }

    const res = await fetch('/api/client-palette', {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editId ? { ...payload, _id: editId } : payload),
    })

    if (!res.ok) {
      alert('Failed to save palette')
      return
    }

    resetForm()
    load()
  }

  function resetForm() {
    setClientId('')
    setClientName('')
    setPaletteName('')
    setColors([
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
      '#ffffff',
    ])
    setEditId(null)
  }

  // ================= EDIT =================
  function editPalette(p: any) {
    setEditId(p._id)
    setClientId(String(p.clientId))
    setClientName(p.clientName)
    setPaletteName(p.paletteName)

    const filled = [...p.colors]
    while (filled.length < 5) filled.push('#ffffff')
    setColors(filled.slice(0, 5))
  }

  // ================= DELETE =================
  async function deletePalette(id: string) {
    if (!confirm('Delete this palette?')) return

    const res = await fetch('/api/client-palette', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) return alert('Failed to delete')

    load()
  }

  // ================= TOGGLE STATUS =================
  async function toggleStatus(id: string) {
    const res = await fetch('/api/client-palette', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: id }),
    })

    if (!res.ok) {
      alert('Failed to update status')
      return
    }

    load()
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Client Color Palettes</h1>

      {/* ================= FORM ================= */}
      <div className="bg-white p-6 border rounded mb-6 max-w-3xl">
        <h2 className="font-semibold mb-4">
          {editId ? 'Edit Color Palette' : 'Add Color Palette'}
        </h2>

        {/* CLIENT */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Client</label>
          <select
            className="border p-2 w-full rounded"
            value={clientId}
            onChange={(e) => {
              const id = e.target.value
              setClientId(id)

              const c =
                clients.find((x) => String(x._id) === id) ||
                clients.find((x) => String(x.clientId) === id) ||
                clients.find((x) => String(x.ClientId) === id)

              setClientName(
                c?.clientName || c?.ClientName || c?.name || ''
              )
            }}
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.clientName || c.ClientName || '-'}
              </option>
            ))}
          </select>
        </div>

        {/* PALETTE NAME */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Palette Name</label>
          <input
            className="border p-2 w-full rounded"
            value={paletteName}
            onChange={(e) => setPaletteName(e.target.value)}
            placeholder="Enter palette name"
          />
        </div>

        {/* ALL COLORS */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">All Colors</label>
          <input
            className="border p-2 w-full rounded bg-gray-100"
            value={allColors}
            readOnly
          />
        </div>

        {/* COLOR BOXES */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">Colors</label>
          <div className="flex gap-4 flex-wrap">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-10 w-14 border rounded"
                  value={color}
                  onChange={(e) => {
                    const copy = [...colors]
                    copy[index] = e.target.value
                    setColors(copy)
                  }}
                />
                <input
                  className="border p-2 w-32 rounded"
                  value={color}
                  onChange={(e) => {
                    const copy = [...colors]
                    copy[index] = e.target.value
                    setColors(copy)
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={savePalette}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold"
          >
            {editId ? 'Update Palette' : 'Save Palette'}
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
           
            <th className="border p-2">Client</th>
            <th className="border p-2">Palette</th>
            <th className="border p-2">Colors</th>
            <th className="border p-2">Status</th>
            <th className="border p-2 w-56">Actions</th>
          </tr>
        </thead>
        <tbody>
          {palettes.map((p: any, i: number) => (
            <tr key={p._id}>

              <td className="border p-2">{p.clientName}</td>
              <td className="border p-2">{p.paletteName}</td>

              {/* COLOR PREVIEW */}
              <td className="border p-2">
                <div className="flex gap-2">
                  {p.colors.map((c: string) => (
                    <div
                      key={c}
                      className="h-6 w-6 rounded border"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </td>

              {/* STATUS */}
              <td
                className="border p-2 text-center cursor-pointer"
                onClick={() => toggleStatus(p._id)}
              >
                {p.isActive ? (
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

              {/* ACTIONS */}
              <td className="border p-2 text-center flex gap-2 justify-center flex-wrap">
                <button
                  onClick={() => editPalette(p)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => deletePalette(p._id)}
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
