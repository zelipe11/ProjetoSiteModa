import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
@Component({selector:'app-root', imports:[RouterOutlet, RouterLink], template: `
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<header><a class="marca" routerLink="/" (click)="menu.set(false)" aria-label="CLAMA, início">CLAMA<span>MODA · MEMÓRIA · RESISTÊNCIA</span></a>
<button class="menu-toggle" (click)="menu.set(!menu())" [attr.aria-expanded]="menu()" aria-controls="navegacao">{{menu() ? 'Fechar' : 'Menu'}}</button>
<nav id="navegacao" [class.aberto]="menu()" aria-label="Navegação principal">
@for(item of links; track item.id){<a routerLink="/" [fragment]="item.id" (click)="menu.set(false)">{{item.nome}}</a>}
</nav></header>
<main id="conteudo" tabindex="-1"><router-outlet /></main>
<footer><a class="marca" routerLink="/">CLAMA</a><p>Moda como expressão.<br>Memória como resistência.</p><a routerLink="/" fragment="apoio">Encontre apoio ↗</a><small>CLAMA · Projeto de coleção autoral</small></footer>
`})
export class App {
 readonly menu = signal(false);
 readonly links = [{id:'colecao',nome:'A coleção'},{id:'manifesto',nome:'Manifesto'},{id:'historia',nome:'Nossa história'},{id:'realidade',nome:'Dados e realidade'},{id:'editorial',nome:'Editorial'},{id:'contato',nome:'Contato'}];
}
