"use client"

import { MoreVertical, Search, Filter, X } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { CreateTaskModal } from "@/components/create-task-modal"
import { AITaskGenerator } from "@/components/ai-task-generator"
import { EditTaskModal } from "@/components/edit-task-modal"
import { useTaskStore, type Task, type Status, type Priority } from "@/store/taskStore"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function TasksPage() {
  const { tasks, getTasks, deleteTask, loading } = useTaskStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    getTasks()
  }, [])

  const handleDelete = async (id: string) => {
    await deleteTask(id)
    const currentError = useTaskStore.getState().error
    if (currentError) {
      toast.error(currentError)
    } else {
      toast.success("Task deleted successfully")
    }
    setDeleteDialogOpen(null)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Pending",
      progress: "In Progress",
      completed: "Completed",
    }
    return statusMap[status] || status
  }

  const formatPriority = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1)
  }

  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || task.status === statusFilter

    // Priority filter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const hasActiveFilters = statusFilter !== "all" || priorityFilter !== "all"

  const clearFilters = () => {
    setStatusFilter("all")
    setPriorityFilter("all")
    setSearchQuery("")
  }

  return (
    <>
      <DashboardHeader title="Tasks" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks by title or description..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {(searchQuery || hasActiveFilters) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-7 w-7 p-0"
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Filter className="h-4 w-4" />
                    Filter
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {(statusFilter !== "all" ? 1 : 0) + (priorityFilter !== "all" ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("all")}
                    className={statusFilter === "all" ? "bg-accent" : ""}
                  >
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("pending")}
                    className={statusFilter === "pending" ? "bg-accent" : ""}
                  >
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("progress")}
                    className={statusFilter === "progress" ? "bg-accent" : ""}
                  >
                    In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("completed")}
                    className={statusFilter === "completed" ? "bg-accent" : ""}
                  >
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => setPriorityFilter("all")}
                    className={priorityFilter === "all" ? "bg-accent" : ""}
                  >
                    All Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setPriorityFilter("low")}
                    className={priorityFilter === "low" ? "bg-accent" : ""}
                  >
                    Low
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setPriorityFilter("medium")}
                    className={priorityFilter === "medium" ? "bg-accent" : ""}
                  >
                    Medium
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setPriorityFilter("high")}
                    className={priorityFilter === "high" ? "bg-accent" : ""}
                  >
                    High
                  </DropdownMenuItem>
                  {hasActiveFilters && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={clearFilters} className="text-destructive">
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              {/* <AITaskGenerator /> */}
              <CreateTaskModal />
            </div>
          </div>

          {loading && tasks.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Loading tasks...</p>
              </div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">No tasks found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery || hasActiveFilters
                  ? "Try adjusting your search or filters"
                  : "Create your first task to get started"}
              </p>
              {(searchQuery || hasActiveFilters) && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                <Card key={task._id} className="overflow-hidden transition-shadow hover:shadow-md">
                  <CardContent className="p-0">
                    <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{task.title}</h3>
                          <Badge
                            variant={task.priority === "high" ? "destructive" : "secondary"}
                          >
                            {formatPriority(task.priority)}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            variant={task.status === "completed" ? "default" : "outline"}
                          >
                            {formatStatus(task.status)}
                          </Badge>
                          {task.createdAt && (
                            <span className="text-xs text-muted-foreground">
                              {formatDate(task.createdAt)}
                            </span>
                          )}
                        </div>
                        <AlertDialog
                          open={deleteDialogOpen === task._id}
                          onOpenChange={(open) => setDeleteDialogOpen(open ? task._id : null)}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTask(task)
                                  setEditDialogOpen(true)
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the task
                                "{task.title}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(task._id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={loading}
                              >
                                {loading ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <EditTaskModal
        task={selectedTask}
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) {
            setSelectedTask(null)
          }
        }}
      />
    </>
  )
}
