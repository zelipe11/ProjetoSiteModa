import { LookImageView } from './look-image';
import { Component, Input, OnChanges, OnDestroy, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Look } from './look';

@Component({selector:'clama-look-gallery',imports:[RouterLink, LookImageView],template:`
<div class="look-gallery" [class.compact]="linkDetalhes" role="region" aria-roledescription="carrossel" [attr.aria-label]="'Imagens do vestido ' + look.nome" (mouseenter)="hovered = true" (mouseleave)="hovered = false" (focusin)="focused = true" (focusout)="sairDoFoco($event)">
  <div class="gallery-stage">
    @for (image of look.imagens; track image.legenda; let i = $index) {
      <div class="gallery-slide" [id]="panelId(i)" [hidden]="indice() !== i" [attr.role]="linkDetalhes ? 'group' : 'tabpanel'" [attr.aria-label]="linkDetalhes ? image.legenda : null" [attr.aria-labelledby]="linkDetalhes ? null : tabId(i)">
        <div class="gallery-view"><clama-look-image [image]="image" /></div>
      </div>
    }
    @if (linkDetalhes) {<a class="gallery-detail-link" [routerLink]="['/colecao',look.slug]" [attr.aria-label]="'Ver detalhes do vestido ' + look.nome"></a>}
    @if ((look.imagens?.length ?? 0) > 1) {
      <button type="button" class="gallery-arrow gallery-arrow-prev" [attr.aria-label]="'Imagem anterior de ' + look.nome" (click)="mover(-1)"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m15 5-7 7 7 7" /></svg></button>
      <button type="button" class="gallery-arrow gallery-arrow-next" [attr.aria-label]="'Próxima imagem de ' + look.nome" (click)="mover(1)"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m9 5 7 7-7 7" /></svg></button>
    }
    <span class="gallery-counter">{{indice() + 1}} / {{look.imagens?.length}}</span>
  </div>
  @if (!linkDetalhes) {
  <div class="gallery-thumbnails" role="tablist" [attr.aria-label]="'Escolher imagem do vestido ' + look.nome">
    @for (image of look.imagens; track image.legenda; let i = $index) {
      <button type="button" role="tab" class="gallery-thumb" [id]="tabId(i)" [class.selected]="indice() === i" [attr.aria-selected]="indice() === i" [attr.aria-controls]="panelId(i)" [attr.aria-label]="image.legenda" [attr.title]="image.legenda" [attr.tabindex]="indice() === i ? 0 : -1" (click)="selecionar(i)" (keydown)="teclado($event,i)"><clama-look-image [image]="image" [decorative]="true" /></button>
    }
  </div>
  }
</div>
`})
export class LookGallery implements OnChanges, OnDestroy {
 @Input({required:true}) look!: Look;
 @Input() linkDetalhes = false;
 private readonly document = inject(DOCUMENT);
 readonly indice = signal(0);
 readonly pausado = signal(this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? true);
 hovered = false;
 focused = false;
 private timer?: ReturnType<typeof setInterval>;
 ngOnChanges(){
  this.indice.set(0);
  if(this.timer) clearInterval(this.timer);
  if((this.look.imagens?.length ?? 0) > 1) this.timer = setInterval(()=>{
   if(!this.pausado() && !this.hovered && !this.focused && !this.document.hidden) this.indice.update(i=>(i+1) % this.look.imagens!.length);
  },5000);
 }
 tabId(i:number){return 'look-' + this.look.id + (this.linkDetalhes ? '-card' : '-detail') + '-tab-' + i;}
 panelId(i:number){return this.tabId(i) + '-panel';}
 selecionar(i:number){this.indice.set(i);this.pausado.set(true);}
 mover(delta:number){
  const count=this.look.imagens?.length ?? 0;
  if(count > 1) this.selecionar((this.indice()+delta+count)%count);
 }
 teclado(event:KeyboardEvent,i:number){
  const count=this.look.imagens?.length ?? 0;
  if(!count || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
  event.preventDefault();
  const next=event.key === 'Home' ? 0 : event.key === 'End' ? count-1 : (i+(['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1)+count)%count;
  this.selecionar(next);
  this.document.getElementById(this.tabId(next))?.focus();
 }
 sairDoFoco(event:FocusEvent){if(!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) this.focused=false;}
 ngOnDestroy(){if(this.timer) clearInterval(this.timer);}
}
