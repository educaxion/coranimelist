import NotFound from "@/app/not-found";
import AnimeList from "@/components/AnimeList";
import Header from "@/components/AnimeList/Header";

const Page = async ({ params, searchParams }) => {
    const { keyword } = await params
    const decodedKeyword = decodeURIComponent(keyword)
    const backendUrl = process.env.BACKEND_API_URL;

    if(!backendUrl) {
      throw new Error("BACKEND_API_URL is not configured");
    }

    const queryParams = new URLSearchParams ({
      query: decodedKeyword,
      page: "1",
      perPage: "20",
    })

    const response = await fetch(
      `${backendUrl}/anime/search?${queryParams.toString()}`,
      {
        cache: "no-store"
      }
    );

    const data = await response.json()
    const searchAnime = data.media ?? [];

    return (
      <>
        <section>  
          <Header title={`Search for "${decodedKeyword}..."`}/>
          {searchAnime.length > 0 ? (
            <AnimeList list={searchAnime}/>
          ) : (
            <NotFound/>
          )}
        </section>
      </>
    );
  } 

export default Page;
