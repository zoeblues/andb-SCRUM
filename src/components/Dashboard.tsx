import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Calendar, Users, Scissors, DollarSign, TrendingUp } from "lucide-react";

interface DashboardProps {
  appointments: any[];
  clients: any[];
  staff: any[];
}

export function Dashboard({ appointments, clients, staff }: DashboardProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.date === today);
  const thisMonth = new Date().getMonth();
  const thisMonthAppointments = appointments.filter(apt => 
    new Date(apt.date).getMonth() === thisMonth
  );
  
  const monthlyRevenue = thisMonthAppointments.reduce((sum, apt) => sum + apt.price, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2>Dashboard</h2>
        <p className="text-gray-600">Welcome back! Here's your salon overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{todayAppointments.length}</div>
            <p className="text-xs text-gray-600 mt-1">
              {appointments.filter(apt => apt.status === 'confirmed').length} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{clients.length}</div>
            <p className="text-xs text-gray-600 mt-1">
              +12 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Active Staff</CardTitle>
            <Scissors className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{staff.filter(s => s.status === 'active').length}</div>
            <p className="text-xs text-gray-600 mt-1">
              {staff.length} total stylists
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">${monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +18% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.length === 0 ? (
                <p className="text-gray-500">No appointments scheduled for today</p>
              ) : (
                todayAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p>{apt.clientName}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{apt.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{apt.time}</p>
                      <p className="text-sm text-gray-600">{apt.stylist}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clients.slice(0, 5).map((client) => (
                <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p>{client.name}</p>
                      <p className="text-sm text-gray-600">{client.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Last visit</p>
                    <p className="text-sm">{client.lastVisit}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
