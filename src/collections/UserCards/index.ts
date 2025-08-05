import { CollectionConfig } from 'payload';

const UserCards: CollectionConfig = {
  slug: 'user-cards',
  auth: false,
  admin: {
    useAsTitle: 'verse',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'collection',
      type: 'relationship',
      relationTo: 'user-collections',
      required: true,
    },
    {
      name: 'verse',
      type: 'relationship',
      relationTo: 'verses',
      required: true,
    },
    {
      name: 'dueDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Next review date (based on SRS algorithm)',
      },
    },
    {
      name: 'interval',
      type: 'number',
      defaultValue: 1, // days
    },
    {
      name: 'easeFactor',
      type: 'number',
      defaultValue: 2.5,
    },
    {
      name: 'repetitions',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'lastReviewed',
      type: 'date',
    },
  ],
};

export default UserCards;
