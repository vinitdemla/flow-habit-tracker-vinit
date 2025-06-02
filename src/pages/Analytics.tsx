
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';

const Analytics = () => {
  const weeklyData = [
    { day: 'Sun', value: 0 },
    { day: 'Mon', value: 0 },
    { day: 'Tue', value: 1 },
    { day: 'Wed', value: 0 },
    { day: 'Thu', value: 0 },
    { day: 'Fri', value: 0 },
    { day: 'Sat', value: 0 },
  ];

  const completionRateData = [
    { week: 'Week 1', rate: 0 },
    { week: 'Week 2', rate: 5 },
    { week: 'Week 3', rate: 8 },
    { week: 'Week 4', rate: 12 },
    { week: 'Week 5', rate: 15 },
    { week: 'Week 6', rate: 18 },
  ];

  const timeOfDayData = [
    { time: '1AM', rate: 0 },
    { time: '3AM', rate: 0.95 },
    { time: '5AM', rate: 0 },
    { time: '7AM', rate: 0 },
    { time: '9AM', rate: 0 },
    { time: '11AM', rate: 0 },
    { time: '1PM', rate: 0 },
    { time: '3PM', rate: 0 },
    { time: '5PM', rate: 0 },
    { time: '7PM', rate: 0 },
    { time: '9PM', rate: 0 },
    { time: '11PM', rate: 0 },
  ];

  const chartConfig = {
    rate: {
      label: 'Rate',
      color: '#3B82F6',
    },
    value: {
      label: 'Value',
      color: '#3B82F6',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <Select defaultValue="weekly">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly View</SelectItem>
              <SelectItem value="monthly">Monthly View</SelectItem>
              <SelectItem value="yearly">Yearly View</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <LineChart data={completionRateData}>
                  <XAxis 
                    dataKey="week" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    domain={[0, 25]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    dataKey="rate" 
                    stroke="#000000" 
                    strokeWidth={2}
                    dot={{ fill: '#000000', strokeWidth: 2, r: 4 }}
                    type="monotone"
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Success Rate by Time of Day</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <BarChart data={timeOfDayData}>
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    domain={[0, 1]}
                    tickFormatter={(value) => value.toFixed(2)}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="rate" 
                    fill="#3B82F6" 
                    radius={[2, 2, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <BarChart data={weeklyData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  domain={[0, 1]}
                  ticks={[0, 0.25, 0.5, 0.75, 1]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="value" 
                  fill="#3B82F6" 
                  radius={[2, 2, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
