import Counter from '@/models/Counter'

export async function getNextId(name: string) {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  )

  return counter.seq
}
