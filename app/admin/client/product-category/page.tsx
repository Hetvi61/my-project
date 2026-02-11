'use client'

import { useEffect, useState } from 'react'

export default function ClientProductCategoryPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [name, setName] = useState('')
  const [parentId, setParentId] = useState('')
  const [editId, setEditId] = useState<string | null>(null)

  /* LOAD */
  async function load() {
    const res = await fetch('/api/client-product-category')
    const data = await res.json()
    setCategories(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    load()
  }, [])

  /* SAVE / UPDATE */
  async function saveCategory() {
    if (!name) {
      alert('Category name required')
      return
    }

    await fetch('/api/client-product-category', {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _id: editId,
        name,
        parentId: parentId || null,
      }),
    })

    resetForm()
    load()
  }

  function resetForm() {
    setName('')
    setParentId('')
    setEditId(null)
  }

  /* EDIT */
  function editCategory(c: any) {
    setEditId(c._id)
    setName(c.name)
    setParentId(c.parentId || '')
  }

  /* DELETE */
  async function deleteCategory(id: string) {
    if (!confirm('Delete this category?')) return

    await fetch('/api/client-product-category', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    load()
  }

  const parentName = (pid: string) =>
    categories.find(c => c._id === pid)?.name || '-'

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Client Product Categories
      </h1>

      {/* ================= FORM ================= */}
      <div className="bg-white p-6 border rounded mb-6 max-w-3xl">
        <h2 className="font-semibold mb-4">
          {editId ? 'Edit Category' : 'Add Category'}
        </h2>

        {/* CATEGORY NAME */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Category Name
          </label>
          <input
            className="border p-2 w-full rounded"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* PARENT CATEGORY */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">
            Parent Category
          </label>
          <select
            className="border p-2 w-full rounded"
            value={parentId}
            onChange={e => setParentId(e.target.value)}
          >
            {/* DEFAULT */}
            <option value="">Main Parent</option>

            {/* EXISTING CATEGORIES */}
            {categories
              .filter(c => c._id !== editId) // prevent self parent
              .map(c => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={saveCategory}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold"
          >
            {editId ? 'Update Category' : 'Save Category'}
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
            <th className="border p-2">Category</th>
            <th className="border p-2">Parent</th>
            <th className="border p-2 w-48">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c, i) => (
            <tr key={c._id}>
              <td className="border p-2 text-center">{i + 1}</td>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">
                {c.parentId ? parentName(c.parentId) : 'Main Parent'}
              </td>
              <td className="border p-2 flex gap-2 justify-center">
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
  )
}
