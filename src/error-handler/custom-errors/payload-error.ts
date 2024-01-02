export class PayloadError extends Error {
  constructor(message: string){
    super();
    this.message = message
  }
}
