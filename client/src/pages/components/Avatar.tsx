import { Avatar as MUIAvatar } from '@mui/material'

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
      ml: 1,
      width: 32,
      height: 32,
      fontSize: 16,
    },
    children,
  }
}

export default function Avatar({ name }: { name: string }) {
  return <MUIAvatar {...stringAvatar(name)} />
}
