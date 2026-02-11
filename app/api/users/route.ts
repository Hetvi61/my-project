export const runtime = 'nodejs'

import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// ================= GET USERS =================
export async function GET() {
  try {
    await connectDB()

    // Send required fields (NO password)
    const users = await User.find().select(
      'username email contact passwordLength createdAt updatedAt'
    )

    return NextResponse.json(users)
  } catch (error) {
    console.error('GET /api/users error:', error)
    return NextResponse.json([], { status: 500 })
  }
}

// ================= ADD USER =================
export async function POST(req: Request) {
  try {
    await connectDB()

    const { username, email, contact, password } = await req.json()

    // validation
    if (!username || !email || !contact || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

     //  DUPLICATE EMAIL CHECK
    if (await User.findOne({ email })) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    //  DUPLICATE USERNAME CHECK
    if (await User.findOne({ username })) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      )
    }

   
    //  DUPLICATE CONTACT CHECK
    if (await User.findOne({ contact })) {
      return NextResponse.json(
        { error: 'Contact number already exists' },
        { status: 409 }
      )
    }

    //  Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username,
      email,
      contact,
      password: hashedPassword,
      passwordLength: password.length,
    })

    // Safe response
    return NextResponse.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      contact: user.contact,
      passwordLength: user.passwordLength,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
  } catch (error) {
    console.error('POST /api/users error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
