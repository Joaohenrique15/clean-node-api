export class MissingParamError extends Error {
  constructor (paramName: string) {
    super(`Mising param: ${paramName}`)
    this.name = 'MissingParamError'
  }
}
