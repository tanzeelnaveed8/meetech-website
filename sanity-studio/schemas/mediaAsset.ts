import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'mediaAsset',
  title: 'Media Asset',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'File',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['dimensions', 'palette', 'lqip'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'altText',
      title: 'Alt Text',
      type: 'string',
      description: 'Required for accessibility (WCAG 2.1 AA)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Hero', value: 'hero' },
          { title: 'Portfolio', value: 'portfolio' },
          { title: 'Team', value: 'team' },
          { title: 'Icon', value: 'icon' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'file',
      category: 'category',
    },
    prepare({ title, media, category }) {
      return {
        title,
        subtitle: category || 'Uncategorized',
        media,
      }
    },
  },
})
