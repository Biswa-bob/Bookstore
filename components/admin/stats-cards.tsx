import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Book, DollarSign, Package } from "lucide-react"
import type { AdminStats } from "@/lib/admin"

interface StatsCardsProps {
  stats: AdminStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Books",
      value: stats.totalBooks.toString(),
      icon: Book,
      description: "Books in catalog",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: BarChart3,
      description: "Orders processed",
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "Total revenue",
    },
    {
      title: "Low Stock",
      value: stats.lowStockBooks.toString(),
      icon: Package,
      description: "Books with <10 stock",
      alert: stats.lowStockBooks > 0,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className={card.alert ? "border-orange-200" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.alert ? "text-orange-600" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.alert ? "text-orange-600" : ""}`}>{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
