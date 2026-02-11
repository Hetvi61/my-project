import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ClientProduct from '@/models/ClientProduct'
import fs from 'fs'
import path from 'path'

/* ================= CREATE PRODUCT ================= */
export async function POST(req: Request) {
  try {
    await connectDB()
    const formData = await req.formData()

    let imagePath = ''

    const file = formData.get('image') as File | null
    if (file) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const fileName = `${Date.now()}-${file.name}`
      const uploadDir = path.join(
        process.cwd(),
        'public/uploads/client-product'
      )

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      fs.writeFileSync(path.join(uploadDir, fileName), buffer)
      imagePath = `/uploads/client-product/${fileName}`
    }

    const product = await ClientProduct.create({
      clientId: String(formData.get('clientId')),
      productName: formData.get('productName'),
      category: formData.get('category'),
      angle: formData.get('angle'),
      size: formData.get('size'),
      style: formData.get('style'),
      type: formData.get('type'),
      description: formData.get('description'),
      image: imagePath,
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('PRODUCT POST ERROR:', error)
    return NextResponse.json({ error: 'Create failed' }, { status: 500 })
  }
}

/* ================= UPDATE PRODUCT ================= */
export async function PUT(req: Request) {
  try {
    await connectDB()
    const formData = await req.formData()

    const id = formData.get('_id')
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID missing' },
        { status: 400 }
      )
    }

    const updateData: any = {
      clientId: String(formData.get('clientId')),
      productName: formData.get('productName'),
      category: formData.get('category'),
      angle: formData.get('angle'),
      size: formData.get('size'),
      style: formData.get('style'),
      type: formData.get('type'),
      description: formData.get('description'),
    }

    /* OPTIONAL IMAGE UPDATE */
    const file = formData.get('image') as File | null
    if (file) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const fileName = `${Date.now()}-${file.name}`
      const uploadDir = path.join(
        process.cwd(),
        'public/uploads/client-product'
      )

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      fs.writeFileSync(path.join(uploadDir, fileName), buffer)
      updateData.image = `/uploads/client-product/${fileName}`
    }

    const updatedProduct = await ClientProduct.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('PRODUCT PUT ERROR:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

/* ================= GET PRODUCTS ================= */
export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const clientId = searchParams.get('clientId')

    const products = await ClientProduct.find(
      clientId ? { clientId } : {}
    ).sort({ createdAt: 1 }) 

    return NextResponse.json(products)
  } catch (error) {
    console.error('PRODUCT GET ERROR:', error)
    return NextResponse.json([], { status: 500 })
  }
}

/* ================= DELETE PRODUCT ================= */
export async function DELETE(req: Request) {
  try {
    await connectDB()
    const { id } = await req.json()

    await ClientProduct.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PRODUCT DELETE ERROR:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
