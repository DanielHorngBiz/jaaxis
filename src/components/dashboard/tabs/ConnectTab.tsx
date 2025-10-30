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
              <DialogContent className="sm:max-w-[540px] p-0 gap-0">
                {/* Step indicator at top */}
                <div className="px-8 pt-6 pb-4">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      step === 1 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-muted-foreground'
                    }`}>
                      1
                    </div>
                    <div className="w-12 h-px bg-border" />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      step === 2 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-muted-foreground'
                    }`}>
                      2
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
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="consumerSecret" className="text-sm font-medium">Consumer Secret</Label>
                            <Input
                              id="consumerSecret"
                              type="password"
                              placeholder="Enter your WooCommerce consumer secret"
                              className="h-11"
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

                    {/* Order Status Field - Show only for Read & Write */}
                    {accessLevel === "readwrite" && (
                      <div className="space-y-2">
                        <Label htmlFor="orderStatus" className="text-sm font-medium">
                          Order Status AI Can Write
                        </Label>
                        <Input
                          id="orderStatus"
                          type="text"
                          placeholder="processing, completed, cancelled"
                          className="h-11"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="px-8 py-6 border-t bg-muted/30">
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
                      onClick={() => step === 1 ? setStep(2) : null}
                    >
                      {step === 1 ? 'Next' : 'Connect'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConnectTab;
