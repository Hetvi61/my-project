import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ClientPalette from '@/models/ClientPalette'

// ================= CREATE =================
export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    // 🔴 IMPORTANT: deactivate all palettes of same client
    await ClientPalette.updateMany(
      { clientId: body.clientId },
      { $set: { isActive: false } }
    )

    const palette = await ClientPalette.create({
      clientId: body.clientId,
      clientName: body.clientName,
      paletteName: body.paletteName,
      allColors: body.allColors,
      colors: body.colors,
      isActive: true, // ✅ new palette always active
    })

    return NextResponse.json({ success: true, data: palette })
  } catch (error) {
    console.error('Palette Save Error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

// ================= LIST =================
export async function GET() {
  await connectDB()
  const palettes = await ClientPalette.find().sort({ createdAt: 1 })
  return NextResponse.json(palettes)
}

// ================= UPDATE (EDIT + ACTIVATE) =================
export async function PUT(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    const palette = await ClientPalette.findById(body._id)
    if (!palette) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // ================= ACTIVATE PALETTE =================
    // If paletteName NOT present → make this palette active
    if (!body.paletteName) {
      //  deactivate all other palettes of same client
      await ClientPalette.updateMany(
        { clientId: palette.clientId },
        { $set: { isActive: false } }
      )

      //  activate selected palette
      palette.isActive = true
      await palette.save()

      return NextResponse.json({ success: true, mode: 'activate' })
    }

    // ================= EDIT PALETTE =================
    palette.paletteName = body.paletteName
    palette.allColors = body.allColors
    palette.colors = body.colors

    await palette.save()

    return NextResponse.json({ success: true, mode: 'edit' })
  } catch (error) {
    console.error('Palette PUT Error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

// ================= DELETE =================
export async function DELETE(req: Request) {
  try {
    await connectDB()
    const { id } = await req.json()

    await ClientPalette.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Palette DELETE Error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
