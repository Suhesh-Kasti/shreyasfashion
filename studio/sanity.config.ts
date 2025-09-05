import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {schemaTypes} from './schemas'
import {structure} from './structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'dza4wxfw'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'shreyas-fashion-studio',
  title: "Shreya's Fashion Studio",
  
  projectId,
  dataset,
  
  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
    colorInput(),
  ],
  
  schema: {
    types: schemaTypes,
  },
  
  // Studio customization
  
  // Document actions
  document: {
    actions: (prev, context) => {
      return prev
    },
  },

  // Environment-specific settings
  ...(process.env.NODE_ENV === 'development' && {
    // Development-only settings
  }),
})
