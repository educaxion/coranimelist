import { getAnimeResponse } from "@/libs/api-libs";
import AnimeList from "@/components/AnimeList";
import Header from "@/components/AnimeList/Header";

const SEARCH_QUERY = `
query ($search: String) {
  Page(page: 1, perPage: 12) {
    media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
      id
      title { romaji english }
      coverImage { large }
      averageScore
    }
  }
}
`;

const Page = async ({ params }) => {
    const { keyword } = await params
    const decodedKeyword = decodeURIComponent(keyword)

    const data = await getAnimeResponse(SEARCH_QUERY, { search: decodedKeyword })
    const searchAnime = data?.Page?.media || []

    return (
      <>
        <section>  
          <Header title={`Search for "${decodedKeyword}..."`}/>
          {searchAnime.length > 0 ? (
            <AnimeList list={searchAnime}/>
          ) : (
            <p></p>
          )}
        </section>
      </>
    );
  } 

export default Page;
