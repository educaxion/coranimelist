import Head from "next/head";
import AnimeList from "../components/AnimeList";
import Header from "@/components/AnimeList/Header";
import AiringList from "@/components/AnimeDetail/AiringList";

const QUERY = `
query {
  populer: Page(page: 1, perPage: 6) {
    media(type: ANIME, sort: POPULARITY_DESC){
      id
      title { romaji english }
      coverImage { large }
      averageScore
    }
  }
  trending: Page(page: 1, perPage: 6) {
    media(type: ANIME, sort: TRENDING_DESC){
      id
      title { romaji english }
      coverImage { large }
      averageScore
    }
  }
  upcoming: Page(page: 1, perPage: 6) {
    media(type: ANIME, status: NOT_YET_RELEASED, sort:[POPULARITY_DESC]){
      id
      title { romaji english }
      coverImage { large }
      averageScore
    }
  }
  airing: Page(page: 1, perPage: 10) {
    media(type: ANIME, status: RELEASING, sort: [SCORE_DESC, POPULARITY_DESC]) {
      id
      title { romaji english }
      coverImage { extraLarge large }
      genres
      averageScore
      popularity
      format
      episodes
      season
      seasonYear
      status
    }
  }
}
`;

const Home = async () => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: QUERY,
      }),
      cache: "no-store", 
    });

    const response = await res.json();
    const topAnime = response.data.populer.media; 
    const upcomingAnime = response.data.upcoming.media; 
    const trendingAnime = response.data.trending.media; 
    const airingAnime = response.data.airing.media; 

    return (  
      <> 
        <div className="px-4 sm:px-8 lg:px-16 py-6">
          <section className="mb-6 sm:mb-10">  
            <Header title="Populer" linkTitle="View All" linkHref="/populer"/>
            <AnimeList list={topAnime}/>
          </section>

          <section className="mb-6 sm:mb-10">  
            <Header title="Trending" linkTitle="View All" linkHref="/trending"/>
            <AnimeList list={trendingAnime}/>
          </section>

          <section className="mb-6 sm:mb-10">  
            <Header title="Upcoming Next Season" linkTitle="View All" linkHref="/upcoming"/>
            <AnimeList list={upcomingAnime}/>
          </section>

          <section>
            <Header title="Airing List" linkTitle="View All" linkHref="/airing-list"/>
            <AiringList list={airingAnime}/>
          </section>
        </div>
      </>
    );
  } catch (error) {
    console.error("Error fetching AniList:", error);
    return (
      <main>
        <p>Gagal memuat data</p>
      </main>
    );
  }
};

export default Home;
