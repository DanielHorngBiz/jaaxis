import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OrdersTable } from "@/components/store/OrdersTable";
import { OrderEditDialog } from "@/components/store/OrderEditDialog";
import { Loader2, ShoppingCart } from "lucide-react";

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

export default function Store() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      // Parse items from JSONB with proper typing
      const parsedOrders = (data || []).map((order) => ({
        ...order,
        items: (Array.isArray(order.items) ? order.items : []) as unknown as OrderItem[],
        metadata: (typeof order.metadata === 'object' && order.metadata !== null ? order.metadata : {}) as Record<string, unknown>,
      }));
      setOrders(parsedOrders);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Store Orders</h1>
            <p className="text-muted-foreground">Development testing page - {orders.length} orders</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No orders found.
          </div>
        ) : (
          <OrdersTable orders={orders} onSelectOrder={handleSelectOrder} />
        )}

        <OrderEditDialog
          order={selectedOrder}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={fetchOrders}
        />
      </div>
    </div>
  );
}
