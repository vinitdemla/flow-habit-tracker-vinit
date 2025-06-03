
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
  LineChart, 
  Line 
} from 'recharts';

const Analytics = () => {
  const weeklyData = [
    { day: 'Sun', value: 0, completions: 0 },
    { day: 'Mon', value: 0.8, completions: 4 },
    { day: 'Tue', value: 1, completions: 5 },
    { day: 'Wed', value: 0.6, completions: 3 },
    { day: 'Thu', value: 0.4, completions: 2 },
    { day: 'Fri', value: 0.2, completions: 1 },
    { day: 'Sat', value: 0, completions: 0 },
  ];

  const completionRateData = [
    { week: 'Week 1', rate: 20 },
    { week: 'Week 2', rate: 35 },
    { week: 'Week 3', rate: 45 },
    { week: 'Week 4', rate: 60 },
    { week: 'Week 5', rate: 75 },
    { week: 'Week 6', rate: 80 },
  ];

  const timeOfDayData = [
    { time: '6AM', rate: 25 },
    { time: '8AM', rate: 40 },
    { time: '10AM', rate: 60 },
    { time: '12PM', rate: 45 },
    { time: '2PM', rate: 30 },
    { time: '4PM', rate: 35 },
    { time: '6PM', rate: 55 },
    { time: '8PM', rate: 70 },
    { time: '10PM', rate: 20 },
  ];

  const chartConfig = {
    rate: {
      label: 'Success Rate (%)',
      color: '#3B82F6',
    },
    value: {
      label: 'Completion Rate',
      color: '#3B82F6',
    },
    completions: {
      label: 'Completions',
      color: '#10B981',
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
              <CardTitle>Completion Rate Trend</CardTitle>
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
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`${value}%`, 'Success Rate']}
                  />
                  <Line 
                    dataKey="rate" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
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
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`${value}%`, 'Success Rate']}
                  />
                  <Bar 
                    dataKey="rate" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress Overview</CardTitle>
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
                  domain={[0, 'dataMax']}
                  tickFormatter={(value) => Math.round(value)}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [
                    Math.round(value as number), 
                    name === 'completions' ? 'Completions' : 'Rate'
                  ]}
                />
                <Bar 
                  dataKey="completions" 
                  fill="#10B981" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
