import { BrandMark } from './brand-mark';
import { Component, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, distinctUntilChanged } from 'rxjs';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
interface NavItem {
 id: string;
 nome: string;
 filhos?: { nome: string; rota: string; fragment?: string }[];
}

@Component({selector:'app-root', imports:[RouterOutlet, RouterLink, RouterLinkActive, BrandMark], host:{'(document:click)':'fecharFora($event)'}, template: `
<button class="skip" type="button" (click)="conteudo.focus()">Pular para o conteúdo</button>
<header><a class="marca" routerLink="/" (click)="fecharMenus()" aria-label="CLAMA, início"><clama-brand-mark /><span class="brand-tagline"><span>MODA</span><span aria-hidden="true">·</span><span>MEMÓRIA</span><span aria-hidden="true">·</span><span>RESISTÊNCIA</span></span></a>
<button id="menu-toggle" class="menu-toggle" type="button" (click)="menu.set(!menu()); submenu.set(null)" [attr.aria-expanded]="menu()" [attr.aria-label]="menu() ? 'Fechar menu' : 'Abrir menu'" aria-controls="navegacao"><span class="menu-icon" aria-hidden="true"><span></span><span></span><span></span></span></button>
<nav id="navegacao" [class.aberto]="menu()" aria-label="Navegação principal" (keydown.escape)="fecharComEscape($event)">
@for(item of links; track item.id){
 <div class="nav-item" (focusout)="sairDoItem($event,item.id)">
  <div class="nav-item-heading">
   <a [routerLink]="['/',item.id]" routerLinkActive="active" ariaCurrentWhenActive="page" (click)="fecharMenus()">{{item.nome}}</a>
   @if(item.filhos?.length){<button type="button" class="submenu-toggle" [id]="'submenu-toggle-' + item.id" [attr.aria-label]="(submenu() === item.id ? 'Fechar submenu de ' : 'Abrir submenu de ') + item.nome" [attr.aria-expanded]="submenu() === item.id" [attr.aria-controls]="'submenu-' + item.id" (click)="submenu.set(submenu() === item.id ? null : item.id)"><svg viewBox="0 0 12 8" aria-hidden="true" focusable="false"><path d="m1 1 5 5 5-5" /></svg></button>}
  </div>
  @if(item.filhos?.length){
   <ul class="nav-submenu" [id]="'submenu-' + item.id" [hidden]="submenu() !== item.id" [attr.aria-label]="'Seções de ' + item.nome">
    @for(filho of item.filhos; track filho.nome){<li><a [routerLink]="filho.rota" [fragment]="filho.fragment" (click)="fecharMenus()">{{filho.nome}}</a></li>}
   </ul>
  }
 </div>
}
</nav></header>
<main #conteudo id="conteudo" tabindex="-1"><router-outlet /></main>
<footer>
 <div class="footer-brand"><a class="marca" routerLink="/" aria-label="CLAMA, início"><clama-brand-mark /></a><p>Moda como expressão.<br>Memória como resistência.</p></div>
 <section class="footer-voice" aria-labelledby="footer-voice-title">
  <h2 id="footer-voice-title">Sua voz também importa.</h2>
  <p>Envie uma mensagem privada à equipe CLAMA.</p>
  <a class="text-link" routerLink="/vozes">Sua voz <svg class="link-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 13 13 3M3 3h10v10" /></svg></a>
 </section>
 <div class="footer-support"><a class="text-link" routerLink="/realidade" fragment="apoio">Encontre apoio <svg class="link-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 13 13 3M3 3h10v10" /></svg></a></div>
 <small>CLAMA · Projeto de coleção autoral</small>
</footer>
`})
export class App {
 private readonly document = inject(DOCUMENT);
 private readonly router = inject(Router);
 private readonly http = inject(HttpClient);
 constructor(){
  this.router.events.pipe(
   filter((event): event is NavigationEnd => event instanceof NavigationEnd),
   map(event => event.urlAfterRedirects.split(/[?#]/)[0].replace(/^\/+|\/+$/g,'')),
   distinctUntilChanged(),
   takeUntilDestroyed()
  ).subscribe(slug => {
   if(this.links.some(item => item.id === slug)){
    this.http.post<void>('/api/abas/'+encodeURIComponent(slug),null).subscribe({error:()=>{}});
   }
  });
 }
 readonly menu = signal(false);
 readonly submenu = signal<string | null>(null);
 fecharMenus(){this.menu.set(false);this.submenu.set(null);}
 fecharFora(event:MouseEvent){if(event.target instanceof Element && !event.target.closest('header')) this.fecharMenus();}
 sairDoItem(event:FocusEvent,id:string){if(this.submenu() === id && !(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) this.submenu.set(null);}
 fecharComEscape(event:Event){
  event.preventDefault();
  const id = this.submenu();
  if(id){this.submenu.set(null);this.document.getElementById('submenu-toggle-' + id)?.focus();}
  else{this.menu.set(false);this.document.getElementById('menu-toggle')?.focus();}
 }
 readonly links: NavItem[] = [
  {id:'colecao',nome:'A coleção',filhos:[
   {nome:'Todos os looks',rota:'/colecao'},
   {nome:'Dor',rota:'/colecao/dor'},{nome:'Danos',rota:'/colecao/danos'},
   {nome:'Culpa',rota:'/colecao/culpa'},{nome:'Resistência',rota:'/colecao/resistencia'},
   {nome:'Herança',rota:'/colecao/heranca'},{nome:'Libertação',rota:'/colecao/libertacao'}
  ]},
  {id:'manifesto',nome:'Manifesto',filhos:[
   {nome:'Memória',rota:'/manifesto',fragment:'memoria'},
   {nome:'Expressão',rota:'/manifesto',fragment:'expressao'},
   {nome:'Resistência',rota:'/manifesto',fragment:'resistencia'}
  ]},
  {id:'historia',nome:'Nossa história',filhos:[
   {nome:'Origem da CLAMA',rota:'/historia',fragment:'historia'},
   {nome:'Identidade da marca',rota:'/historia',fragment:'identity-title'},
   {nome:'Espaços da marca',rota:'/historia',fragment:'spaces-title'}
  ]},
  {id:'realidade',nome:'Dados e realidade',filhos:[
   {nome:'Dados sobre a violência',rota:'/realidade',fragment:'realidade'},
   {nome:'Encontre apoio',rota:'/realidade',fragment:'apoio'},
   {nome:'Mulheres que nos deram voz',rota:'/realidade',fragment:'women-title'},
   {nome:'Bertha Lutz',rota:'/realidade',fragment:'bertha-lutz'},
   {nome:'Maria da Penha',rota:'/realidade',fragment:'maria-da-penha'},
   {nome:'Carolina Dieckmann',rota:'/realidade',fragment:'carolina-dieckmann'},
   {nome:'Rose Leonel',rota:'/realidade',fragment:'rose-leonel'},
   {nome:'Bárbara Penna',rota:'/realidade',fragment:'barbara-penna'},
   {nome:'Araceli',rota:'/realidade',fragment:'araceli'}
  ]},
  {id:'editorial',nome:'Editorial',filhos:[
   {nome:'O universo do editorial',rota:'/editorial',fragment:'editorial'},
   {nome:'Bastidores e processo',rota:'/editorial',fragment:'backstage-title'}
  ]},
  {id:'vozes',nome:'Sua voz',filhos:[
   {nome:'Mensagens da CLAMA',rota:'/vozes',fragment:'mensagens-clama'},
   {nome:'Envie sua mensagem',rota:'/vozes',fragment:'compartilhar'}
  ]},
  {id:'sobre-nos',nome:'Sobre Nós',filhos:[
   {nome:'Quem somos',rota:'/sobre-nos',fragment:'about-title'},
   {nome:'Missão',rota:'/sobre-nos',fragment:'missao'},
   {nome:'Visão',rota:'/sobre-nos',fragment:'visao'},
   {nome:'Valores',rota:'/sobre-nos',fragment:'valores'},
   {nome:'Conheça a equipe',rota:'/sobre-nos',fragment:'team-title'}
  ]},
  {id:'contato',nome:'Contato'}
 ];
}
