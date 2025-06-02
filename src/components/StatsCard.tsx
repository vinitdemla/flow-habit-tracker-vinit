
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  gradient: string;
}

export const StatsCard = ({ title, value, icon, description, gradient }: StatsCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${gradient} text-white shadow-lg`}>
            {icon}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};
