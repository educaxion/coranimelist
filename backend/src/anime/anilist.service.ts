import {
  Injectable,
  BadGatewayException,
  ServiceUnavailableException,
} from '@nestjs/common';

import { SEARCH_ANIME_QUERY } from './graphql/anime.queries.js';

interface AniListResponse<T> {
  data?: T;
  errors?: {
    message: string;
  }[];
}

interface AnimeSearchResult {
  Page: {
    pageInfo: {
      currentPage: number;
      hasNextPage: boolean;
      perPage: number;
    };
    media: unknown[];
  };
}

@Injectable()
export class AniListService {
  private readonly apiUrl = 'https://graphql.anilist.co';

  async searchAnime(
    search: string,
    page = 1,
    perPage = 10,
    ) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    query: SEARCH_ANIME_QUERY,
                    variables: {
                        search,
                        page,
                        perPage,
                    }
                })
            })

            const result =
            (await response.json()) as AniListResponse<AnimeSearchResult>;

            if (!response.ok) {
            const errorMessage = result.errors
                ?.map((error) => error.message)
                .join(', ');

            throw new BadGatewayException(
                errorMessage || `AniList returned status ${response.status}`,
            );
            }

            if (result.errors?.length) {
                throw new BadGatewayException(
                    result.errors.map((error) => error.message).join(', '),
                );
            }

            if (!result.data) {
                throw new BadGatewayException(
                    'Invalid response from AniList',
                );
            }

            return result.data.Page;
        }   catch (error) {
            if (error instanceof BadGatewayException) {
                throw error;
            }

            throw new ServiceUnavailableException(
                'Unable to connect to AniList API',
            );
        }
    }
}