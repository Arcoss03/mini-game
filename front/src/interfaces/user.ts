import { type LayoutProfil } from './profil';
export interface signUp {
    email: string;
    pseudo: string;
    password: string;
  }
  
export interface logIn{
  username:string;
  password:string;
}

export interface User {
  id?: number;
  pseudo: string;
  email: string;
  password?: string;
}

export interface UserDetails {
  id?: number;
  pseudo: string;
  email: string;
  password?: string;
  profil: {layout: LayoutProfil[];}
  creation_date: Date;
}