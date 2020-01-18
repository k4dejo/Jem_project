export class ChangeAdmin {
  constructor(
      public oldPass: string,
      public newPass: string,
      public rePass: string,
      public priority: string
  ) {}
}
