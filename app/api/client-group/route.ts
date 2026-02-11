import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ClientGroup from '@/models/ClientGroup'
import { getNextId } from '@/lib/getNextId'

/* ======================
   GET CLIENT GROUPS
   ====================== */
export async function GET() {
  try {
    await connectDB()

    const groups = await ClientGroup.find()
      .populate('parent', 'name')
      .sort({ groupId: 1 })

    return NextResponse.json(groups)
  } catch (err) {
    console.error('GET client-group error:', err)

    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    )
  }
}

/* ======================
   ADD CLIENT GROUP
   ====================== */
export async function POST(req: Request) {
  try {
    await connectDB()

    const { name, parent } = await req.json()

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Group name required' },
        { status: 400 }
      )
    }

    const cleanName = name.trim()

    // UNIQUE NAME CHECK
    const exists = await ClientGroup.findOne({ name: cleanName })
    if (exists) {
      return NextResponse.json(
        { error: 'Group already exists' },
        { status: 409 }
      )
    }

    // AUTO-INCREMENT GROUP ID
    const groupId = await getNextId('client-group')

    const group = await ClientGroup.create({
      groupId,
      name: cleanName,
      parent: parent || null,
    })

    return NextResponse.json(group, { status: 201 })
  } catch (err: any) {
    console.error('POST client-group error FULL:', err)

    return NextResponse.json(
      { error: err.message || 'Failed to create client group' },
      { status: 500 }
    )
  }
}

