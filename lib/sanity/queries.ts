import { sanityClient } from './client'

export async function getPages(params?: {
  region?: string
  pageType?: string
  status?: string
}) {
  const { region, pageType, status = 'published' } = params || {}

  let query = `*[_type == "page"`

  const filters: string[] = []
  if (region) filters.push(`region == "${region}"`)
  if (pageType) filters.push(`pageType == "${pageType}"`)
  if (status) filters.push(`status == "${status}"`)

  if (filters.length > 0) {
    query += ` && ${filters.join(' && ')}`
  }

  query += `] | order(_createdAt desc)`

  return sanityClient.fetch(query)
}

export async function getPageBySlug(slug: string, region: string) {
  const query = `*[_type == "page" && slug.current == $slug && region == $region && status == "published"][0]{
    _id,
    title,
    slug,
    region,
    pageType,
    metaTitle,
    metaDescription,
    status,
    publishedAt,
    _createdAt,
    _updatedAt,
    "blocks": blocks[]-> {
      _id,
      name,
      blockType,
      content,
      order
    }
  }`

  return sanityClient.fetch(query, { slug, region })
}

export async function getPageById(id: string) {
  const query = `*[_type == "page" && _id == $id][0]{
    _id,
    title,
    slug,
    region,
    pageType,
    metaTitle,
    metaDescription,
    status,
    publishedAt,
    _createdAt,
    _updatedAt,
    "blocks": blocks[]-> {
      _id,
      name,
      blockType,
      content,
      order
    }
  }`

  return sanityClient.fetch(query, { id })
}

export async function getContentBlocks() {
  const query = `*[_type == "contentBlock"] | order(order asc)`
  return sanityClient.fetch(query)
}

export async function getContentBlockById(id: string) {
  const query = `*[_type == "contentBlock" && _id == $id][0]`
  return sanityClient.fetch(query, { id })
}

export async function getMediaAssets(category?: string) {
  let query = `*[_type == "mediaAsset"`

  if (category) {
    query += ` && category == "${category}"`
  }

  query += `] | order(_createdAt desc)`

  return sanityClient.fetch(query)
}
