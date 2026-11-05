import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LookGallery } from './look-gallery';
import { Look } from './look';
@Component({selector:'clama-manifesto',imports:[],templateUrl:'./manifesto.html'})
export class Manifesto {}
@Component({selector:'clama-historia',imports:[RouterLink],templateUrl:'./historia.html'})
export class History {}
@Component({selector:'clama-realidade',imports:[RouterLink],templateUrl:'./realidade.html'})
export class Reality {}
@Component({selector:'clama-editorial',imports:[LookGallery],templateUrl:'./editorial.html'})
export class Editorial {
 readonly makingOf: Pick<Look, 'id' | 'nome' | 'imagens'> = {
  id:7, nome:'Making of da CLAMA', imagens:[
   {src:'images/editorial/making-of-construcao.jpg',alt:'Saia vinho em construção no manequim do ateliê',legenda:'01 — Construção da saia'},
   {src:'images/editorial/making-of-1.png',alt:'Moldes de tecido branco dispostos sobre a mesa de trabalho',legenda:'02 — Preparação dos moldes'},
   {src:'images/editorial/making-of-2.png',alt:'Vestido estampado com aplicações de flores vermelhas durante a montagem',legenda:'03 — Aplicação das flores'},
   {src:'images/editorial/making-of-3.png',alt:'Flores vermelhas de tecido confeccionadas para a coleção',legenda:'04 — Flores artesanais'},
   {src:'images/editorial/making-of-4.png',alt:'Partes da modelagem identificadas sobre papel na mesa',legenda:'05 — Estudo da modelagem'},
   {src:'images/editorial/making-of-5.png',alt:'Equipe trabalhando na pintura do tecido de um vestido',legenda:'06 — Pintura coletiva'},
   {src:'images/editorial/making-of-6.png',alt:'Modelagem de um corpete com fitas sobre o manequim',legenda:'07 — Modelagem no manequim'},
   {src:'images/editorial/making-of-7.png',alt:'Tecido preto com frases de resistência feminina pintadas à mão',legenda:'08 — Palavras sobre o tecido'},
   {src:'images/editorial/making-of-8.png',alt:'Equipe segurando uma impressão com retrato feminino durante a preparação das peças',legenda:'09 — Preparação da imagem'},
   {src:'images/editorial/making-of-9.png',alt:'Detalhe do franzido em tecido vinho junto à máquina de costura',legenda:'10 — Detalhes da costura'},
   {src:'images/editorial/making-of-10.png',alt:'Equipe cortando tecido vermelho e costurando à máquina',legenda:'11 — Corte e confecção'},
   {src:'images/editorial/making-of-11.png',alt:'Preparação de tecido estampado com páginas de jornal sobre a mesa de trabalho',legenda:'12 — Construção da estampa'}
  ]
 };
}
export { Contact } from './contact';

@Component({selector:'clama-sobre-nos',imports:[RouterLink],templateUrl:'./sobre-nos.html'})
export class About {}
