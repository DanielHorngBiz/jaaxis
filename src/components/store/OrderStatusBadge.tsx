import { Badge } from "@/components/ui/badge";

type OrderStatus = 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-orange-500/20 text-orange-600 hover:bg-orange-500/30 border-orange-500/30' },
  processing: { label: 'Processing', className: 'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30 border-blue-500/30' },
  'on-hold': { label: 'On Hold', className: 'bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30 border-yellow-500/30' },
  completed: { label: 'Completed', className: 'bg-green-500/20 text-green-600 hover:bg-green-500/30 border-green-500/30' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-500/20 text-gray-600 hover:bg-gray-500/30 border-gray-500/30' },
  refunded: { label: 'Refunded', className: 'bg-purple-500/20 text-purple-600 hover:bg-purple-500/30 border-purple-500/30' },
  failed: { label: 'Failed', className: 'bg-red-500/20 text-red-600 hover:bg-red-500/30 border-red-500/30' },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
