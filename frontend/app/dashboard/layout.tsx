"use client"
import type React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useUserStore } from "@/store/userStore"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { getUser, user, loading } = useUserStore()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true)
      await getUser()
      setIsChecking(false)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (!isChecking && !loading && !user) {
      router.push("/login")
    }
  }, [user, loading, isChecking, router])

  if (isChecking || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="flex flex-col">{children}</SidebarInset>
    </SidebarProvider>
  )
}
