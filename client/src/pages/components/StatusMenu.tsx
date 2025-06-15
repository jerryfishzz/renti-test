import { Check } from '@mui/icons-material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Fab, ListItemIcon, ListItemText } from '@mui/material'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Dispatch, MouseEvent, SetStateAction, useState } from 'react'

import { StatusState, readingStatus } from './BookCard'

type StatusMenuProps = {
  status: StatusState
  setStatus: Dispatch<SetStateAction<StatusState>>
}
export default function StatusMenu({ status, setStatus }: StatusMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const [selectedIndex, setSelectedIndex] = useState(2)

  const handleFabClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
    status: StatusState,
  ) => {
    setSelectedIndex(index)
    setStatus(status)
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
      <Fab
        color={readingStatus[status].color}
        aria-label="status"
        id="status-button"
        aria-controls={open ? 'status-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleFabClick}
        size="small"
      >
        <MoreVertIcon />
      </Fab>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {(Object.keys(readingStatus) as StatusState[]).map((s, index) => (
          <MenuItem
            onClick={e => handleMenuItemClick(e, index, s)}
            key={index}
            selected={index === selectedIndex}
          >
            {selectedIndex === index && (
              <ListItemIcon>
                <Check />
              </ListItemIcon>
            )}
            <ListItemText inset={selectedIndex === index ? false : true}>
              {readingStatus[s].text}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
