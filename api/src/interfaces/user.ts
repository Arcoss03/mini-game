export interface User {
    pseudo: string;
    email: string;
    password: string;
    profil_picture: string;
    profil:JSON | null;
    creation_date: Date;
    description: string;
}

export interface UserLogin {
    username: string;
    password: string;
}

export interface ModifPassword{
    oldPassword: string;
    newPassword: string;
}