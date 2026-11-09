"use client"
import HeaderMenu from '@/components/Utilities/HeaderMenu'
import Pagination from '@/components/Utilities/Pagination'
import AnimeList from '@/components/AnimeList'
import { useEffect, useState } from 'react'

const Page = () => {
  const [page, setPage] = useState(1)
  const [topTrending, setTopTrending] = useState([])
  const [lastPage, setLastPage] = useState(1)
 
  const fetchData = async() => {
    const query = `
      query ($page: Int) {
        Page(page: $page, perPage: 24) {
          pageInfo {
            lastPage
          }
          media(sort: TRENDING_DESC, type: ANIME) {
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
      setTopTrending(data.data.Page.media)
      setLastPage(data.data.Page.pageInfo.lastPage)
  }

  useEffect(() => {
    fetchData()
  }, [page])

  return (
    <div>
      <HeaderMenu title={`Anime Trending #${page}`}/>
      <AnimeList list={topTrending}/>
      <Pagination page={page} lastPage={lastPage} setPage={setPage}/>
    </div>
  )
}

export default Page