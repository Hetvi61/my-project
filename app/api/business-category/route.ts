import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import BusinessCategory from '@/models/BusinessCategory'
import { getNextId } from '@/lib/getNextId'

/* =======================
   GET BUSINESS CATEGORIES
   ======================= */
export async function GET() {
  try {
    await connectDB()

    const categories = await BusinessCategory.find()
      .populate('parent', 'name')
      .sort({ categoryId: 1 })

    return NextResponse.json(categories)
  } catch (err: any) {
    console.error('GET business-category error:', err)

    return NextResponse.json(
      { error: err.message || 'Failed to load categories' },
      { status: 500 }
    )
  }
}

/* =======================
   ADD BUSINESS CATEGORY
   ======================= */
export async function POST(req: Request) {
  try {
    await connectDB()

    const { name, parent } = await req.json()
    console.log('POST business-category:', { name, parent })

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Category name required' },
        { status: 400 }
      )
    }

    // UNIQUE NAME CHECK (CASE-INSENSITIVE SAFE)
    const exists = await BusinessCategory.findOne({
      name: name.trim(),
    })

    if (exists) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 409 }
      )
    }

    // AUTO-INCREMENT CATEGORY ID
    const categoryId = await getNextId('business-category')

    const category = await BusinessCategory.create({
      categoryId,
      name: name.trim(),
      parent: parent || null,
    })

    //  ALWAYS RETURN JSON
    return NextResponse.json(category, { status: 201 })

  } catch (err: any) {
    console.error('POST business-category error:', err)

    //  ALWAYS RETURN JSON EVEN ON CRASH
    return NextResponse.json(
      { error: err.message || 'Failed to save category' },
      { status: 500 }
    )
  }
}
