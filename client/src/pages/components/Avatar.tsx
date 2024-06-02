import { Avatar as MUIAvatar } from '@mui/material'
import { ComponentProps } from 'react'

function stringToColor(string: string) {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

function stringAvatar(name: string) {
  const [first, second] = name.split(' ')
  const children = first ? (second ? `${first[0]}${second[0]}` : first[0]) : '?'

  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 32,
      height: 32,
      fontSize: 16,
    },
    children,
  }
}

type MUIAvatarProps = ComponentProps<typeof MUIAvatar>
type AvatarProps = MUIAvatarProps & { name: string }
export default function Avatar({ name, ...props }: AvatarProps) {
  return <MUIAvatar {...props} {...stringAvatar(name)} />
}
