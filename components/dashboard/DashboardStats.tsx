import { Ticket, HardDrive, CheckCircle, Clock, Wrench } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  icon: React.ElementType
  color: string
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

interface DashboardStatsProps {
  stats: {
    totalTickets: number
    openTickets: number
    inProgressTickets: number
    resolvedTickets: number
    devicesUnderMaintenance: number
    totalDevices: number
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        title="Total Tickets"
        value={stats.totalTickets}
        icon={Ticket}
        color="bg-blue-500"
      />
      <StatCard
        title="Open Tickets"
        value={stats.openTickets}
        icon={Clock}
        color="bg-yellow-500"
      />
      <StatCard
        title="In Progress"
        value={stats.inProgressTickets}
        icon={Wrench}
        color="bg-orange-500"
      />
      <StatCard
        title="Resolved Tickets"
        value={stats.resolvedTickets}
        icon={CheckCircle}
        color="bg-green-500"
      />
      <StatCard
        title="Total Devices"
        value={stats.totalDevices}
        icon={HardDrive}
        color="bg-purple-500"
      />
      <StatCard
        title="Under Maintenance"
        value={stats.devicesUnderMaintenance}
        icon={Wrench}
        color="bg-red-500"
      />
    </div>
  )
}
