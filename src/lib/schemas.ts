import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.email('Неверный email'),
  text: z.string().min(10, 'Сообщение слишком короткое'),
})

export const complaintSchema = z.object({
  text: z.string().min(10, 'Опишите проблему подробнее'),
  email: z.email('Неверный email').optional().or(z.literal('')),
})

export type ContactFormData = z.infer<typeof contactSchema>
export type ComplaintFormData = z.infer<typeof complaintSchema>
