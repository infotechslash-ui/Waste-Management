import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Recycle, TrendingUp, Award, Target } from 'lucide-react';

const DATA_BY_CATEGORY = [
  { name: 'Paper', value: 400, color: '#3b82f6' },
  { name: 'Plastic', value: 300, color: '#f59e0b' },
  { name: 'Metal', value: 200, color: '#71717a' },
  { name: 'Organic', value: 500, color: '#10b981' },
  { name: 'Glass', value: 150, color: '#a855f7' },
];

const WEEKLY_TREND = [
  { day: 'Mon', count: 12 },
  { day: 'Tue', count: 19 },
  { day: 'Wed', count: 15 },
  { day: 'Thu', count: 22 },
  { day: 'Fri', count: 30 },
  { day: 'Sat', count: 25 },
  { day: 'Sun', count: 18 },
];

const STATS = [
  { label: 'Total Scanned', value: '1,284', icon: <Recycle className="h-5 w-5" />, color: 'bg-blue-50 text-blue-600' },
  { label: 'Accuracy Rate', value: '98.2%', icon: <Target className="h-5 w-5" />, color: 'bg-green-50 text-green-600' },
  { label: 'CO2 Saved', value: '420kg', icon: <TrendingUp className="h-5 w-5" />, color: 'bg-orange-50 text-orange-600' },
  { label: 'Eco Rank', value: '#12', icon: <Award className="h-5 w-5" />, color: 'bg-purple-50 text-purple-600' },
];

export function Analytics() {
  return (
    <div className="space-y-12 py-12">
      <div className="text-center space-y-4">
        <h2 className="font-heading text-4xl font-bold text-primary">Your Eco Impact</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Track your recycling progress and see how your sorting habits contribute to a healthier planet.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-border bg-card">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Category Distribution */}
        <Card className="border-border bg-card overflow-hidden">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Waste Distribution</CardTitle>
            <CardDescription>Breakdown of waste types scanned over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DATA_BY_CATEGORY}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {DATA_BY_CATEGORY.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {DATA_BY_CATEGORY.map((cat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-semibold">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-muted-foreground">{cat.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card className="border-border bg-card overflow-hidden">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Weekly Activity</CardTitle>
            <CardDescription>Number of scans performed each day this week.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_TREND}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAE3D9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#7D6B5D' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#7D6B5D' }}
                />
                <Tooltip 
                  cursor={{ fill: '#FDFCF8' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#5A6D55" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
