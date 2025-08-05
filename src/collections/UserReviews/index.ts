import { CollectionConfig } from 'payload';

const UserReviews: CollectionConfig = {
  slug: 'user-reviews',
  auth: false,
  admin: {
    useAsTitle: 'card',
  },
  fields: [
    {
      name: 'card',
      type: 'relationship',
      relationTo: 'user-cards',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'score',
      type: 'number',
      required: true,
      admin: {
        description: 'SRS grade: 0-5 (5 = perfect recall)',
      },
    },
    {
      name: 'reviewedAt',
      type: 'date',
      defaultValue: () => new Date(),
    },
  ],
};

export default UserReviews;
