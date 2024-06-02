import * as React from 'react'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Drawer from '@mui/material/Drawer'
import MenuIcon from '@mui/icons-material/Menu'
import ToggleColorMode from './ToggleColorMode'
import PersonIcon from '@mui/icons-material/Person'
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'
import Groups2Icon from '@mui/icons-material/Groups2'
import { NavigateFunction, useNavigate } from 'react-router-dom'

import { useMode } from 'contexts/mode'
import { useAuth } from 'contexts/auth'
import Avatar from './Avatar'

const logoStyle = {
  width: '140px',
  height: 'auto',
  cursor: 'pointer',
}

const nav = {
  library: {
    name: 'Library',
    path: '/',
    icon: <LocalLibraryIcon sx={{ mr: 1 }} />,
  },
  clubs: {
    name: 'Clubs',
    path: '/clubs',
    icon: <Groups2Icon sx={{ mr: 1 }} />,
  },
} as const
type Nav = keyof typeof nav

function AppAppBar() {
  const { mode, toggleColorMode } = useMode()
  const [open, setOpen] = React.useState(false)
  const [openDesktop, setOpenDesktop] = React.useState(false)

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen)
  }

  const toggleDrawerDesktop = (newOpen: boolean) => () => {
    setOpenDesktop(newOpen)
  }

  if (!user) return null

  // const scrollToSection = (sectionId: string) => {
  //   const sectionElement = document.getElementById(sectionId)
  //   const offset = 128
  //   if (sectionElement) {
  //     const targetScroll = sectionElement.offsetTop - offset
  //     sectionElement.scrollIntoView({ behavior: 'smooth' })
  //     window.scrollTo({
  //       top: targetScroll,
  //       behavior: 'smooth',
  //     })
  //     setOpen(false)
  //   }
  // }

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={theme => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderRadius: '999px',
              bgcolor:
                theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(24px)',
              maxHeight: 40,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow:
                theme.palette.mode === 'light'
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                ml: '-18px',
                px: 0,
              }}
            >
              <img
                src={
                  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e6faf73568658154dae_SitemarkDefault.svg'
                }
                style={logoStyle}
                alt="logo of sitemark"
              />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {Object.keys(nav).map(navKey => (
                  <ItemDesktop
                    key={navKey}
                    navKey={navKey as Nav}
                    navigate={navigate}
                  />
                ))}
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              {/* <Button
                color="primary"
                variant="text"
                size="small"
                component="a"
                href="/material-ui/getting-started/templates/sign-in/"
                target="_blank"
              >
                Sign in
              </Button>
              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={logout}
              >
                Sign up
              </Button> */}
              <Typography variant="button" color="primary" sx={{ ml: 1 }}>
                Hello
              </Typography>
              <Button
                disableRipple
                sx={{
                  '&:hover': {
                    bgcolor: 'background.default',
                  },
                }}
              >
                <Avatar
                  name={user?.name ?? ''}
                  onClick={toggleDrawerDesktop(true)}
                />
              </Button>
            </Box>
            <Box sx={{ display: { sm: 'none', md: '' } }}>
              <Drawer
                anchor="right"
                open={openDesktop}
                onClose={toggleDrawerDesktop(false)}
              >
                <Box
                  sx={{
                    minWidth: '30dvw',
                    p: 2,
                    backgroundColor: 'background.paper',
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexGrow: 1,
                      mb: 3,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Avatar
                        name={user.name ?? ''}
                        style={{ marginLeft: 16 }}
                      />
                      <Typography variant="subtitle1" sx={{ ml: 1 }}>
                        {user.name}
                      </Typography>
                    </Box>
                    <ToggleColorMode
                      mode={mode}
                      toggleColorMode={toggleColorMode}
                    />
                  </Box>
                  <MenuItem onClick={() => navigate(`/user/${user.id}`)}>
                    <PersonIcon sx={{ mr: 1 }} />
                    Your Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem sx={{ mt: 1 }}>
                    <Button
                      color="secondary"
                      variant="contained"
                      sx={{ width: '100%' }}
                      onClick={logout}
                    >
                      Log out
                    </Button>
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>

            <Box sx={{ display: { sm: '', md: 'none' } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: '30px', p: '4px' }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: '60dvw',
                    p: 2,
                    backgroundColor: 'background.paper',
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexGrow: 1,
                      mb: 3,
                    }}
                  >
                    <Avatar name={user.name ?? ''} style={{ marginLeft: 16 }} />
                    <ToggleColorMode
                      mode={mode}
                      toggleColorMode={toggleColorMode}
                    />
                  </Box>
                  {Object.keys(nav).map(navKey => (
                    <ItemMobile
                      key={navKey}
                      navKey={navKey as Nav}
                      navigate={navigate}
                    />
                  ))}
                  <Divider />
                  <MenuItem onClick={() => navigate(`/user/${user.id}`)}>
                    <PersonIcon sx={{ mr: 1 }} />
                    Your Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem sx={{ mt: 1 }}>
                    <Button
                      color="secondary"
                      variant="contained"
                      sx={{ width: '100%' }}
                      onClick={logout}
                    >
                      Log out
                    </Button>
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  )
}

type ItemProps = {
  navKey: Nav
  navigate: NavigateFunction
}
function ItemDesktop({ navKey, navigate }: ItemProps) {
  return (
    <MenuItem
      sx={{ py: '6px', px: '12px' }}
      onClick={() => navigate(nav[navKey].path)}
    >
      <Typography variant="body2" color="text.primary">
        {nav[navKey].name}
      </Typography>
    </MenuItem>
  )
}
function ItemMobile({ navKey, navigate }: ItemProps) {
  return (
    <MenuItem onClick={() => navigate(nav[navKey].path)}>
      {nav[navKey].icon} {nav[navKey].name}
    </MenuItem>
  )
}

export default AppAppBar
