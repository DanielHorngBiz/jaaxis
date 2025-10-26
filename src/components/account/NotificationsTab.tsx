import { Switch } from "@/components/ui/switch";

const NotificationsTab = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Notifications</h2>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Notification info</h3>

        <div className="space-y-6">
          {/* General Notifications */}
          <div className="flex items-start justify-between gap-8 pb-6 border-b">
            <div className="flex-1">
              <h4 className="font-semibold mb-1">General Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Receive important updates on platform maintenance, new features, and announcements.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          {/* Chatbot Activity Notifications */}
          <div className="flex items-start justify-between gap-8 pb-6 border-b">
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Chatbot Activity Notifications</h4>
              <p className="text-sm text-muted-foreground">
                New Chat Started – Get notified when a customer starts a conversation with your chatbot.
              </p>
            </div>
            <Switch />
          </div>

          {/* Email Notifications */}
          <div className="flex items-start justify-between gap-8 pb-6 border-b">
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Email Notifications</h4>
              <p className="text-sm text-muted-foreground">
                Receive email digest every 8 hours for changes to projects
              </p>
            </div>
            <Switch />
          </div>

          {/* Delivery Preferences */}
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Delivery Preferences</h4>
              <p className="text-sm text-muted-foreground">
                View real-time alerts inside the chatbot dashboard.
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsTab;
