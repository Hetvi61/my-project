import { Card, CardContent } from "@/components/ui/card"

export default function AdminPage() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4 font-semibold">
          Total Users: 120
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 font-semibold">
          Orders: 45
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 font-semibold">
          Revenue: ₹25,000
        </CardContent>
      </Card>
    </div>
  )
}
