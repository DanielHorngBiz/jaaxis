import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Frame, Instagram, Facebook, Store, Settings } from "lucide-react";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ConnectTab = () => {
  const [storeType, setStoreType] = useState<"shopify" | "woocommerce">("shopify");
  const [step, setStep] = useState(1);
  const [accessLevel, setAccessLevel] = useState<"read" | "readwrite">("read");
  const [isStoreConnected, setIsStoreConnected] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [storeUrl, setStoreUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [fulfillmentStatus, setFulfillmentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [loadingFulfillment, setLoadingFulfillment] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const { toast } = useToast();

  const fetchStatuses = async (statusType: 'payment' | 'fulfillment' | 'order') => {
    // Set loading state for specific button
    if (statusType === 'payment') setLoadingPayment(true);
    else if (statusType === 'fulfillment') setLoadingFulfillment(true);
    else setLoadingOrder(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-store-statuses', {
        body: {
          storeType,
          storeUrl,
          accessToken,
          consumerKey,
          consumerSecret,
        },
      });

      if (error) throw error;

      if (storeType === "shopify") {
        if (statusType === 'payment') {
          setPaymentStatus(data.paymentStatuses);
        } else if (statusType === 'fulfillment') {
          setFulfillmentStatus(data.fulfillmentStatuses);
        }
        toast({
          title: "Success",
          description: "Statuses loaded successfully",
        });
      } else {
        setOrderStatus(data.orderStatuses);
        toast({
          title: "Success",
          description: "Statuses loaded successfully",
        });
      }
    } catch (error) {
      console.error('Error fetching statuses:', error);
      toast({
        title: "Error",
        description: "Failed to fetch statuses. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      if (statusType === 'payment') setLoadingPayment(false);
      else if (statusType === 'fulfillment') setLoadingFulfillment(false);
      else setLoadingOrder(false);
    }
  };

  const handleConnect = () => {
    console.log("Connecting to store:", { storeType, accessLevel, paymentStatus, fulfillmentStatus, orderStatus });
    setIsStoreConnected(true);
    setIsDialogOpen(false);
    setStep(1);
  };

  const handleDisconnect = () => {
    setIsStoreConnected(false);
    setStoreType("shopify");
    setAccessLevel("read");
    setPaymentStatus("");
    setFulfillmentStatus("");
    setOrderStatus("");
    setStoreUrl("");
    setAccessToken("");
    setConsumerKey("");
    setConsumerSecret("");
  };

  const openSettingsDialog = () => {
    setStep(2);
    setIsDialogOpen(true);
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Integration Options</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Connect your bot to various platforms and embed it on your website
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chat Widget */}
        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
              <MessageCircle className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Chat Widget</h3>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              Embed a collapsible chat widget on your website.
            </p>
            <Button variant="outline" className="w-full">Get Code</Button>
          </CardContent>
        </Card>

        {/* Chat iframe */}
        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4">
              <Frame className="w-7 h-7 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Chat iframe</h3>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              Embed via iframe for flexible placement.
            </p>
            <Button variant="outline" className="w-full">Get Code</Button>
          </CardContent>
        </Card>

        {/* Connect Meta Platforms */}
        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="flex gap-2 mb-4">
              <div className="w-14 h-14 rounded-xl bg-blue-600/10 flex items-center justify-center">
                <Facebook className="w-7 h-7 text-blue-600" />
              </div>
              <div className="w-14 h-14 rounded-xl bg-pink-500/10 flex items-center justify-center">
                <Instagram className="w-7 h-7 text-pink-600" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Connect Meta Platforms</h3>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              Connect to Messenger and Instagram.
            </p>
            <Button variant="outline" className="w-full">Connect</Button>
          </CardContent>
        </Card>

        {/* Store */}
        <Card className="relative">
          <CardContent className="p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Store className="w-7 h-7 text-green-600" />
              </div>
              {isStoreConnected && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 -mt-1 -mr-1 [&_svg]:size-8"
                  onClick={openSettingsDialog}
                >
                  <Settings />
                </Button>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-2">Store</h3>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              Connect your bot to a Store.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              {!isStoreConnected && (
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" onClick={() => setStep(1)}>Connect</Button>
                </DialogTrigger>
              )}
              <DialogContent className="sm:max-w-[540px] p-0 gap-0">
                {/* Step indicator at top */}
                <div className="px-8 pt-6 pb-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                        step === 1 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-muted-foreground'
                      }`}>
                        1
                      </div>
                      <span className={`text-xs font-medium transition-colors ${
                        step === 1
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}>
                        Connect
                      </span>
                    </div>
                    <div className="w-8 h-px bg-border mb-5" />
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                        step === 2 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-muted-foreground'
                      }`}>
                        2
                      </div>
                      <span className={`text-xs font-medium transition-colors ${
                        step === 2
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}>
                        Access
                      </span>
                    </div>
                  </div>
                </div>

                {step === 1 ? (
                  <div className="px-8 py-6 space-y-6">
                    {/* Heading */}
                    <h2 className="text-xl font-semibold">
                      {step === 1 ? 'Connect Your Store' : 'Select Access Level'}
                    </h2>
                    
                    {/* Platform Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Platform</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setStoreType("shopify")}
                          className={`h-11 px-4 rounded-lg border-2 transition-all text-center font-medium text-sm ${
                            storeType === "shopify"
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          Shopify
                        </button>
                        <button
                          type="button"
                          onClick={() => setStoreType("woocommerce")}
                          className={`h-11 px-4 rounded-lg border-2 transition-all text-center font-medium text-sm ${
                            storeType === "woocommerce"
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          WooCommerce
                        </button>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="storeUrl" className="text-sm font-medium">Store URL</Label>
                        <Input
                          id="storeUrl"
                          type="url"
                          placeholder="https://example.com"
                          className="h-11"
                          value={storeUrl}
                          onChange={(e) => setStoreUrl(e.target.value)}
                        />
                      </div>

                      {storeType === "shopify" ? (
                        <div className="space-y-2">
                          <Label htmlFor="accessToken" className="text-sm font-medium">Access Token</Label>
                          <Input
                            id="accessToken"
                            type="password"
                            placeholder="Enter your Shopify access token"
                            className="h-11"
                            value={accessToken}
                            onChange={(e) => setAccessToken(e.target.value)}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="consumerKey" className="text-sm font-medium">Consumer Key</Label>
                            <Input
                              id="consumerKey"
                              type="text"
                              placeholder="Enter your WooCommerce consumer key"
                              className="h-11"
                              value={consumerKey}
                              onChange={(e) => setConsumerKey(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="consumerSecret" className="text-sm font-medium">Consumer Secret</Label>
                            <Input
                              id="consumerSecret"
                              type="password"
                              placeholder="Enter your WooCommerce consumer secret"
                              className="h-11"
                              value={consumerSecret}
                              onChange={(e) => setConsumerSecret(e.target.value)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="px-8 py-6 space-y-6">
                    {/* Heading */}
                    <h2 className="text-xl font-semibold">
                      {step === 1 ? 'Connect Your Store' : 'Select Access Level'}
                    </h2>
                    
                    {/* Access Level Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Access Level</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setAccessLevel("read")}
                          className={`h-11 px-4 rounded-lg border-2 transition-all text-center font-medium text-sm ${
                            accessLevel === "read"
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          Read Only
                        </button>
                        <button
                          type="button"
                          onClick={() => setAccessLevel("readwrite")}
                          className={`h-11 px-4 rounded-lg border-2 transition-all text-center font-medium text-sm ${
                            accessLevel === "readwrite"
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          Read & Write
                        </button>
                      </div>
                    </div>

                    {/* Status Fields - Show only for Read & Write */}
                    {accessLevel === "readwrite" && (
                      storeType === "shopify" ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="paymentStatus" className="text-sm font-medium">
                                Payment Status AI Can Write
                              </Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs px-2"
                                onClick={() => fetchStatuses('payment')}
                                disabled={loadingPayment}
                              >
                                {loadingPayment ? "Loading..." : "Get all statuses"}
                              </Button>
                            </div>
                            <Input
                              id="paymentStatus"
                              type="text"
                              placeholder="pending, authorized, paid"
                              className="h-11"
                              value={paymentStatus}
                              onChange={(e) => setPaymentStatus(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="fulfillmentStatus" className="text-sm font-medium">
                                Fulfillment Status AI Can Write
                              </Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs px-2"
                                onClick={() => fetchStatuses('fulfillment')}
                                disabled={loadingFulfillment}
                              >
                                {loadingFulfillment ? "Loading..." : "Get all statuses"}
                              </Button>
                            </div>
                            <Input
                              id="fulfillmentStatus"
                              type="text"
                              placeholder="unfulfilled, partial, fulfilled"
                              className="h-11"
                              value={fulfillmentStatus}
                              onChange={(e) => setFulfillmentStatus(e.target.value)}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="orderStatus" className="text-sm font-medium">
                              Order Status AI Can Write
                            </Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs px-2"
                              onClick={() => fetchStatuses('order')}
                              disabled={loadingOrder}
                            >
                              {loadingOrder ? "Loading..." : "Get all statuses"}
                            </Button>
                          </div>
                          <Input
                            id="orderStatus"
                            type="text"
                            placeholder="processing, completed, cancelled"
                            className="h-11"
                            value={orderStatus}
                            onChange={(e) => setOrderStatus(e.target.value)}
                          />
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="px-8 py-4 border-t bg-muted/30">
                  <div className="flex gap-3 justify-end">
                    {step === 2 && (
                      <Button 
                        variant="outline" 
                        className="h-11" 
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                    )}
                    <Button 
                      className="h-11" 
                      onClick={() => step === 1 ? setStep(2) : handleConnect()}
                    >
                      {step === 1 ? 'Next' : 'Connect'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {isStoreConnected && (
              <Button variant="secondary" className="w-full" onClick={handleDisconnect}>
                Disconnect
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConnectTab;
