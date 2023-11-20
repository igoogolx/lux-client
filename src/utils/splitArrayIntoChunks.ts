export default function splitArrayIntoChunks<T> (arr: T[], chunkSize = 4) {
  const result = []

  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize))
  }

  return result
}
