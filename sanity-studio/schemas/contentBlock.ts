import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contentBlock',
  title: 'Content Block',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Internal name for reference',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'blockType',
      title: 'Block Type',
      type: 'string',
      options: {
        list: [
          { title: 'Hero', value: 'hero' },
          { title: 'Features', value: 'features' },
          { title: 'Testimonials', value: 'testimonials' },
          { title: 'Call to Action', value: 'cta' },
          { title: 'Text', value: 'text' },
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
          { title: 'Form', value: 'form' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'object',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
        }),
        defineField({
          name: 'subheading',
          title: 'Subheading',
          type: 'string',
        }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'array',
          of: [{ type: 'block' }],
        }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
          ],
        }),
        defineField({
          name: 'ctaText',
          title: 'CTA Text',
          type: 'string',
        }),
        defineField({
          name: 'ctaUrl',
          title: 'CTA URL',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order on page',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      blockType: 'blockType',
      order: 'order',
    },
    prepare({ title, blockType, order }) {
      return {
        title,
        subtitle: `${blockType} - Order: ${order}`,
      }
    },
  },
})
