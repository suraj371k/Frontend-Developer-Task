"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, Wand2 } from "lucide-react"

export function AITaskGenerator() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState("")

  const handleGenerate = () => {
    setLoading(true)
    // Simulating AI generation delay
    setTimeout(() => {
      setLoading(false)
      // In a real app, this would populate the preview
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Sparkles className="h-4 w-4" />
          AI Generate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            AI Task Generator
          </DialogTitle>
          <DialogDescription>
            Describe your task in natural language and our AI will structure it for you.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="sr-only">Prompt</Label>
            <Textarea
              placeholder="e.g., I need to create a new marketing campaign for the summer launch including social media assets and a landing page update by next Friday."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[150px] resize-none"
            />
          </div>
          <div className="rounded-lg border bg-muted/30 p-4 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Tips for best results:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Include specific deadlines or dates</li>
              <li>Mention key stakeholders or assignees</li>
              <li>List multiple sub-tasks for bulk generation</li>
            </ul>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" className="text-muted-foreground" onClick={() => setPrompt("")}>
            Clear
          </Button>
          <Button onClick={handleGenerate} disabled={loading || !prompt} className="min-w-[140px]">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Task
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Label component helper since it might be missing from direct context in some cases
function Label({ children, className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}
