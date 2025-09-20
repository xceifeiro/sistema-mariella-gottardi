"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface TemperamentStat {
  temperamento: string
  quantidade: number
}

interface AdminDashboardChartsProps {
  temperamentStats: TemperamentStat[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export function AdminDashboardCharts({ temperamentStats }: AdminDashboardChartsProps) {
  // Preparar dados para o gráfico
  const chartData = temperamentStats.map((stat, index) => ({
    name: stat.temperamento || "Não definido",
    value: stat.quantidade,
    fill: COLORS[index % COLORS.length],
  }))

  return (
    <Card className="card-hover border-0 shadow-xl glass-dark">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-slate-100">
          <div className="w-8 h-8 glass-effect rounded-lg flex items-center justify-center">
            📊
          </div>
          Distribuição de Temperamentos
        </CardTitle>
        <p className="text-slate-300 text-sm">Análise dos temperamentos identificados</p>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="space-y-6">
            {/* Gráfico de Pizza */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfico de Barras */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80} 
                    fontSize={12}
                    stroke="rgba(255, 255, 255, 0.7)"
                  />
                  <YAxis stroke="rgba(255, 255, 255, 0.7)" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Bar dataKey="value" fill="url(#colorGradient)" />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 glass-effect rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-4xl">📊</div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Nenhum dado disponível</h3>
            <p className="text-white/70 text-sm">Complete algumas análises para ver os gráficos</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
