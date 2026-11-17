export interface LookImage {
 src: string;
 srcset?: string;
 alt: string;
 legenda: string;
 enquadramento?: 'esquerda' | 'direita';
 largura?: number;
 altura?: number;
 ajuste?: string;
}
export interface Peca { nome:string; preco:number; }
export interface Look { id:number; slug:string; nome:string; frase:string; conceito:string; simbolismo:string; cor:string; imagens?:LookImage[]; pecas?:Peca[]; }
