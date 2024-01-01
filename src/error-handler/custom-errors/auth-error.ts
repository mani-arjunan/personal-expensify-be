export class AuthError extends Error {
  constructor(message: string){
    super()
    this.message = message
  }
}
