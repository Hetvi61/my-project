export const runtime = 'nodejs'

import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    await connectDB()

    const { email, newPassword } = await req.json()

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'Email and new password required' },
        { status: 400 }
      )
    }

    //  find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    //  hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // UPDATE USER (THIS TRIGGERS updatedAt)
    user.password = hashedPassword
    user.passwordLength = newPassword.length
    await user.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
