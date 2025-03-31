import { ParsedError } from './types'

export function analyzeErrorTrends(errors: ParsedError[]) {
    // Group similar errors
    const similarErrors = errors.reduce((acc, error) => {
        const key = error.summary.toLowerCase()
        return {
            ...acc,
            [key]: (acc[key] || 0) + 1
        }
    }, {} as Record<string, number>)

    // Find most common errors
    const commonErrors = Object.entries(similarErrors)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)

    return {
        similarErrors,
        commonErrors,
        totalErrors: errors.length,
        uniqueErrors: Object.keys(similarErrors).length
    }
}
