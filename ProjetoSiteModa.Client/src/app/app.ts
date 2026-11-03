import { BrandMark } from './brand-mark';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({selector:'app-root', imports:[RouterOutlet, RouterLink, RouterLinkActive, BrandMark], template: `
<button class="skip" type="button" (click)="conteudo.focus()">Pular para o conteúdo</button>
<header><a class="marca" routerLink="/" (click)="menu.set(false)" aria-label="CLAMA, início"><clama-brand-mark /><span class="brand-tagline"><span>MODA</span><span aria-hidden="true">·</span><span>MEMÓRIA</span><span aria-hidden="true">·</span><span>RESISTÊNCIA</span></span></a>
<button class="menu-toggle" type="button" (click)="menu.set(!menu())" [attr.aria-expanded]="menu()" [attr.aria-label]="menu() ? 'Fechar menu' : 'Abrir menu'" aria-controls="navegacao"><span class="menu-icon" aria-hidden="true"><span></span><span></span><span></span></span></button>
<nav id="navegacao" [class.aberto]="menu()" aria-label="Navegação principal">
@for(item of links; track item.id){<a [routerLink]="['/',item.id]" routerLinkActive="active" ariaCurrentWhenActive="page" (click)="menu.set(false)">{{item.nome}}</a>}
</nav></header>
<main #conteudo id="conteudo" tabindex="-1"><router-outlet /></main>
<footer><a class="marca" routerLink="/" aria-label="CLAMA, início"><clama-brand-mark /></a><p>Moda como expressão.<br>Memória como resistência.</p><a routerLink="/realidade" fragment="apoio">Encontre apoio ↗</a><small>CLAMA · Projeto de coleção autoral</small></footer>
`})
export class App {
 readonly menu = signal(false);
 readonly links = [{id:'colecao',nome:'A coleção'},{id:'manifesto',nome:'Manifesto'},{id:'historia',nome:'Nossa história'},{id:'realidade',nome:'Dados e realidade'},{id:'editorial',nome:'Editorial'},{id:'vozes',nome:'Sua voz'},{id:'sobre-nos',nome:'Sobre Nós'},{id:'contato',nome:'Contato'}];
}
