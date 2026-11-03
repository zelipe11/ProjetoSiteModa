import { LookGallery } from './look-gallery';
import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LooksService } from './looks.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';
import { Look } from './look';
@Component({selector:'clama-look',imports:[RouterLink, LookGallery],template:`
<section class="section look-page">
<a routerLink="/colecao" class="text-link">← Voltar à coleção</a>
@if(loading()){<p role="status">Carregando look…</p>}
@if(error()){<h1>{{notFound() ? 'Look não encontrado.' : 'Não foi possível carregar o look.'}}</h1><p>{{notFound() ? 'Explore os seis momentos da coleção.' : 'Verifique sua conexão e tente novamente.'}}</p>@if(!notFound()){<button class="outline-link dark" (click)="carregar()">Tentar novamente</button>}}
@if(look(); as p){
<div class="detail-heading"><p class="eyebrow">A COLEÇÃO / 0{{p.id}} DE 06</p><h1>{{p.nome}}</h1><p>{{p.frase}}</p></div>
@if(p.imagens?.length){<div class="detail-gallery"><clama-look-gallery [look]="p" /></div>}@else{<div class="detail-photos"><figure><div class="image-space" [style.--look-color]="p.cor"><span class="image-label">FOTOGRAFIA FRONTAL A INSERIR</span></div><figcaption>01 — Frente</figcaption></figure><figure><div class="image-space" [style.--look-color]="p.cor"><span class="image-label">FOTOGRAFIA TRASEIRA A INSERIR</span></div><figcaption>02 — Costas</figcaption></figure></div>
}
<div class="detail-copy"><div><p class="eyebrow">A IDEIA POR TRÁS DA PEÇA</p><h2>Uma forma de<br><em>dizer.</em></h2></div><div><h3>Conceito e inspiração</h3><p>{{p.conceito}}</p><h3>Significado simbólico</h3><p>{{p.simbolismo}}</p><p class="editor-note">Leitura conceitual proposta para o site, sujeita à validação da equipe CLAMA.</p><details><summary>Materiais e técnicas</summary><p>A ficha técnica desta peça será incluída pela equipe da coleção.</p></details><details><summary>Detalhes da construção</summary><p>Os detalhes de modelagem, acabamentos e processo serão incluídos junto às imagens da peça.</p></details></div></div>
<div class="look-next"><a routerLink="/colecao">Todos os looks</a><a [routerLink]="['/colecao',proximo(p.id)]">{{p.id === 6 ? 'Voltar a Dor' : 'Próximo momento'}} →</a></div>
}
</section>`})
export class LookPage {
 private readonly catalogo = inject(LooksService);
 private readonly route = inject(ActivatedRoute);
 private readonly title = inject(Title);
 readonly look = signal<Look|null>(null);
 readonly loading = signal(true);
 readonly error = signal(false);
 readonly notFound = signal(false);
 constructor(){this.route.paramMap.pipe(tap(()=>this.reset()),switchMap(params=>this.request(params.get('slug') || '')),takeUntilDestroyed()).subscribe(p=>this.receber(p));}
 private reset(){this.loading.set(true);this.error.set(false);this.notFound.set(false);this.look.set(null);}
 private request(slug:string){return this.catalogo.obter(slug).pipe(catchError((e:HttpErrorResponse)=>{this.error.set(true);this.notFound.set(e.status === 404);return of(null);}));}
 private receber(p:Look|null){this.look.set(p);this.loading.set(false);this.title.setTitle(p ? p.nome+' — CLAMA' : 'A coleção — CLAMA');}
 carregar(){this.reset();this.request(this.route.snapshot.paramMap.get('slug') || '').subscribe(p=>this.receber(p));}
 proximo(id:number){return ['dor','danos','ruptura','resistencia','florescer','voz'][id % 6];}
}
