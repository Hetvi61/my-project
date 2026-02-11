'use client'
import { useEffect, useState } from 'react'

export default function PastJobsPage() {
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/jobs/past')
      .then(res => res.json())
      .then(setJobs)
  }, [])

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Past Jobs</h1>

      <table className="w-full border bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Job</th>
            <th className="border p-2">Client</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Delivered</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(j => (
            <tr key={j._id}>
              <td className="border p-2">{j.job_name}</td>
              <td className="border p-2">{j.client_name}</td>
              <td className="border p-2">{j.job_type}</td>
              <td className="border p-2">
                {new Date(j.delivered_datetime).toLocaleString()}
              </td>
              <td className="border p-2">{j.job_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
