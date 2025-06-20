import { z } from 'zod'

export const SnapSaveArgsSchema = z.tuple([z.string()])
export const SnapSaveSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  results: z.array(z.object({
    resolution: z.string().optional(),
    thumbnail: z.string(),
    url: z.string(),
    shouldRender: z.boolean().optional()
  }))
})

export type SnapSave = z.infer<typeof SnapSaveSchema>