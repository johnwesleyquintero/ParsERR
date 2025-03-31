import { ParsedError } from '@/lib/types'
import { Card } from './ui/card'
import { BarChart } from 'lucide-react'

interface ErrorStatsProps {
  errors: ParsedError[]
}

export function ErrorStats({ errors }: ErrorStatsProps) {
  const stats = errors.reduce((acc, error) => ({
    ...acc,
    [error.type]: (acc[error.type] || 0) + 1
  }), {} as Record<string, number>)

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center space-x-2 mb-2">
        <BarChart className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Error Statistics</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stats).map(([type, count]) => (
          <div key={type} className="text-center p-2 rounded-lg bg-muted">
            <div className="text-2xl font-bold">{count}</div>
            <div className="text-sm text-muted-foreground capitalize">{type}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
