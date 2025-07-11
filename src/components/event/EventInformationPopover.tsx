import { BUTTON } from "@/components/library/button/button.constant"
import { MESSAGE } from "@/components/shared/message.constant"
import { useEvent } from "@/features/event/useEvent.hook"
import type { Event } from "@/features/event/event.model"

import { useEffect, useState, useRef } from "react"

import { Edit, Delete } from "@mui/icons-material"
import { Box, Typography, IconButton, Stack, Popover, Button, type PopoverProps } from "@mui/material"
import { useStorage } from "@/storage/useStorage.hook"

interface EventInformationPopoverProperties {
  anchorElement: HTMLElement | null
  event: Event | null
  onClose: () => void
  onEdit: () => void
  onDelete: (eventId: string) => void
  PaperProps?: PopoverProps["PaperProps"]
}

const EventInformationPopover = ({
  anchorElement,
  event,
  onClose,
  onEdit,
  onDelete,
  PaperProps
}: EventInformationPopoverProperties) => {
  const open = Boolean(anchorElement && event)
  const { events } = useStorage()
  const { reloadEvents } = useEvent()

  const [currentEvent, setCurrentEvent] = useState<Event | null>(event)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const lastFetchedEventId = useRef<string | null>(null)

  const handleDeleteClick = () => setConfirmingDelete(true)

  const handleConfirmDelete = () => {
    if (event) onDelete(event.id)
    setConfirmingDelete(false)
    onClose()
  }

  const handleCancelDelete = () => setConfirmingDelete(false)

  useEffect(() => {
    const refresh = async () => {
      if (event?.id && lastFetchedEventId.current !== event.id) {
        await reloadEvents()
        const updated = events.find((e) => e.id === event.id)
        if (updated) setCurrentEvent(updated)
        lastFetchedEventId.current = event.id
      }
    }

    if (open) {
      refresh()
    }
  }, [event?.id, events, open, reloadEvents])

  return (
    <Popover
      open={open}
      anchorEl={anchorElement}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        sx: { p: 2, width: 300, ...PaperProps?.sx },
        ...PaperProps
      }}
    >
      {currentEvent && (
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">{currentEvent.name || "Untitled"}</Typography>
            <Box sx={{ position: "absolute", top: 10, right: 10 }}>
              {!confirmingDelete && (
                <>
                  <IconButton size="small" onClick={onEdit}>
                    <Edit fontSize="small" />
                  </IconButton>

                  <IconButton size="small" onClick={handleDeleteClick}>
                    <Delete fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>
          </Stack>

          {!confirmingDelete ? (
            <>
              <Typography variant="body2" color="text.secondary">
                {currentEvent.startDate && currentEvent.endDate
                  ? `${new Date(currentEvent.startDate).toLocaleString()} – ${new Date(
                      currentEvent.endDate
                    ).toLocaleString()}`
                  : "No date available"}
              </Typography>

              {currentEvent.description && <Typography>{currentEvent.description}</Typography>}
            </>
          ) : (
            <Stack spacing={1}>
              <Typography variant="body2">{MESSAGE.CONFIRM_DELETE_EVENT}</Typography>

              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button onClick={handleCancelDelete} size="small" color="inherit">
                  {BUTTON.CANCEL}
                </Button>
                <Button onClick={handleConfirmDelete} size="small" color="error">
                  {BUTTON.DELETE}
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      )}
    </Popover>
  )
}

export default EventInformationPopover
