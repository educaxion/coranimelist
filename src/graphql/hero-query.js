const HERO_QUERY = `
query {
  Page(page: 1, perPage: 5) {
    media(type: ANIME, status: RELEASING, sort: [TRENDING_DESC, POPULARITY_DESC]) {
      id
      title {
        english
        romaji
      }
      description
      bannerImage
      coverImage {
        large
      }
      episodes
      averageScore
      genres
    }
  }
}
`;