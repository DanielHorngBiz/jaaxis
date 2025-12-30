import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { format } from "date-fns";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  billing_name: string;
  billing_phone: string | null;
  billing_email: string | null;
  billing_address: string | null;
  shipping_name: string | null;
  shipping_phone: string | null;
  shipping_email: string | null;
  shipping_address: string | null;
  items: OrderItem[];
  metadata: Record<string, unknown>;
  order_total: number;
  created_at: string;
  updated_at: string;
}

interface OrdersTableProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export function OrdersTable({ orders, onSelectOrder }: OrdersTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onSelectOrder(order)}
            >
              <TableCell className="font-medium">{order.order_number}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status as any} />
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{order.billing_name}</div>
                  <div className="text-sm text-muted-foreground">{order.billing_email}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                ${Number(order.order_total).toFixed(2)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(order.created_at), 'MMM d, yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
