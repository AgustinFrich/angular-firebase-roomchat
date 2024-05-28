export class User {
  id: string;
  name: string;
  password: string;
  profileImg: string;
  connected: boolean;
  createdAt: number;
  updatedAt: number;
  mail: string;

  constructor(name: string, mail: string, password: string) {
    this.mail = mail;
    this.name = name;
    this.password = password;
    this.id = '';
    this.profileImg = '';
    this.connected = true;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }
}
