import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      options: {
        list: [
          { title: 'UAE', value: 'UAE' },
          { title: 'USA', value: 'USA' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Home', value: 'home' },
          { title: 'Services', value: 'services' },
          { title: 'Solutions', value: 'solutions' },
          { title: 'Case Studies', value: 'case-studies' },
          { title: 'Process', value: 'process' },
          { title: 'About', value: 'about' },
          { title: 'Contact', value: 'contact' },
          { title: 'Privacy', value: 'privacy' },
          { title: 'Terms', value: 'terms' },
          { title: 'Blog', value: 'blog' },
          { title: 'Careers', value: 'careers' },
          { title: 'Resources', value: 'resources' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'SEO title (leave empty to use page title)',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'SEO description',
    }),
    defineField({
      name: 'blocks',
      title: 'Content Blocks',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'contentBlock' }] }],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      region: 'region',
      status: 'status',
      pageType: 'pageType',
    },
    prepare({ title, region, status, pageType }) {
      return {
        title,
        subtitle: `${region} - ${pageType} - ${status}`,
      }
    },
  },
})
