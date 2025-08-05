

import { CollectionConfig } from 'payload';

const Verses: CollectionConfig = {
  slug: 'verses',
  auth: false,
  admin: {
    useAsTitle: 'reference',
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      required: true,
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
    {
      name: 'version',
      type: 'text',
      defaultValue: 'ESV',
    },
  ],
};

export default Verses;
