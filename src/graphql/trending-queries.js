export const TRENDING = `
      query ($page: Int) {
        Page(page: $page, perPage: 24) {
          pageInfo { lastPage }
          media(sort: TRENDING_DESC, type: ANIME) {
            id
            title { 
              romaji 
              english 
            }
            coverImage {
              large 
            }
            averageScore
          }
        }
      }`