export interface Patch
{
    major: number,
    minor: number,
}

/**
 * Fancier patch handling is probably a good idea in the future
 * TODO
 */
export const CURRENT: Patch = {major: 5, minor: 4}
