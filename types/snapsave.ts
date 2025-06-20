import { z } from 'zod'

export const SnapSaveSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  results: z.array(z.object({
    resolution: z.string().optional(),
    url: z.string(),
    thumbnail: z.string().optional(),
    shouldRender: z.boolean().optional()
  }))
})

export type SnapSave = z.infer<typeof SnapSaveSchema>
