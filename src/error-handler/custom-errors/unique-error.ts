export class UniqueError extends Error {
  constructor(message: string){
    super();
    this.message = message
  }
}
