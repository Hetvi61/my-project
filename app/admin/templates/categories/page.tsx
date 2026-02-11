'use client'

import { useEffect, useState } from 'react'
import AuthGuard from '@/components/AuthGuard'

export default function TemplateCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState<'main' | string>('main') // ✅ default MAIN
  const [editId, setEditId] = useState<string | null>(null)

  // ================= LOAD =================
  async function loadCategories() {
    const res = await fetch('/api/template-category')
    const data = await res.json()
    setCategories(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    loadCategories()
  }, [])

  // ================= SAVE / UPDATE =================
  async function saveCategory() {
    if (!name.trim()) {
      alert('Category name required')
      return
    }

    const res = await fetch('/api/template-category', {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editId,
        name: name.trim(),
        parentId: parentId === 'main' ? null : parentId, // ✅ IMPORTANT
      }),
    })

    if (!res.ok) {
      alert('Failed to save category')
      return
    }

    resetForm()
    loadCategories()
  }

  function resetForm() {
    setName('')
    setParentId('main') // ✅ RESET TO MAIN
    setEditId(null)
  }

  // ================= EDIT =================
  function editCategory(cat: any) {
    setEditId(cat._id)
    setName(cat.name)
    setParentId(cat.parentId ? cat.parentId : 'main') // ✅ FIX
  }

  // ================= DELETE =================
  async function deleteCategory(id: string) {
    if (!confirm('Delete this category?')) return

    const res = await fetch('/api/template-category', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      alert('Delete failed')
      return
    }

    loadCategories()
  }

  return (
    <AuthGuard>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          Template Categories
        </h1>

        {/* ================= FORM ================= */}
        <div className="bg-white p-6 border rounded mb-6 max-w-3xl">
          <h2 className="font-semibold mb-4">
            {editId ? 'Edit Category' : 'Add Category'}
          </h2>

          {/* NAME */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Category Name
            </label>
            <input
              className="border p-2 w-full rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
            />
          </div>

          {/* PARENT */}
          <div className="mb-6">
            <label className="block mb-1 font-medium">
              Parent Category
            </label>
            <select
              className="border p-2 w-full rounded"
              value={parentId}
              onChange={(e) =>
                setParentId(e.target.value as 'main' | string)
              }
            >
              <option value="main">Main</option>

              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={saveCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              {editId ? 'Update' : 'Save'}
            </button>

            {editId && (
              <button
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* ================= LIST ================= */}
        <table className="w-full bg-white border shadow-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 w-16">ID</th>
              <th className="border p-2">Category Name</th>
              <th className="border p-2">Parent</th>
              <th className="border p-2 w-48">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((c, i) => (
              <tr key={c._id}>
                <td className="border p-2 text-center">
                  {i + 1}
                </td>
                <td className="border p-2">{c.name}</td>
                <td className="border p-2">
                  {c.parentId
                    ? categories.find(p => p._id === c.parentId)?.name || '-'
                    : 'Main'}
                </td>
                <td className="border p-2 text-center flex gap-2 justify-center">
                  <button
                    onClick={() => editCategory(c)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCategory(c._id)}
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
    </AuthGuard>
  )
}
