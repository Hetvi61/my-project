import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ClientProductCategory from '@/models/ClientProductCategory'

/* ================= GET ================= */
export async function GET() {
  await connectDB()
  const categories = await ClientProductCategory.find().sort({ createdAt: 1 })
  return NextResponse.json(categories)
}

/* ================= POST ================= */
export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()

  const cat = await ClientProductCategory.create({
    name: body.name,
    parentId: body.parentId || null,
  })

  return NextResponse.json(cat)
}

/* ================= PUT (EDIT / TOGGLE) ================= */
export async function PUT(req: Request) {
  await connectDB()
  const body = await req.json()

  const updated = await ClientProductCategory.findByIdAndUpdate(
    body._id,
    body,
    { new: true }
  )

  return NextResponse.json(updated)
}

/* ================= DELETE ================= */
export async function DELETE(req: Request) {
  await connectDB()
  const { id } = await req.json()

  await ClientProductCategory.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
