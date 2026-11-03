import { Component, Input, OnChanges, OnDestroy, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Look } from './look';

@Component({selector:'clama-look-gallery',imports:[RouterLink],template:`
<div class="look-gallery" role="region" aria-roledescription="carrossel" [attr.aria-label]="'Imagens do vestido ' + look.nome" (mouseenter)="interacting = true" (mouseleave)="interacting = false" (focusin)="interacting = true" (focusout)="sairDoFoco($event)">
  <div class="gallery-stage">
    @for (image of look.imagens; track image.legenda; let i = $index) {
      <div class="gallery-slide" [hidden]="indice() !== i" role="group" aria-roledescription="imagem" [attr.aria-label]="image.legenda">
        <div class="gallery-view" [class.split-view]="image.enquadramento" [class.back-view]="image.enquadramento === 'direita'">
          <img [src]="image.src" [alt]="image.alt" loading="eager" decoding="async">
        </div>
      </div>
    }
    @if (linkDetalhes) {<a class="gallery-detail-link" [routerLink]="['/colecao',look.slug]" [attr.aria-label]="'Ver detalhes do vestido ' + look.nome"></a>}
    <span class="gallery-counter">{{indice() + 1}} / {{look.imagens?.length}}</span>
  </div>
  <div class="gallery-controls">
    <div class="gallery-tabs" aria-label="Escolher vista">
      @for (image of look.imagens; track image.legenda; let i = $index) {
        <button type="button" [class.selected]="indice() === i" [attr.aria-pressed]="indice() === i" (click)="selecionar(i)">{{image.legenda}}</button>
      }
    </div>
    <button type="button" class="gallery-pause" [attr.aria-label]="(pausado() ? 'Ativar' : 'Pausar') + ' troca automática de imagens de ' + look.nome" (click)="pausado.set(!pausado())">{{pausado() ? 'Reproduzir' : 'Pausar'}}</button>
  </div>
</div>
`})
export class LookGallery implements OnChanges, OnDestroy {
 @Input({required:true}) look!: Look;
 @Input() linkDetalhes = false;
 private readonly document = inject(DOCUMENT);
 readonly indice = signal(0);
 readonly pausado = signal(this.document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? true);
 interacting = false;
 private timer?: ReturnType<typeof setInterval>;
 ngOnChanges(){
  this.indice.set(0);
  if(this.timer) clearInterval(this.timer);
  if((this.look.imagens?.length ?? 0) > 1) this.timer = setInterval(()=>{
   if(!this.pausado() && !this.interacting && !this.document.hidden) this.indice.update(i=>(i+1) % this.look.imagens!.length);
  },5000);
 }
 selecionar(i:number){this.indice.set(i);}
 sairDoFoco(event:FocusEvent){if(!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) this.interacting=false;}
 ngOnDestroy(){if(this.timer) clearInterval(this.timer);}
}
