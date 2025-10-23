"use client"

import { useNotifications } from "@/lib/hooks/use-notifications"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell } from "lucide-react"

export function NotificationSettings() {
  const { settings, updateSettings, requestPermission, sendTestNotification, hasPermission } = useNotifications()

  const handlePermissionRequest = async () => {
    const granted = await requestPermission()
    if (granted) {
      sendTestNotification()
    }
  }

  if (!settings) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>Manage how and when you receive task reminders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Browser Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Browser Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
            </div>
            {!hasPermission ? (
              <Button onClick={handlePermissionRequest} variant="outline" size="sm">
                Enable
              </Button>
            ) : (
              <Button onClick={sendTestNotification} variant="outline" size="sm">
                Test
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-enabled">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified about upcoming tasks</p>
            </div>
            <Switch
              id="push-enabled"
              checked={settings.push_notifications_enabled}
              onCheckedChange={(checked) => updateSettings({ push_notifications_enabled: checked })}
              disabled={!hasPermission}
            />
          </div>
        </div>

        {/* Email Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-enabled">Email Digests</Label>
              <p className="text-sm text-muted-foreground">Receive daily email summaries of your tasks</p>
            </div>
            <Switch
              id="email-enabled"
              checked={settings.email_notifications_enabled}
              onCheckedChange={(checked) => updateSettings({ email_notifications_enabled: checked })}
            />
          </div>

          {settings.email_notifications_enabled && (
            <div className="space-y-2">
              <Label htmlFor="digest-time">Digest Time</Label>
              <Select
                value={settings.digest_time || "09:00"}
                onValueChange={(value) => updateSettings({ digest_time: value })}
              >
                <SelectTrigger id="digest-time">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="06:00">6:00 AM</SelectItem>
                  <SelectItem value="07:00">7:00 AM</SelectItem>
                  <SelectItem value="08:00">8:00 AM</SelectItem>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Quiet Hours */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="quiet-hours">Quiet Hours</Label>
              <p className="text-sm text-muted-foreground">Pause notifications during specific hours</p>
            </div>
            <Switch
              id="quiet-hours"
              checked={settings.quiet_hours_enabled}
              onCheckedChange={(checked) => updateSettings({ quiet_hours_enabled: checked })}
            />
          </div>

          {settings.quiet_hours_enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quiet-start">Start Time</Label>
                <Select
                  value={settings.quiet_hours_start || "22:00"}
                  onValueChange={(value) => updateSettings({ quiet_hours_start: value })}
                >
                  <SelectTrigger id="quiet-start">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20:00">8:00 PM</SelectItem>
                    <SelectItem value="21:00">9:00 PM</SelectItem>
                    <SelectItem value="22:00">10:00 PM</SelectItem>
                    <SelectItem value="23:00">11:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quiet-end">End Time</Label>
                <Select
                  value={settings.quiet_hours_end || "08:00"}
                  onValueChange={(value) => updateSettings({ quiet_hours_end: value })}
                >
                  <SelectTrigger id="quiet-end">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="06:00">6:00 AM</SelectItem>
                    <SelectItem value="07:00">7:00 AM</SelectItem>
                    <SelectItem value="08:00">8:00 AM</SelectItem>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
