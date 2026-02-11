import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Template from '@/models/Template'
import fs from 'fs'
import path from 'path'

/* ================= CREATE ================= */
export async function POST(req: Request) {
  try {
    await connectDB()
    const formData = await req.formData()

    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json(
        { error: 'File required' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadDir = path.join(
      process.cwd(),
      'public/uploads/templates'
    )

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const fileName = `${Date.now()}-${file.name}`
    fs.writeFileSync(path.join(uploadDir, fileName), buffer)

    const tags = String(formData.get('tags') || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const template = await Template.create({
      templateName: formData.get('templateName'),
      categoryId: formData.get('categoryId'),
      width: Number(formData.get('width')),
      height: Number(formData.get('height')),
      templateType: formData.get('templateType'),
      tags,
      templateUrl: `/uploads/templates/${fileName}`,
    })

    return NextResponse.json(template)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Create failed' },
      { status: 500 }
    )
  }
}

/* ================= GET ================= */
export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    // 🔹 SINGLE TEMPLATE (EDIT)
    if (id) {
      const template = await Template
        .findById(id)
        .populate('categoryId')

      return NextResponse.json(template)
    }

    // 🔹 ALL TEMPLATES (VIEW)
    const list = await Template
      .find()
      .populate('categoryId')

    return NextResponse.json(list)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Fetch failed' },
      { status: 500 }
    )
  }
}

/* ================= UPDATE ================= */
export async function PUT(req: Request) {
  try {
    await connectDB()
    const formData = await req.formData()

    const id = formData.get('id') as string
    if (!id) {
      return NextResponse.json(
        { error: 'Template ID required' },
        { status: 400 }
      )
    }

    const updateData: any = {
      templateName: formData.get('templateName'),
      categoryId: formData.get('categoryId'),
      width: Number(formData.get('width')),
      height: Number(formData.get('height')),
      templateType: formData.get('templateType'),
      tags: String(formData.get('tags') || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    }

    // 🔹 IMAGE OPTIONAL ON EDIT
    const file = formData.get('file') as File | null
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const uploadDir = path.join(
        process.cwd(),
        'public/uploads/templates'
      )

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      const fileName = `${Date.now()}-${file.name}`
      fs.writeFileSync(path.join(uploadDir, fileName), buffer)

      updateData.templateUrl = `/uploads/templates/${fileName}`
    }

    const updated = await Template.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )

    // ✅ VERY IMPORTANT (fixes JSON error)
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Update failed' },
      { status: 500 }
    )
  }
}

/* ================= DELETE ================= */
export async function DELETE(req: Request) {
  try {
    await connectDB()
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: 'ID required' },
        { status: 400 }
      )
    }

    await Template.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Delete failed' },
      { status: 500 }
    )
  }
}
