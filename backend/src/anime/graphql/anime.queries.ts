export const SEARCH_ANIME_QUERY = `
    query SearchAnime($search: String!, $page: Int!, $perPage: Int!) {
        Page(page: $page, perPage: $perPage) {
            pageInfo {
                currentPage
                hasNextPage
                perPage
            }
            media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
                id
                idMal
                title {
                    romaji
                    english
                    native
                }
                description
                coverImage {
                    extraLarge
                    large
                }
                bannerImage
                averageScore
                popularity
                format
                status
                episodes
                duration
                season
                seasonYear
                genres
                studios(isMain: true) {
                    nodes {
                        id
                        name
                    }
                }
            }
        }
    }
`;
