'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

const ANGLES = ['Front Angle', 'Right Angle', 'Left Angle', 'Back Angle']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const STYLES = ['Single Photo', 'Multiple Photo']

export default function ClientProductPage() {
  const [clients, setClients] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  const [clientId, setClientId] = useState('')
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [angle, setAngle] = useState('')
  const [size, setSize] = useState('')
  const [style, setStyle] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)

  const [editId, setEditId] = useState<string | null>(null)
  const [formKey, setFormKey] = useState(0)

  /* LOAD CLIENTS */
  async function loadClients() {
    const res = await fetch('/api/client')
    const text = await res.text()
    setClients(text ? JSON.parse(text) : [])
  }

  /* LOAD CATEGORIES */
  async function loadCategories() {
    const res = await fetch('/api/client-product-category')
    const text = await res.text()
    setCategories(text ? JSON.parse(text) : [])
  }

  /*  LOAD ALL PRODUCTS (NO FILTER) */
  async function loadProducts() {
    const res = await fetch('/api/client-product')
    const text = await res.text()
    setProducts(text ? JSON.parse(text) : [])
  }

  useEffect(() => {
    loadClients()
    loadCategories()
    loadProducts()
  }, [])

  /* SAVE / UPDATE */
  async function handleSubmit() {
    if (!clientId || !productName) {
      alert('Client and Product Name are required')
      return
    }

    const formData = new FormData()
    if (editId) formData.append('_id', editId)

    formData.append('clientId', clientId)
    formData.append('productName', productName)
    formData.append('category', category)
    formData.append('angle', angle)
    formData.append('size', size)
    formData.append('style', style)
    formData.append('type', type)
    formData.append('description', description)
    if (image) formData.append('image', image)

    await fetch('/api/client-product', {
      method: editId ? 'PUT' : 'POST',
      body: formData,
    })

    /* RESET */
    setEditId(null)
    setProductName('')
    setCategory('')
    setAngle('')
    setSize('')
    setStyle('')
    setType('')
    setDescription('')
    setImage(null)
    setFormKey(prev => prev + 1)

    loadProducts()
  }

  /* EDIT */
  function editProduct(p: any) {
    setEditId(p._id)
    setClientId(String(p.clientId))
    setProductName(p.productName)
    setCategory(p.category)
    setAngle(p.angle)
    setSize(p.size)
    setStyle(p.style)
    setType(p.type)
    setDescription(p.description || '')
  }

  /* DELETE */
  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return

    await fetch('/api/client-product', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    loadProducts()
  }

  const clientMap = Object.fromEntries(
    clients.map(c => [String(c._id), c.clientName || c.ClientName])
  )

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Client Products</h1>

      {/* ================= FORM ================= */}
      <div key={formKey} className="bg-white p-6 border rounded mb-6 max-w-3xl">
        <h2 className="font-semibold mb-4">
          {editId ? 'Edit Client Product' : 'Add Client Product'}
        </h2>

        <div className="mb-4">
          <Label>Client</Label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(c => (
                <SelectItem key={c._id} value={String(c._id)}>
                  {c.clientName || c.ClientName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Label>Product Name</Label>
          <Input value={productName} onChange={e => setProductName(e.target.value)} />
        </div>

        <div className="mb-4">
          <Label>Category</Label>
          <select
            className="border p-2 w-full rounded"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((c: any) => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <Label>Angle</Label>
          <Select value={angle} onValueChange={setAngle}>
            <SelectTrigger><SelectValue placeholder="Select Angle" /></SelectTrigger>
            <SelectContent>
              {ANGLES.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Label>Size</Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger><SelectValue placeholder="Select Size" /></SelectTrigger>
            <SelectContent>
              {SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Label>Style</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger><SelectValue placeholder="Select Style" /></SelectTrigger>
            <SelectContent>
              {STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Label>Type</Label>
          <Input value={type} onChange={e => setType(e.target.value)} />
        </div>

        <div className="mb-4">
          <Label>Product Image</Label>
          <Input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} />
        </div>

        <div className="mb-6">
          <Label>Description</Label>
          <Textarea value={description} onChange={e => setDescription(e.target.value)} />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold"
        >
          {editId ? 'Update Product' : 'Save Product'}
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <table className="w-full bg-white border shadow-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Client</th>
            <th className="border p-2">Product</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Angle</th>
            <th className="border p-2">Size</th>
            <th className="border p-2">Style</th>
            <th className="border p-2">Type</th>
            <th className="border p-2 w-40">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p: any) => (
            <tr key={p._id}>
              <td className="border p-2">{clientMap[p.clientId]}</td>
              <td className="border p-2">{p.productName}</td>
              <td className="border p-2 text-center">
                {p.image ? (
                  <img src={p.image} className="h-14 mx-auto object-contain border rounded" />
                ) : (
                  <span className="text-gray-400 text-xs">No Image</span>
                )}
              </td>
              <td className="border p-2">{p.category}</td>
              <td className="border p-2">{p.angle}</td>
              <td className="border p-2">{p.size}</td>
              <td className="border p-2">{p.style}</td>
              <td className="border p-2">{p.type}</td>
              <td className="border p-2 text-center flex gap-2 justify-center">
                <button
                  onClick={() => editProduct(p)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(p._id)}
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
