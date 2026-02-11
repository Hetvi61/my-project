import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Client from '@/models/clients'
import { getNextId } from '@/lib/getNextId'

// =======================
// GET CLIENT LIST
// =======================
export async function GET() {
  try {
    await connectDB()
    const clients = await Client.find().sort({ createdAt: 1 })
    return NextResponse.json(clients)
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

// =======================
// ADD CLIENT
// =======================
export async function POST(req: Request) {
  try {
    await connectDB()
    const data = await req.json()

    if (!data.clientName && !data.companyName) {
      return NextResponse.json(
        { error: 'Client name required' },
        { status: 400 }
      )
    }

    if (data.email) {
      const exists = await Client.findOne({ email: data.email })
      if (exists) {
        return NextResponse.json(
          { error: 'Client with this email already exists' },
          { status: 409 }
        )
      }
    }

    const nextClientId = await getNextId('client')

    const client = await Client.create({
      clientId: nextClientId,
      clientName: (data.clientName || data.companyName || '').trim(),
      email: data.email || '',
      phone: data.phone || '',
      mobile: data.mobile || '',
      businessCategory: data.businessCategory || '',
      clientGroup: data.clientGroup || '',
      targetAudience: data.targetAudience || '',
      website: data.website || '',
      services: data.services || '',
      productDetails: data.productDetails || '',
      demographics: data.demographics || '',
    })

    return NextResponse.json(client, { status: 201 })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to save client' },
      { status: 500 }
    )
  }
}

// =======================
// UPDATE CLIENT ( FIXED)
// =======================
export async function PUT(req: Request) {
  try {
    await connectDB()
    const data = await req.json()

    //  FIX: accept "id" from frontend
    if (!data.id) {
      return NextResponse.json(
        { error: 'Client ID required' },
        { status: 400 }
      )
    }

    const updated = await Client.findByIdAndUpdate(
      data.id, //  correct
      {
        clientName: data.clientName || '',
        email: data.email || '',
        phone: data.phone || '',
        mobile: data.mobile || '',
        businessCategory: data.businessCategory || '',
        clientGroup: data.clientGroup || '',
        targetAudience: data.targetAudience || '',
        website: data.website || '',
        services: data.services || '',
        productDetails: data.productDetails || '',
        demographics: data.demographics || '',
      },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updated)
  } catch (err: any) {
    console.error('PUT client error:', err)
    return NextResponse.json(
      { error: err.message || 'Update failed' },
      { status: 500 }
    )
  }
}

// =======================
// DELETE CLIENT
// =======================
export async function DELETE(req: Request) {
  try {
    await connectDB()
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Client ID required' },
        { status: 400 }
      )
    }

    await Client.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Delete failed' },
      { status: 500 }
    )
  }
}
