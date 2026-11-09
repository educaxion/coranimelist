"use client"
import HeaderMenu from '@/components/Utilities/HeaderMenu'
import Pagination from '@/components/Utilities/Pagination'
import AnimeList from '@/components/AnimeList'
import { useEffect, useState } from 'react'

const Page = () => {
  const [page, setPage] = useState(1)
  const [upcomingAnime, setUpcomingAnime] = useState([])
  const [lastPage, setLastPage] = useState(1)
 
  const fetchData = async() => {
    const query = `
      query ($page: Int) {
        Page(page: $page, perPage: 24) {
          pageInfo {
            lastPage
          }
          media(sort: POPULARITY_DESC, status: NOT_YET_RELEASED, type: ANIME) {
            id
            title { romaji english }
            coverImage { large }
            averageScore
          }
        }
      }`

      const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ query, variables: { page }}),
        cache: "no-store", 
    });

    const data = await response.json();
      setUpcomingAnime(data.data.Page.media)
      setLastPage(data.data.Page.pageInfo.lastPage)
  }

  useEffect(() => {
    fetchData()
  }, [page])

  return (
    <div>
      <HeaderMenu title={`Anime Upcoming #${page}`}/>
      <AnimeList list={upcomingAnime}/>
      <Pagination page={page} lastPage={lastPage} setPage={setPage}/>
    </div>
  )
}

export default Page