import { NextResponse } from 'next/server'

export async function POST() {
  const res = NextResponse.json({ success: true })

  //  clear auth cookie
  res.cookies.set('admin-auth', '', {
    path: '/',
    expires: new Date(0),
  })

  return res
}


