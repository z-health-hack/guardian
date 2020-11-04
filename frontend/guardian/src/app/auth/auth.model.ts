export class AuthToken {
  public token: string;
}

export class AuthRequest {
  constructor(public username: string, public password: string) {
  }
}
