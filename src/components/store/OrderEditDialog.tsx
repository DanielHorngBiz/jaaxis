import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface OrderEditDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

const ORDER_STATUSES = [
  'pending',
  'processing',
  'on-hold',
  'completed',
  'cancelled',
  'refunded',
  'failed',
] as const;

export function OrderEditDialog({ order, open, onOpenChange, onSave }: OrderEditDialogProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Order>>({});
  const [items, setItems] = useState<OrderItem[]>([]);
  const [metadata, setMetadata] = useState<Record<string, string>>({});

  useEffect(() => {
    if (order) {
      setFormData(order);
      setItems(order.items || []);
      setMetadata({
        tracking_number: (order.metadata?.tracking_number as string) || '',
        carrier: (order.metadata?.carrier as string) || '',
      });
    }
  }, [order]);

  const calculateTotal = (orderItems: OrderItem[]) => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items];
    if (field === 'qty' || field === 'price') {
      const numValue = parseFloat(value as string) || 0;
      newItems[index] = {
        ...newItems[index],
        [field]: numValue,
        total: field === 'qty' 
          ? numValue * newItems[index].price 
          : newItems[index].qty * numValue,
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', qty: 1, price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!order) return;
    setSaving(true);

    try {
      const orderTotal = calculateTotal(items);
      const updatedMetadata = { ...order.metadata };
      
      if (metadata.tracking_number) {
        updatedMetadata.tracking_number = metadata.tracking_number;
      }
      if (metadata.carrier) {
        updatedMetadata.carrier = metadata.carrier;
      }

      const { error } = await supabase
        .from('orders')
        .update({
          status: formData.status as 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed',
          billing_name: formData.billing_name,
          billing_phone: formData.billing_phone,
          billing_email: formData.billing_email,
          billing_address: formData.billing_address,
          shipping_name: formData.shipping_name,
          shipping_phone: formData.shipping_phone,
          shipping_email: formData.shipping_email,
          shipping_address: formData.shipping_address,
          items: JSON.parse(JSON.stringify(items)),
          metadata: JSON.parse(JSON.stringify(updatedMetadata)),
          order_total: orderTotal,
        })
        .eq('id', order.id);

      if (error) throw error;

      toast({ title: "Order updated", description: `Order ${order.order_number} has been updated.` });
      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating order:', error);
      toast({ title: "Error", description: "Failed to update order.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Order {order.order_number}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tracking Number</Label>
              <Input
                value={metadata.tracking_number}
                onChange={(e) => setMetadata({ ...metadata, tracking_number: e.target.value })}
                placeholder="e.g., 1Z999AA10123456784"
              />
            </div>

            <div className="space-y-2">
              <Label>Carrier</Label>
              <Input
                value={metadata.carrier}
                onChange={(e) => setMetadata({ ...metadata, carrier: e.target.value })}
                placeholder="e.g., UPS, USPS, FedEx"
              />
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.billing_name || ''}
                onChange={(e) => setFormData({ ...formData, billing_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.billing_phone || ''}
                onChange={(e) => setFormData({ ...formData, billing_phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.billing_email || ''}
                onChange={(e) => setFormData({ ...formData, billing_email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea
                value={formData.billing_address || ''}
                onChange={(e) => setFormData({ ...formData, billing_address: e.target.value })}
              />
            </div>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={formData.shipping_name || ''}
                onChange={(e) => setFormData({ ...formData, shipping_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.shipping_phone || ''}
                onChange={(e) => setFormData({ ...formData, shipping_phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.shipping_email || ''}
                onChange={(e) => setFormData({ ...formData, shipping_email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea
                value={formData.shipping_address || ''}
                onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
              />
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-4 mt-4">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-end p-3 border rounded-lg">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Item Name</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      placeholder="Product name"
                    />
                  </div>
                  <div className="w-20 space-y-1">
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                    />
                  </div>
                  <div className="w-24 space-y-1">
                    <Label className="text-xs">Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                    />
                  </div>
                  <div className="w-24 space-y-1">
                    <Label className="text-xs">Total</Label>
                    <Input
                      value={`$${item.total.toFixed(2)}`}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addItem} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>

            <div className="flex justify-end pt-4 border-t">
              <div className="text-lg font-semibold">
                Total: ${calculateTotal(items).toFixed(2)}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
