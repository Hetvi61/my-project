export const runtime = 'nodejs' // important for bcrypt

import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    await connectDB()

    const { email, password } = await req.json()

    // validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    //  LOGIN SUCCESS → SET COOKIE FROM BACKEND
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        contact: user.contact,
      },
    })

    // SECURE COOKIE
    response.cookies.set('admin-auth', 'true', {
      path: '/',
      httpOnly: true, //  IMPORTANT
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
