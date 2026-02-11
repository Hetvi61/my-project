import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ClientOwner from '@/models/ClientOwner'

export async function GET(req: Request) {
  await connectDB()

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')

  let filter: any = {}

  if (q) {
    filter = {
      $or: [
        { ownerName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { mobile: { $regex: q, $options: 'i' } },
        { clientName: { $regex: q, $options: 'i' } },
      ],
    }
  }

  const owners = await ClientOwner.find(filter)
    .populate('clientId')   //  FULL POPULATE
    .sort({ createdAt: 1, _id: 1 })

  // HARD NORMALIZE (DEBUG + FIX)
  const normalized = owners.map((o: any) => {
    const obj = o.toObject()

    

    return {
      ...obj,
      clientName:
        obj.clientName ||
        obj.clientId?.clientName ||
        obj.clientId?.ClientName ||
        obj.clientId?.companyName ||
        obj.clientId?.name ||
        '',
    }
  })

  return NextResponse.json(normalized)
}

export async function POST(req: Request) {
  await connectDB()

  const { clientId, ownerName, email, mobile } = await req.json()

  if (!clientId || !ownerName) {
    return NextResponse.json(
      { error: 'Client and Owner Name are required' },
      { status: 400 }
    )
  }

  //  GET CLIENT NAME SAFELY
  const Client = (await import('@/models/clients')).default
  const client = await Client.findById(clientId).lean()

  if (!client) {
    return NextResponse.json(
      { error: 'Client not found' },
      { status: 404 }
    )
  }

  const resolvedClientName =
    client.clientName ||
    client.ClientName ||
    client.companyName ||
    client.name

  if (!resolvedClientName) {
    return NextResponse.json(
      { error: 'Client name missing in Client record' },
      { status: 500 }
    )
  }

  const owner = await ClientOwner.create({
    clientId,
    clientName: resolvedClientName,  //  ALWAYS SAVED
    ownerName,
    email,
    mobile,
  })

  return NextResponse.json(owner)
}
