'use client'

import { useEffect, useState } from 'react'

export default function ClientAddressPage() {
  const [clients, setClients] = useState<any[]>([])
  const [addresses, setAddresses] = useState<any[]>([])

  const [clientId, setClientId] = useState('')
  const [clientName, setClientName] = useState('')

  const [addressType, setAddressType] = useState('Office')
  const [address, setAddress] = useState('')

  async function loadData() {
    const c = await fetch('/api/client').then(res => res.json())
    const a = await fetch('/api/client-address').then(res => res.json())

    setClients(c)
    setAddresses(a)
  }

  async function saveAddress() {
    const res = await fetch('/api/client-address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        clientName,   //  SEND NAME
        addressType,
        address,
      }),
    })

    const data = await res.json()
    if (!res.ok) return alert(data.error)

    setAddress('')
    loadData()
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Add Client Address</h1>

      <div className="bg-white p-8 rounded-lg shadow-sm border max-w-2xl">
        <h2 className="text-lg font-semibold mb-6">
          Add Client Address
        </h2>

        {/* CLIENT */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Client
          </label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={clientId}
            onChange={(e) => {
              const selectedId = e.target.value
              const selectedClient = clients.find(
                (c) => c._id === selectedId
              )

              setClientId(selectedId)
              setClientName(selectedClient?.clientName || '')
            }}
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.clientName}
              </option>
            ))}
          </select>
        </div>

        {/* ADDRESS TYPE */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Address Type
          </label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={addressType}
            onChange={(e) => setAddressType(e.target.value)}
          >
            <option value="Office">Office</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* ADDRESS */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Address
          </label>
          <textarea
            rows={4}
            placeholder="Enter full address"
            className="w-full border rounded-md px-3 py-2 resize-none"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* ACTION */}
        <div className="flex justify-end">
          <button
            onClick={saveAddress}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Save Address
          </button>
        </div>
      </div>

      {/* LIST */}
      <h2 className="font-semibold mb-2 mt-6">Saved Addresses</h2>

      <table className="w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Client</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Address</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((a, i) => (
            <tr key={a._id}>
              <td className="border p-2">{i + 1}</td>
              <td className="border p-2">
                {a.clientName}   {/*  USE STORED NAME */}
              </td>
              <td className="border p-2">{a.addressType}</td>
              <td className="border p-2">{a.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
