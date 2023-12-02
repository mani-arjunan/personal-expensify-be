export const logger = {
  info: (message: string, ...args: unknown[]) => {
      console.info(message, args.join('').toString())
  },
  log: (message: string, ...args: unknown[]) => {
      console.log(message, args.join('').toString());
  },
  error: (message: string, ...args: unknown[]) => {
      console.error(message, args.join('').toString());
  }
}
