import { BrandMark } from './brand-mark';
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, distinctUntilChanged } from 'rxjs';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({selector:'app-root', imports:[RouterOutlet, RouterLink, RouterLinkActive, BrandMark], template: `
<button class="skip" type="button" (click)="conteudo.focus()">Pular para o conteúdo</button>
<header><a class="marca" routerLink="/" (click)="menu.set(false)" aria-label="CLAMA, início"><clama-brand-mark /><span class="brand-tagline"><span>MODA</span><span aria-hidden="true">·</span><span>MEMÓRIA</span><span aria-hidden="true">·</span><span>RESISTÊNCIA</span></span></a>
<button class="menu-toggle" type="button" (click)="menu.set(!menu())" [attr.aria-expanded]="menu()" [attr.aria-label]="menu() ? 'Fechar menu' : 'Abrir menu'" aria-controls="navegacao"><span class="menu-icon" aria-hidden="true"><span></span><span></span><span></span></span></button>
<nav id="navegacao" [class.aberto]="menu()" aria-label="Navegação principal">
@for(item of links; track item.id){<a [routerLink]="['/',item.id]" routerLinkActive="active" ariaCurrentWhenActive="page" (click)="menu.set(false)">{{item.nome}}</a>}
</nav></header>
<main #conteudo id="conteudo" tabindex="-1"><router-outlet /></main>
<footer>
 <div class="footer-brand"><a class="marca" routerLink="/" aria-label="CLAMA, início"><clama-brand-mark /></a><p>Moda como expressão.<br>Memória como resistência.</p></div>
 <section class="footer-voice" aria-labelledby="footer-voice-title">
  <p class="eyebrow">UM ESPAÇO DE ESCUTA</p>
  <h2 id="footer-voice-title">Sua voz também importa.</h2>
  <p>Há palavras que precisam encontrar espaço. Compartilhe uma reflexão ou uma mensagem com a equipe CLAMA, no seu tempo.</p>
  <p class="footer-voice-privacy">Sua mensagem é privada e não será publicada no site. Não pedimos nome nem contato.</p>
  <a class="text-link" routerLink="/vozes">Compartilhe sua voz <svg class="link-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 13 13 3M3 3h10v10" /></svg></a>
 </section>
 <div class="footer-support"><p>Informação também é acolhimento.</p><a class="text-link" routerLink="/realidade" fragment="apoio">Encontre apoio <svg class="link-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 13 13 3M3 3h10v10" /></svg></a></div>
 <small>CLAMA · Projeto de coleção autoral</small>
</footer>
`})
export class App {
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
 readonly links = [{id:'colecao',nome:'A coleção'},{id:'manifesto',nome:'Manifesto'},{id:'historia',nome:'Nossa história'},{id:'realidade',nome:'Dados e realidade'},{id:'editorial',nome:'Editorial'},{id:'vozes',nome:'Sua voz'},{id:'sobre-nos',nome:'Sobre Nós'},{id:'contato',nome:'Contato'}];
}
