const debounce = (func: () => void, wait: number) => {
  let timer: ReturnType<typeof setTimeout> | null = null
  return () => {
    const later = func
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(later, wait)
  }
}

export default debounce
