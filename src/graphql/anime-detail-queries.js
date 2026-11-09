export const ANIME_DETAIL_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      episodes
      description
      coverImage {
        extraLarge
        large
      }
      bannerImage
      format
      duration
      status
      startDate {
        year
        month
        day
      }
      season
      seasonYear
      averageScore
      meanScore
      popularity
      favourites
      studios {
        nodes {
          name
          isAnimationStudio
        }
      }
      source
      hashtag
      genres
      trailer {
      id
      site
      thumbnail
      }
      characters(sort: [ROLE, ID], perPage: 6) {
      edges {
        role
        node {
          id
          name {
            full
          }
          image {
            large
          }
        }
        voiceActors(language: JAPANESE) {
          id
          name {
            full
          }
          image {
            large
          }
        }
      }
    }
    staff(perPage: 3) {
      edges {
        role
        node {
          id
          name {
            full
          }
          image {
            large
          }
        }
      }
    }
    }
  }
`;