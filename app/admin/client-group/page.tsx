'use client'

import { useEffect, useState } from 'react'

function buildTree(groups: any[]) {
  const map: any = {}
  const result: any[] = []

  groups.forEach((g) => {
    const pid = g.parent?._id || 'root'
    if (!map[pid]) map[pid] = []
    map[pid].push(g)
  })

  function walk(pid: string, prefix = '') {
    ;(map[pid] || []).forEach((g: any) => {
      result.push({
        _id: g._id,
        groupId: g.groupId,
        name: `${prefix}${g.name}`,
        parent: g.parent,
      })
      walk(g._id, `${prefix}— `)
    })
  }

  walk('root')
  return result
}

export default function ClientGroupPage() {
  const [name, setName] = useState('')
  const [parent, setParent] = useState('')
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // ================= LOAD =================
  async function load() {
    try {
      const res = await fetch('/api/client-group')
      const data = await res.json()
      setGroups(Array.isArray(data) ? data : [])
    } catch (err) {
      alert('Failed to load client groups')
    }
  }

  // ================= SAVE =================
  async function save() {
    if (!name.trim()) {
      alert('Group name required')
      return
    }

    try {
      setLoading(true)

      const res = await fetch('/api/client-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          parent: parent || null,
        }),
      })

      let data: any = null
      try {
        data = await res.json()
      } catch {
        alert('Server returned invalid response')
        setLoading(false)
        return
      }

      if (!res.ok) {
        alert(data?.error || 'Failed to save group')
        setLoading(false)
        return
      }

      //  RESET + RELOAD
      setName('')
      setParent('')
      await load()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const tree = buildTree(groups)

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Client Groups</h1>

      {/* ADD FORM */}
      <div className="bg-white p-4 mb-6 border rounded">
        <input
          className="border p-2 mr-2"
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border p-2"
          value={parent}
          onChange={(e) => setParent(e.target.value)}
        >
          <option value="">Main Group</option>
          {tree.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
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

      {/* LIST */}
      <table className="w-full border bg-white">
        <thead>
          <tr>
            <th className="border p-2 text-left w-20">ID</th>
            <th className="border p-2 text-left">Group</th>
            <th className="border p-2 text-left">Parent</th>
          </tr>
        </thead>
        <tbody>
          {tree.map((g) => (
            <tr key={g._id}>
              <td className="border p-2 font-medium">
                {g.groupId}
              </td>

              <td className="border p-2">{g.name}</td>

              <td className="border p-2">
                {g.parent ? g.parent.name : 'Main'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
