'use client'

import { useEffect, useState } from 'react'

function buildTree(categories: any[]) {
  const map: any = {}
  const result: any[] = []

  categories.forEach((cat) => {
    const pid = cat.parent?._id || 'root'
    if (!map[pid]) map[pid] = []
    map[pid].push(cat)
  })

  function walk(pid: string, prefix = '') {
    ;(map[pid] || []).forEach((cat: any) => {
      result.push({
        _id: cat._id,
        categoryId: cat.categoryId,
        name: `${prefix}${cat.name}`,
        parent: cat.parent,
      })
      walk(cat._id, `${prefix}— `)
    })
  }

  walk('root')
  return result
}

export default function BusinessCategoryPage() {
  const [name, setName] = useState('')
  const [parent, setParent] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  /* ================= LOAD ================= */
  async function load() {
    try {
      const res = await fetch('/api/business-category')
      const data = await res.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Load categories error:', err)
      alert('Failed to load categories')
    }
  }

  /* ================= SAVE ================= */
  async function save() {
    if (!name.trim()) {
      alert('Category name is required')
      return
    }

    setLoading(true)

    const res = await fetch('/api/business-category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parent }),
    })

    let data
    try {
      data = await res.json()
    } catch {
      setLoading(false)
      alert('Server returned invalid response (not JSON)')
      return
    }

    setLoading(false)

    if (!res.ok) {
      alert(data.error || 'Failed to save category')
      return
    }

    setName('')
    setParent('')
    load()
  }

  useEffect(() => {
    load()
  }, [])

  const tree = buildTree(categories)

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Business Categories</h1>

      {/* ================= ADD CATEGORY ================= */}
      <div className="bg-white p-4 mb-6 border rounded">
        <input
          placeholder="Category name"
          className="border p-2 mr-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border p-2"
          value={parent}
          onChange={(e) => setParent(e.target.value)}
        >
          <option value="">Main Category</option>
          {tree.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={save}
          disabled={loading}
          className="ml-2 bg-black text-white px-4 py-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* ================= CATEGORY LIST ================= */}
      <table className="w-full border bg-white">
        <thead>
          <tr>
            <th className="border p-2 text-left w-20">ID</th>
            <th className="border p-2 text-left">Category</th>
            <th className="border p-2 text-left">Parent</th>
          </tr>
        </thead>
        <tbody>
          {tree.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No categories found
              </td>
            </tr>
          ) : (
            tree.map((c) => (
              <tr key={c._id}>
                <td className="border p-2 font-medium">
                  {c.categoryId}
                </td>

                <td className="border p-2">{c.name}</td>
                <td className="border p-2">
                  {c.parent ? c.parent.name : 'Main'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
