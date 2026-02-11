import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ClientLogo from '@/models/ClientLogo'
import Client from '@/models/clients'
import path from 'path'
import fs from 'fs'

export const runtime = 'nodejs'

// =======================
// GET ALL LOGOS (NEW LAST)
// =======================
export async function GET() {
  await connectDB()
  const logos = await ClientLogo.find().sort({ createdAt: 1 })
  return NextResponse.json(logos)
}

// =======================
// CREATE MULTIPLE LOGOS
// =======================
export async function POST(req: Request) {
  await connectDB()

  const formData = await req.formData()

  const clientId = formData.get('clientId') as string
  const logoName = formData.get('logoName') as string
  const files = formData.getAll('files') as File[]

  if (!clientId || !logoName || !files || files.length === 0) {
    return NextResponse.json(
      { error: 'Client, Logo Name and at least one file required' },
      { status: 400 }
    )
  }

  const client = await Client.findById(clientId).lean()
  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  const clientName =
    client.clientName ||
    client.ClientName ||
    client.companyName ||
    client.name ||
    'Unknown'

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  //  IMPORTANT: deactivate existing logos of this client
  await ClientLogo.updateMany(
    { clientId },
    { $set: { status: 'inactive' } }
  )

  const savedLogos = []

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer())

    const fileName = `${Date.now()}-${file.name}`
    const filePath = path.join(uploadDir, fileName)

    fs.writeFileSync(filePath, buffer)

    const created = await ClientLogo.create({
      clientId,
      clientName,
      logoName,
      logoUrl: `/uploads/${fileName}`,
      status: 'active', //  only new logo active
    })

    savedLogos.push(created)
  }

  return NextResponse.json(savedLogos, { status: 201 })
}

// =======================
// UPDATE SINGLE LOGO (EDIT)
// =======================
export async function PUT(req: Request) {
  await connectDB()

  const formData = await req.formData()

  const id = formData.get('id') as string
  const clientId = formData.get('clientId') as string
  const logoName = formData.get('logoName') as string
  const file = formData.get('file') as File | null

  if (!id || !clientId || !logoName) {
    return NextResponse.json(
      { error: 'ID, Client and Logo Name required' },
      { status: 400 }
    )
  }

  const client = await Client.findById(clientId).lean()
  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  const clientName =
    client.clientName ||
    client.ClientName ||
    client.companyName ||
    client.name ||
    'Unknown'

  let logoUrl: string | undefined

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer())

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const fileName = `${Date.now()}-${file.name}`
    const filePath = path.join(uploadDir, fileName)

    fs.writeFileSync(filePath, buffer)
    logoUrl = `/uploads/${fileName}`
  }

  const update: any = {
    clientId,
    clientName,
    logoName,
  }

  if (logoUrl) update.logoUrl = logoUrl

  const updated = await ClientLogo.findByIdAndUpdate(id, update, {
    new: true,
  })

  return NextResponse.json(updated)
}

// =======================
// ACTIVATE LOGO (ONLY ONE)
// =======================
export async function PATCH(req: Request) {
  try {
    await connectDB()

    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'Logo ID required' }, { status: 400 })
    }

    const logo = await ClientLogo.findById(id)
    if (!logo) {
      return NextResponse.json({ error: 'Logo not found' }, { status: 404 })
    }

    //  deactivate other logos of same client
    await ClientLogo.updateMany(
      { clientId: logo.clientId },
      { $set: { status: 'inactive' } }
    )

    //  activate selected logo
    logo.status = 'active'
    await logo.save()

    return NextResponse.json({
      success: true,
      status: logo.status,
    })
  } catch (err: any) {
    console.error('PATCH client-logo error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to update status' },
      { status: 500 }
    )
  }
}

// =======================
// DELETE LOGO
// =======================
export async function DELETE(req: Request) {
  try {
    await connectDB()

    const { id } = await req.json()
    if (!id) {
      return NextResponse.json(
        { error: 'Logo ID required' },
        { status: 400 }
      )
    }

    const logo = await ClientLogo.findById(id)
    if (!logo) {
      return NextResponse.json(
        { error: 'Logo not found' },
        { status: 404 }
      )
    }

    if (logo.logoUrl) {
      const cleanPath = logo.logoUrl.replace('/uploads/', '')
      const filePath = path.join(process.cwd(), 'public', 'uploads', cleanPath)

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    await ClientLogo.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('DELETE client-logo error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to delete logo' },
      { status: 500 }
    )
  }
}
