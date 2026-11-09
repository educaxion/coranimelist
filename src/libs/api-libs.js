export const getAnimeResponse = async (query, variables = {}) => {
  const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json", },
    body: JSON.stringify({ query, variables, }),
    cache: "no-store",
  })

  const result = await response.json()
  return result.data
}