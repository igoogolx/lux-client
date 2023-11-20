export const delay = async (time: number) => {
  return await new Promise((resolve) => {
    setTimeout(() => {
      resolve('done')
    }, time)
  })
}
