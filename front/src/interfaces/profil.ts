export interface LayoutProfil {
    x: number,
    y: number,
    w: number, 
    h: number, 
    i: string, 
    text?: string,
    static: false,
    img?: string,
    badge_img?: string,
    badge_text?: string,
    type: 'img' | 'badge' | 'text',
    type_badge_id?: number,

}
