export interface LayoutProfile {
    x: number,
    y: number,
    w: number, 
    h: number, 
    i: string, 
    text?: string,
    static: false,
    img?: string,
}

export interface ProfileImage {
    x: number,
    y: number,
    w: number, 
    h: number, 
    i: number, 
    img: string,
    static: false,
}