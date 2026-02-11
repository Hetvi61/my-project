import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ClientAddress from '@/models/ClientAddress'

/* GET ALL ADDRESSES */
export async function GET() {
  await connectDB()

  const addresses = await ClientAddress.find()
    .sort({ _id: 1 })

  return NextResponse.json(addresses)
}

/* SAVE ADDRESS */
export async function POST(req: Request) {
  await connectDB()

  const { clientId, clientName, addressType, address } = await req.json()

  if (!clientId || !clientName || !addressType || !address) {
    return NextResponse.json(
      { error: 'All fields are required' },
      { status: 400 }
    )
  }

  const saved = await ClientAddress.create({
    clientId,
    clientName,   // SAVE NAME
    addressType,
    address,
  })

  return NextResponse.json(saved)
}
