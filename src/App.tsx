import { useEffect, useState } from 'react'
import { Dropdown, Button, MenuProps, Table } from 'antd'


type Movie = {
  id: string
  title: string
  posterURL: string
  rating: string
  year: string
  runtime: string
  genres: string[]
  director: string
  actors: string
  plot: string
}

const genres = [
  "Crime",
  "Drama",
  "Comedy",
  "Action",
  "Adventure",
  "Sci-Fi",
  "Animation",
  "Fantasy",
  "Biography",
  "Thriller",
  "Horror",
  "Mystery",
  "Romance",
  "War",
  "Family",
  "Western",
  "Film-Noir",
  "History",
  "Musical",
  "Sport",
  "Music"
];

function TabMovie({movies}: {movies: Movie[]}){

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
    },
    {
      title: 'Poster',
      dataIndex: 'posterURL',
      key: 'posterUrl',
      render: (t, r) => <img src={`${r.posterUrl}`} width="150"/>
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Runtime',
      dataIndex: 'runtime',
      key: 'runtime',
    },
    {
      title: 'Genres',
      dataIndex: 'genres',
      render: (genres: string[]) => genres.join(', '),
    },
    {
      title: 'Director',
      dataIndex: 'director',
      key: 'director',
    },
    {
      title: 'Actors',
      dataIndex: 'actors',
      key: 'actors',
    },
    {
      title: 'Plot',
      dataIndex: 'plot',
      key: 'plot',
    },
  ]
  return (
    <>
      <Table dataSource={movies} columns={columns} rowKey="id"/>;
    </>)
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const baseUrl = 'api?sortBy=rating'
  const filterByGenreUrl = '&filter=genres='
  const [api, setApi] = useState(baseUrl)
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
  fetch(api)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(data => {
      const dataMovies : Movie[] = data.movies
      setMovies(dataMovies)
      setIsLoading(false);
    })
    .catch(error => console.error('Fetch error:', error))
    setIsLoading(false);
  }, [api])

  function handleFilter(key: string) {
    setApi(baseUrl + filterByGenreUrl + key)
  }

  function Loading() {
    return <h2>🌀 Loading...</h2>;
  }
  
  function DropdownMenu({genres}: {genres : string[]}) {
    const items: MenuProps['items'] = genres.map((genre : string) => ({
      key: genre,
      label: genre,
      onClick: () => handleFilter(genre)
    }))
    return (
      <Dropdown menu={{items}}>
        <Button>
          Filter by Genre
        </Button>
      </Dropdown>
    )
  }

  return (
    <>
      <h1>Movies :</h1>
    <DropdownMenu genres={genres}/>
      {isLoading ? <Loading /> : <TabMovie movies={movies} />}    </>
  )
}

export default App
