import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { customAlphabet } from 'nanoid'

/**
 * Merge Tailwind classes
 * @param classes - Tailwind classes
 * @returns Merged Tailwind classes
 */
export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes))
}

/**
 * I'm just a box
 * @param size - Size in rem
 * @returns Tailwind width and height
 */
export function size(size: number | string) {
  return `w-${size} h-${size}`
}

export const center = 'justify-center items-center'

/** Random UInt32 (0 < n < 2^32) */
export function randInt() {
  return Math.floor(Math.random() * 2 ** 32)
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string

/**
 * Delay for a number of seconds
 * @param seconds - Number of seconds to delay
 */
export function sleep(sec: number) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000))
}

/**
 * Converts the given data to a base64 encoded string.
 * @param data The data to be converted.
 * @throws If the data cannot be converted to JSON.
 * @returns The base64 encoded string.
 */
export function toB64(data: unknown) {
  return Buffer.from(JSON.stringify(data)).toString('base64')
}

/**
 * Decodes a base64 string and parses it as JSON.
 * @param data - The base64 string to decode and parse.
 * @thows If the data cannot be parsed as JSON.
 * @returns The parsed JSON object.
 */
export function fromB64<T>(data: string): T {
  return JSON.parse(Buffer.from(data, 'base64').toString())
}

export function dec2(n: number) {
  return Math.round(n * 100) / 100
}

/** Generate a vector object */
export function vec(x: number, y: number) {
  return { x, y }
}

export const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1)

/**
 * Returns a new object with only the specified keys of the original object.
 * @param obj - The original object.
 * @param keys - The keys to pick from the original object.
 * @returns A new object with only the specified keys of the original object.
 */
export function pick<T, K extends keyof T>(obj: T, keys: K[]) {
  return keys.reduce((a, k) => {
    a[k] = obj[k]
    return a
  }, {} as Pick<T, K>)
}

/**
 * Get a list of result values from a list of promises.
 * Only returns the values of fulfilled promises.
 * @param promises - List of promises.
 * @returns Result values from fulfilled promises.
 */
export async function allFulfilled<const T>(values: T[]) {
  const settled = await Promise.allSettled(values)

  return settled.reduce(
    (acc, result) =>
      result.status === 'fulfilled' ? [...acc, result.value] : acc,
    [] as Awaited<T>[]
  )
}
