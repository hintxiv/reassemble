// Convert seconds to mm:ss
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const formatSeconds = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toFixed().padStart(2, '0')}`
