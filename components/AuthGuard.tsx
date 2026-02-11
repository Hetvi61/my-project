'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin-auth')

    if (!isLoggedIn) {
      router.replace('/login')
    } else {
      setCheckingAuth(false)
    }
  }, [router])

  // prevent flicker
  if (checkingAuth) {
    return null
  }

  return <>{children}</>
}
