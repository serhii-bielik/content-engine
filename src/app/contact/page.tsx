import type { Metadata } from 'next'
import { ContactForm } from '@/components/widgets/ContactForm'

export const metadata: Metadata = {
  title: 'Контакты',
}

export default function ContactPage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-2">Контакты</h1>
      <p className="text-muted-foreground mb-6 text-sm">
        Есть вопросы или предложения? Напишите нам.
      </p>
      <ContactForm />
    </div>
  )
}
