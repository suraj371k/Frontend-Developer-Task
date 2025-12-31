"use client"
import { CheckCircle2, Clock, ListTodo, PlayCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserStore } from "@/store/userStore"
import { useTaskStore } from "@/store/taskStore"
import { useEffect, useMemo } from "react"

export default function DashboardPage() {
  const { user, loading: userLoading } = useUserStore()
  const { tasks, getTasks, loading: tasksLoading } = useTaskStore()

  useEffect(() => {
    getTasks()
  }, [])

  const stats = useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.status === "completed").length
    const pendingTasks = tasks.filter((task) => task.status === "pending").length
    const inProgressTasks = tasks.filter((task) => task.status === "progress").length

    return [
      {
        title: "Total Tasks",
        value: totalTasks.toString(),
        icon: ListTodo,
        description: "Tasks across all projects",
        color: "text-blue-600",
      },
      {
        title: "Completed",
        value: completedTasks.toString(),
        icon: CheckCircle2,
        description: "Tasks finished",
        color: "text-green-600",
      },
      {
        title: "Pending",
        value: pendingTasks.toString(),
        icon: Clock,
        description: "Tasks awaiting action",
        color: "text-amber-600",
      },
      {
        title: "In Progress",
        value: inProgressTasks.toString(),
        icon: PlayCircle,
        description: "Tasks being worked on",
        color: "text-blue-500",
      },
    ]
  }, [tasks])

  const recentActivity = useMemo(() => {
    // Sort tasks by updatedAt (most recent first), fallback to createdAt
    const sortedTasks = [...tasks].sort((a, b) => {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })

    return sortedTasks.slice(0, 5) // Get 5 most recent tasks
  }, [tasks])

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return "Recently"
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? "s" : ""} ago`
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }

  const getActivityIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle2
      case "progress":
        return PlayCircle
      default:
        return Clock
    }
  }

  const getActivityColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "progress":
        return "text-blue-600"
      default:
        return "text-amber-600"
    }
  }

  const getActivityText = (task: { title: string; status: string }) => {
    const statusMap: Record<string, string> = {
      completed: "Completed",
      progress: "Updated",
      pending: "Created",
    }
    return `${statusMap[task.status] || "Updated"} "${task.title}"`
  }

  if (userLoading || tasksLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }


  return (
    <>
      <DashboardHeader title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName?.toUpperCase()}!</h2>
            <p className="text-muted-foreground">Here's an overview of your current tasks and productivity.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                    <p className="text-xs text-muted-foreground mt-1">Create your first task to see activity here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((task) => {
                      const ActivityIcon = getActivityIcon(task.status)
                      const activityColor = getActivityColor(task.status)
                      const timeAgo = formatTimeAgo(task.updatedAt || task.createdAt)

                      return (
                        <div
                          key={task._id}
                          className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <ActivityIcon className={`h-5 w-5 ${activityColor}`} />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{getActivityText(task)}</p>
                            <p className="text-xs text-muted-foreground">{timeAgo}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
