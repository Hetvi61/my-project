'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded ${
      pathname === path
        ? 'bg-gray-800 text-white'
        : 'hover:bg-gray-100'
    }`

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r">
      <div className="p-4 font-bold text-lg border-b">
        Admin Panel
      </div>

      <nav className="p-4 space-y-2">
        <Link href="/admin" className={linkClass('/admin')}>
          Dashboard
        </Link>

        <div className="mt-4 font-semibold text-sm text-gray-500">
          Clients
        </div>

        <Link
          href="/admin/clients/add"
          className={linkClass('/admin/clients/add')}
        >
          Add Client
        </Link>

        <Link
          href="/admin/clients/list"
          className={linkClass('/admin/clients/list')}
        >
          Client List
        </Link>

        <Link
          href="/admin/business-category"
          className={linkClass('/admin/business-category')}
        >
          Business Category
        </Link>

        <Link
          href="/admin/client-group"
          className={linkClass('/admin/client-group')}
        >
          Client Group
        </Link>
      </nav>
    </aside>
  )
}