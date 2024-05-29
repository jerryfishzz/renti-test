import Avatar from '@mui/material/Avatar'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/system'
import BookCard from './BookCard'

import { Book } from 'pages/types'

const userTestimonials = [
  {
    avatar: <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />,
    name: 'Remy Sharp',
    occupation: 'Senior Engineer',
    testimonial:
      "I absolutely love how versatile this product is! Whether I'm tackling work projects or indulging in my favorite hobbies, it seamlessly adapts to my changing needs. Its intuitive design has truly enhanced my daily routine, making tasks more efficient and enjoyable.",
  },
  {
    avatar: <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />,
    name: 'Travis Howard',
    occupation: 'Lead Product Designer',
    testimonial:
      "One of the standout features of this product is the exceptional customer support. In my experience, the team behind this product has been quick to respond and incredibly helpful. It's reassuring to know that they stand firmly behind their product.",
  },
  {
    avatar: <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />,
    name: 'Cindy Baker',
    occupation: 'CTO',
    testimonial:
      'The level of simplicity and user-friendliness in this product has significantly simplified my life. I appreciate the creators for delivering a solution that not only meets but exceeds user expectations.',
  },
  {
    avatar: <Avatar alt="Remy Sharp" src="/static/images/avatar/4.jpg" />,
    name: 'Julia Stewart',
    occupation: 'Senior Engineer',
    testimonial:
      "I appreciate the attention to detail in the design of this product. The small touches make a big difference, and it's evident that the creators focused on delivering a premium experience.",
  },
  {
    avatar: <Avatar alt="Travis Howard" src="/static/images/avatar/5.jpg" />,
    name: 'John Smith',
    occupation: 'Product Designer',
    testimonial:
      "I've tried other similar products, but this one stands out for its innovative features. It's clear that the makers put a lot of thought into creating a solution that truly addresses user needs.",
  },
  {
    avatar: <Avatar alt="Cindy Baker" src="/static/images/avatar/6.jpg" />,
    name: 'Daniel Wolf',
    occupation: 'CDO',
    testimonial:
      "The quality of this product exceeded my expectations. It's durable, well-designed, and built to last. Definitely worth the investment!",
  },
]

const whiteLogos = [
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628e8573c43893fe0ace_Sydney-white.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d520d0517ae8e8ddf13_Bern-white.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f46794c159024c1af6d44_Montreal-white.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e891fa22f89efd7477a_TerraLight.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a09d1f6337b1dfed14ab_colorado-white.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5caa77bf7d69fb78792e_Ankara-white.svg',
]

const darkLogos = [
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560628889c3bdf1129952dc_Sydney-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f4d4d8b829a89976a419c_Bern-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f467502f091ccb929529d_Montreal-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/61f12e911fa22f2203d7514c_TerraDark.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/6560a0990f3717787fd49245_colorado-black.svg',
  'https://assets-global.website-files.com/61ed56ae9da9fd7e0ef0a967/655f5ca4e548b0deb1041c33_Ankara-black.svg',
]

const logoStyle = {
  width: '64px',
  opacity: 0.3,
}

const bookList: Book[] = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    cover_image:
      'https://m.media-amazon.com/images/I/81QuEGw8VPL._AC_UF1000,1000_QL80_.jpg',
  },
  {
    id: 2,
    title: 'Becoming',
    author: 'Michelle Obama',
    genre: 'Biography',
    cover_image:
      'https://cdn2.penguin.com.au/covers/original/9780241982976.jpg',
  },
  {
    id: 3,
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    cover_image: 'https://d3fa68hw0m2vcc.cloudfront.net/875/277085392.jpeg',
  },
  {
    id: 4,
    title: 'Life of Pi',
    author: 'Yann Martel',
    genre: 'Adventure',
    cover_image:
      'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQS_pafFWoUZXoaQvYl6CEP9h51XJ4hsqK6DF66qc3wfs7ViMZq',
  },
  {
    id: 5,
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    genre: 'Romance',
    cover_image:
      'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSSYdk6Rh5OTsGdysNIEvx39vPpNL-xhWcmCYp1G1TYbd5fY3YB',
  },
  {
    id: 6,
    title: 'Frankenstein',
    author: 'Mary Shelley',
    genre: 'Horror',
    cover_image:
      'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTWOvWV-UtYvY2Qu57SAEGFDMsvxmxU3JjUgPh2_6GgS_6rGUyU',
  },
  {
    id: 7,
    title: 'Three-Body Problem',
    author: 'Liu Cixin',
    genre: 'Science Fiction',
    cover_image: 'https://d3fa68hw0m2vcc.cloudfront.net/15b/313930051.jpeg',
  },
  {
    id: 8,
    title: 'The Hobbit',
    author: 'J. R. R. Tolkien',
    genre: 'Adventure',
    cover_image:
      'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRRxdD7tWquroN4RfhCCpDQeOD7q4DnTHqUpp8gdAW9hzhoSftn',
  },
  {
    id: 9,
    title: 'I Am Legend',
    author: 'Richard Matheson',
    genre: 'Horror',
    cover_image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn2Kg7mIntkbIbwkzEIlVRXSIu-QE4jAhBHJDBZl241_LhaVgG',
  },
  {
    id: 10,
    title: 'Twilight',
    author: 'Stephenie Meyer',
    genre: 'Romance',
    cover_image:
      'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTwp7r8tHEhRtCYQtVwjgot9cUNrUGdvszZLInDXwdc94pwVdx6',
  },
  {
    id: 11,
    title: 'Nineteen Eighty-Four',
    author: 'George Orwell',
    genre: 'Fiction',
    cover_image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeglXlBmm240qQ70HEi6CpdgjyevAGT78Vo8iOVtsLnkiDw5pb',
  },
  {
    id: 12,
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    genre: 'Biography',
    cover_image:
      'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR2k4P1Mk2oKRRWcncYAbDL6q3mAwbc7hxikLYOF5mgkz1-QwaK',
  },
]

export default function BookList() {
  const theme = useTheme()
  const logos = theme.palette.mode === 'light' ? darkLogos : whiteLogos

  return (
    <Container
      id="testimonials"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Grid container spacing={2}>
        {bookList.map(book => (
          <BookCard book={book} key={book.id} />
        ))}
      </Grid>
    </Container>
  )
}
