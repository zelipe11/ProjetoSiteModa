export interface LookImage {
 src: string;
 alt: string;
 legenda: string;
 enquadramento?: 'esquerda' | 'direita';
}
export interface Look { id:number; slug:string; nome:string; frase:string; conceito:string; simbolismo:string; cor:string; imagens?:LookImage[]; }
