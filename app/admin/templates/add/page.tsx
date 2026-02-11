'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthGuard from '@/components/AuthGuard'

export default function AddTemplatePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // GET ID FROM URL (?id=xxxx)
  const editIdFromUrl = searchParams.get('id')

  const [categories, setCategories] = useState<any[]>([])

  const [templateName, setTemplateName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [templateType, setTemplateType] = useState('')
  const [tags, setTags] = useState('')

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const [editId, setEditId] = useState<string | null>(null)

  // ================= LOAD CATEGORIES =================
  useEffect(() => {
    fetch('/api/template-category')
      .then(r => r.json())
      .then(setCategories)
  }, [])

  // ================= LOAD TEMPLATE FOR EDIT =================
  useEffect(() => {
    if (!editIdFromUrl) return

    setEditId(editIdFromUrl)

    async function loadTemplate() {
      const res = await fetch(`/api/template?id=${editIdFromUrl}`)
      const data = await res.json()

      setTemplateName(data.templateName || '')
      setCategoryId(data.categoryId?._id || data.categoryId || '')
      setWidth(String(data.width || ''))
      setHeight(String(data.height || ''))
      setTemplateType(data.templateType || '')
      setTags((data.tags || []).join(', '))
      setPreview(data.templateUrl || null)
    }

    loadTemplate()
  }, [editIdFromUrl])

  // ================= SAVE / UPDATE =================
  async function saveTemplate() {
    if (!templateName || !categoryId || !width || !height || !templateType) {
      alert('All required fields must be filled')
      return
    }

    if (!editId && !file) {
      alert('Please select template image')
      return
    }

    const formData = new FormData()
    formData.append('templateName', templateName)
    formData.append('categoryId', categoryId)
    formData.append('width', width)
    formData.append('height', height)
    formData.append('templateType', templateType)
    formData.append('tags', tags)

    if (editId) {
      formData.append('id', editId)
      if (file) formData.append('file', file)
    } else {
      if (file) formData.append('file', file)
    }

    const res = await fetch('/api/template', {
      method: editId ? 'PUT' : 'POST',
      body: formData,
    })

    let data = null
    try {
      data = await res.json()
    } catch {}

    if (!res.ok) {
      alert(data?.error || 'Update failed')
      return
    }

    router.push('/admin/templates/view')
  }

  function resetForm() {
    router.push('/admin/templates/add')
  }

  return (
    <AuthGuard>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Templates</h1>

        <div className="bg-white p-6 border rounded mb-6 max-w-3xl">
          <h2 className="font-semibold mb-4">
            {editId ? 'Edit Template' : 'Add Template'}
          </h2>

          {/* TEMPLATE NAME */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Template Name</label>
            <input
              className="border p-2 w-full rounded"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

          {/* CATEGORY */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Template Category</label>
            <select
              className="border p-2 w-full rounded"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* WIDTH */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Width</label>
            <input
              type="number"
              className="border p-2 w-full rounded"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </div>

          {/* HEIGHT */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Height</label>
            <input
              type="number"
              className="border p-2 w-full rounded"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>

          {/* TEMPLATE TYPE */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Template Type</label>
            <select
              className="border p-2 w-full rounded"
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="Post">Post</option>
              <option value="Video">Video</option>
            </select>
          </div>

          {/* TAGS */}
          <div className="mb-6">
            <label className="block mb-1 font-medium">
              Tags (comma separated)
            </label>
            <input
              className="border p-2 w-full rounded"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* FILE */}
          <div className="mb-6">
            <label className="block mb-1 font-medium">
              {editId ? 'Replace Template Image' : 'Upload Template Image'}
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="border p-2 w-full"
              onChange={(e) => {
                const f = e.target.files?.[0] || null
                setFile(f)
                if (f) setPreview(URL.createObjectURL(f))
              }}
            />
          </div>

          {preview && (
            <div className="mb-6">
              <img
                src={preview}
                className="h-32 object-contain border rounded"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={saveTemplate}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold"
            >
              {editId ? 'Update Template' : 'Save Template'}
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
      </div>
    </AuthGuard>
  )
}
