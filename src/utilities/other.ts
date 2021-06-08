// Python kinda slaps tbh
export function * range(start: number, end: number): Generator<number> {
    const size = end - start

    if (size < 1) { return }

    for (const i of [...Array(size).keys()]) {
        yield i + start
    }
}
