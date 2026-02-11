'use client'

import { useEffect, useState } from 'react'
import AuthGuard from '@/components/AuthGuard'
import { useRouter } from 'next/navigation'

export default function ViewTemplatePage() {
  const [templates, setTemplates] = useState<any[]>([])
  const router = useRouter()

  // ================= LOAD =================
  async function loadTemplates() {
    const res = await fetch('/api/template')
    const data = await res.json()
    setTemplates(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    loadTemplates()
  }, [])

  // ================= DELETE =================
  async function deleteTemplate(id: string) {
    if (!confirm('Delete this template?')) return

    const res = await fetch('/api/template', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      alert('Failed to delete template')
      return
    }

    loadTemplates()
  }

  return (
    <AuthGuard>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Templates</h1>

        <table className="w-full bg-white border shadow-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 w-16">ID</th>
              <th className="border p-2">Template Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Width</th>
              <th className="border p-2">Height</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Tags</th>
              <th className="border p-2">Preview</th>
              <th className="border p-2 w-56">Actions</th>
            </tr>
          </thead>

          <tbody>
            {templates.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-6">
                  No templates found
                </td>
              </tr>
            ) : (
              templates.map((t, i) => (
                <tr key={t._id}>
                  <td className="border p-2 text-center">{i + 1}</td>

                  <td className="border p-2">{t.templateName}</td>

                  <td className="border p-2">
                    {t.categoryId?.name || '-'}
                  </td>

                  <td className="border p-2 text-center">{t.width}</td>

                  <td className="border p-2 text-center">{t.height}</td>

                  <td className="border p-2 text-center">
                    {t.templateType}
                  </td>

                  <td className="border p-2">
                    {Array.isArray(t.tags) ? t.tags.join(', ') : ''}
                  </td>

                  <td className="border p-2">
                    {t.templateUrl && (
                      <img
                        src={t.templateUrl}
                        className="h-20 w-20 object-contain border rounded bg-white p-1 mx-auto"
                      />
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="border p-2 text-center flex gap-2 justify-center">
                    <button
                      onClick={() =>
                        router.push(`/admin/templates/add?id=${t._id}`)
                      }
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTemplate(t._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AuthGuard>
  )
}

