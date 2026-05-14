import { prisma } from '@/lib/prisma'
import { ReviewMessageButton } from '@/components/admin/ReviewMessageButton'

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    where: { isReviewed: false },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Сообщения ({messages.length})</h1>

      {messages.length === 0 ? (
        <p className="text-muted-foreground">Новых сообщений нет</p>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <div key={message.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mt-1">
                    {message.text}
                  </p>
                  {message.name && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Name: {message.name}
                    </p>
                  )}
                  {message.email && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Email: {message.email}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(message.createdAt).toLocaleString('ru-RU')}
                  </p>
                </div>
                <ReviewMessageButton messageId={message.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
