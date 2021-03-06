export class AuthToken {
  public token: string;
}

export class AuthRequest {
  constructor(public username: string, public password: string) {
  }
}

export class UserProfile {
  public id: number;
  public username: string;
  // tslint:disable-next-line:variable-name
  public first_name: string;
  // tslint:disable-next-line:variable-name
  public last_name: string;
}

export class PatientDetail {
  // tslint:disable-next-line:variable-name
  public date_of_birth: string;
  // tslint:disable-next-line:variable-name
  public date_of_diagnosis: string;
  // tslint:disable-next-line:variable-name
  public emergency_contact: string;
  public address: string;
  public allergies: string;
  public notes: string;
}
