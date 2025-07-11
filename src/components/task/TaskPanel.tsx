import { useState, useCallback, useMemo } from "react"
import { Box, TextField } from "@mui/material"

import { AddButton } from "../library/button/AddButton"
import { useTask } from "@/features/task/useTask.hook"
import { useStorage } from "@/storage/useStorage.hook"
import TaskBoard from "./TaskBoard"
import type { Task } from "@/features/task/task.model"
import { TaskStatus } from "@/features/task/taskStatus.type"
import { MESSAGE } from "../shared/message.constant"
import { toast } from "react-toastify"

export default function TasksPanel() {
  const { tasks, categories, calendars } = useStorage()
  const { addTask, updateTask, deleteTask, reloadTasks } = useTask()

  const [newTitle, setNewTitle] = useState("")

  const defaultCalendar = useMemo(() => calendars[0] || null, [calendars])
  const defaultCategory = useMemo(() => categories.findLast((c) => c.id === null) || undefined, [categories])

  const handleCreate = useCallback(async () => {
    const title = newTitle.trim()
    if (!title || !defaultCalendar) {
      toast.error("Cannot create task. No calendar is available.")
      return
    }

    const payload: Omit<Task, "id"> = {
      name: title,
      description: "",
      calendar: defaultCalendar,
      category: defaultCategory ?? undefined,
      status: TaskStatus.TODO
    }

    await addTask(payload)
    await reloadTasks()
    setNewTitle("")
  }, [newTitle, defaultCalendar, defaultCategory, addTask, reloadTasks])

  const handleUpdate = useCallback(
    async (updated: Task) => {
      await updateTask(updated)
      await reloadTasks()
    },
    [updateTask, reloadTasks]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteTask(id)
      await reloadTasks()
    },
    [deleteTask, reloadTasks]
  )

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        p: 2,
        boxSizing: "border-box"
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <TextField
          label={MESSAGE.NEW_TASK}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          size="small"
          fullWidth
        />
        <AddButton onClick={handleCreate} />
      </Box>

      <Box sx={{ flex: 1 }}>
        <TaskBoard
          tasks={tasks}
          calendars={calendars}
          categories={categories}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </Box>
    </Box>
  )
}
