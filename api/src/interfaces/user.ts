export interface User {
    id?: number;
    pseudo: string;
    email: string;
    password: string;
    profil:JSON | null;
    creation_date: Date;
}

export interface UserLogin {
    username: string;
    password: string;
}