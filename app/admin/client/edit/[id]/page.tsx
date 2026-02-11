'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AuthGuard from '@/components/AuthGuard'

export default function EditClientPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const [clientName, setClientName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [mobile, setMobile] = useState('')
  const [businessCategory, setBusinessCategory] = useState('')
  const [clientGroup, setClientGroup] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [website, setWebsite] = useState('')
  const [services, setServices] = useState('')
  const [demographics, setDemographics] = useState('')
  const [productDetails, setProductDetails] = useState('')

  // ================= LOAD CLIENT (CORRECT WAY) =================
  useEffect(() => {
    if (!id) return

    async function loadClient() {
      try {
        const res = await fetch('/api/client')
        const list = await res.json()

        const client = list.find((c: any) => c._id === id)

        if (!client) {
          alert('Client not found')
          router.push('/admin/client/list')
          return
        }

        setClientName(
          client.clientName ||
          client.ClientName ||
          client.companyName ||
          client.name ||
          ''
        )

        setEmail(client.email || '')
        setPhone(client.phone || '')
        setMobile(client.mobile || '')
        setBusinessCategory(client.businessCategory || '')
        setClientGroup(client.clientGroup || '')
        setTargetAudience(client.targetAudience || '')
        setWebsite(client.website || '')
        setServices(client.services || '')
        setDemographics(client.demographics || '')
        setProductDetails(client.productDetails || '')
      } catch (err) {
        alert('Failed to load client')
      } finally {
        setLoading(false)
      }
    }

    loadClient()
  }, [id, router])

  // ================= UPDATE =================
  async function updateClient() {
    const res = await fetch('/api/client', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        clientName,
        email,
        phone,
        mobile,
        businessCategory,
        clientGroup,
        targetAudience,
        website,
        services,
        demographics,
        productDetails,
      }),
    })

    if (!res.ok) {
      alert('Update failed')
      return
    }

    alert('Client updated successfully')
    router.push('/admin/client/list')
  }

  if (loading) {
    return <div className="p-6">Loading…</div>
  }

  return (
    <AuthGuard>
      <div className="bg-white p-6 rounded shadow max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Edit Client</h1>

        <div className="grid grid-cols-2 gap-4">
          <input className="border p-2" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client Name" />
          <input className="border p-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
          <input className="border p-2" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" />
          <input className="border p-2" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Mobile" />
          <input className="border p-2" value={businessCategory} onChange={e => setBusinessCategory(e.target.value)} placeholder="Business Category" />
          <input className="border p-2" value={clientGroup} onChange={e => setClientGroup(e.target.value)} placeholder="Client Group" />
          <input className="border p-2" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} placeholder="Target Audience" />
          <input className="border p-2" value={website} onChange={e => setWebsite(e.target.value)} placeholder="Website" />
        </div>

        <textarea className="border p-2 w-full mt-4" rows={3} value={services} onChange={e => setServices(e.target.value)} placeholder="Services" />
        <textarea className="border p-2 w-full mt-4" rows={3} value={demographics} onChange={e => setDemographics(e.target.value)} placeholder="Demographics" />
        <textarea className="border p-2 w-full mt-4" rows={3} value={productDetails} onChange={e => setProductDetails(e.target.value)} placeholder="Product Details" />

        <button onClick={updateClient} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded">
          Update Client
        </button>
      </div>
    </AuthGuard>
  )
}
