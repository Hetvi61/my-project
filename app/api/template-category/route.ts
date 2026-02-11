import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import TemplateCategory from '@/models/TemplateCategory'

// ================= GET =================
export async function GET() {
  try {
    await connectDB()
    const categories = await TemplateCategory.find().sort({ createdAt: 1 })
    return NextResponse.json(categories)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// ================= ADD =================
export async function POST(req: Request) {
  try {
    await connectDB()
    const { name, parentId } = await req.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Category name required' },
        { status: 400 }
      )
    }

    const category = await TemplateCategory.create({
      name,
      parentId: parentId || null,
    })

    return NextResponse.json(category, { status: 201 })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to create category' },
      { status: 500 }
    )
  }
}

// ================= UPDATE =================
export async function PUT(req: Request) {
  try {
    await connectDB()
    const { id, name, parentId } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID required' },
        { status: 400 }
      )
    }

    const updated = await TemplateCategory.findByIdAndUpdate(
      id,
      { name, parentId: parentId || null },
      { new: true }
    )

    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Update failed' },
      { status: 500 }
    )
  }
}

// ================= DELETE =================
export async function DELETE(req: Request) {
  try {
    await connectDB()
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID required' },
        { status: 400 }
      )
    }

    await TemplateCategory.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Delete failed' },
      { status: 500 }
    )
  }
}
