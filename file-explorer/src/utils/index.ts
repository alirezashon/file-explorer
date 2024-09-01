let idCounter = 0

export const generateId = (): string => {
  idCounter += 1
  return `id_${idCounter}_${new Date().getTime()}`
}
