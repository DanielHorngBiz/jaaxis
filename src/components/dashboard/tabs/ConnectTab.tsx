import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Frame, Instagram, Facebook, Store } from "lucide-react";
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

const ConnectTab = () => {
  const [storeType, setStoreType] = useState<"shopify" | "woocommerce">("shopify");
  const [step, setStep] = useState(1);
  const [accessLevel, setAccessLevel] = useState<"read" | "readwrite">("read");
  
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
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
        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
              <Store className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Store</h3>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              Connect your bot to a Store.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" onClick={() => setStep(1)}>Connect</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Connect Your Store</DialogTitle>
                </DialogHeader>
                
                {step === 1 ? (
                  <div className="space-y-6 pt-4">
                    {/* Platform Selection */}
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant={storeType === "shopify" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setStoreType("shopify")}
                      >
                        Shopify
                      </Button>
                      <Button
                        type="button"
                        variant={storeType === "woocommerce" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setStoreType("woocommerce")}
                      >
                        WooCommerce
                      </Button>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="storeUrl">Store URL</Label>
                        <Input
                          id="storeUrl"
                          type="url"
                          placeholder="https://example.com"
                        />
                      </div>

                      {storeType === "shopify" ? (
                        <div className="space-y-2">
                          <Label htmlFor="accessToken">Access Token</Label>
                          <Input
                            id="accessToken"
                            type="password"
                            placeholder="Enter your Shopify access token"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="consumerKey">Consumer Key</Label>
                            <Input
                              id="consumerKey"
                              type="text"
                              placeholder="Enter your WooCommerce consumer key"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="consumerSecret">Consumer Secret</Label>
                            <Input
                              id="consumerSecret"
                              type="password"
                              placeholder="Enter your WooCommerce consumer secret"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Next Button */}
                    <Button className="w-full" size="lg" onClick={() => setStep(2)}>
                      Next
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6 pt-4">
                    {/* Access Level Selection */}
                    <div className="space-y-3">
                      <Label>Access Level</Label>
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant={accessLevel === "read" ? "default" : "outline"}
                          className="flex-1"
                          onClick={() => setAccessLevel("read")}
                        >
                          Read Only
                        </Button>
                        <Button
                          type="button"
                          variant={accessLevel === "readwrite" ? "default" : "outline"}
                          className="flex-1"
                          onClick={() => setAccessLevel("readwrite")}
                        >
                          Read & Write
                        </Button>
                      </div>
                    </div>

                    {/* Order Status Field - Show only for Read & Write */}
                    {accessLevel === "readwrite" && (
                      <div className="space-y-2">
                        <Label htmlFor="orderStatus">Order Status AI Can Write</Label>
                        <Input
                          id="orderStatus"
                          type="text"
                          placeholder="e.g., processing, completed, cancelled"
                        />
                        <p className="text-xs text-muted-foreground">
                          Comma-separated list of order statuses the AI can modify
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1" 
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <Button className="flex-1" size="lg">
                        Connect {storeType === "shopify" ? "Shopify" : "WooCommerce"}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConnectTab;
