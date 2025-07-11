import type { ReactNode } from "react"

import { Popover as MuiPopover, Box } from "@mui/material"

interface PopoverProperties {
  anchor: HTMLElement | null
  open: boolean
  onClose: () => void
  children: ReactNode
  width?: number | string
  padding?: number
}

export const Popover = ({ anchor, open, onClose, children, width = 300, padding = 2 }: PopoverProperties) => (
  <MuiPopover
    open={open}
    anchorEl={anchor}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    transformOrigin={{ vertical: "top", horizontal: "left" }}
    disableAutoFocus
    disableEnforceFocus
  >
    <Box sx={{ width, p: padding }}>{children}</Box>
  </MuiPopover>
)
