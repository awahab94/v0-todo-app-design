"use client";

import { useUserSettings, useUpdateUserSettings } from "@/lib/hooks/use-user-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { data: settings, isLoading } = useUserSettings();
  const updateSettings = useUpdateUserSettings();
  const { theme, setTheme } = useTheme();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and notifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how TaskFlow looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Default View</Label>
              <p className="text-sm text-muted-foreground">Choose your starting view</p>
            </div>
            <Select
              value={settings.default_view}
              onValueChange={value =>
                updateSettings.mutate({
                  default_view: value as "today" | "upcoming" | "inbox" | "kanban" | "calendar",
                })
              }>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="inbox">Inbox</SelectItem>
                <SelectItem value="kanban">Kanban</SelectItem>
                <SelectItem value="calendar">Calendar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how you receive updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive browser notifications for tasks</p>
            </div>
            <Switch
              checked={settings.push_notifications_enabled}
              onCheckedChange={checked =>
                updateSettings.mutate({
                  push_notifications_enabled: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Digest</Label>
              <p className="text-sm text-muted-foreground">Daily summary of your tasks</p>
            </div>
            <Switch
              checked={settings.email_digest_enabled}
              onCheckedChange={checked =>
                updateSettings.mutate({
                  email_digest_enabled: checked,
                })
              }
            />
          </div>

          {settings.email_digest_enabled && (
            <div className="space-y-2">
              <Label>Digest Time</Label>
              <Input
                type="time"
                value={settings.email_digest_time}
                onChange={e =>
                  updateSettings.mutate({
                    email_digest_time: e.target.value,
                  })
                }
              />
            </div>
          )}

          <div className="space-y-4">
            <Label>Quiet Hours</Label>
            <p className="text-sm text-muted-foreground">Don&apos;t send notifications during these hours</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quiet-start">Start</Label>
                <Input
                  id="quiet-start"
                  type="time"
                  value={settings.quiet_hours_start || ""}
                  onChange={e =>
                    updateSettings.mutate({
                      quiet_hours_start: e.target.value || null,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiet-end">End</Label>
                <Input
                  id="quiet-end"
                  type="time"
                  value={settings.quiet_hours_end || ""}
                  onChange={e =>
                    updateSettings.mutate({
                      quiet_hours_end: e.target.value || null,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>TaskFlow version and information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">TaskFlow is an intelligent task manager built with Next.js, Supabase, and modern web technologies.</p>
        </CardContent>
      </Card>
    </div>
  );
}
