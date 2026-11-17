import { Component, Input } from '@angular/core';
import { LookImage } from './look';

let nextClipId = 0;

@Component({selector:'clama-look-image',template:`
@if(image.enquadramento && image.largura && image.altura){
 <svg [attr.viewBox]="viewBox()" [style.translate]="image.ajuste" preserveAspectRatio="xMidYMid meet" role="img" [attr.aria-label]="decorative ? null : image.alt" [attr.aria-hidden]="decorative ? 'true' : null" focusable="false">
  <defs><clipPath [id]="clipId" clipPathUnits="userSpaceOnUse"><rect [attr.x]="inicio()" y="0" [attr.width]="image.largura / 2" [attr.height]="image.altura" /></clipPath></defs>
  <image [attr.clip-path]="'url(#' + clipId + ')'" [attr.href]="image.src" [attr.width]="image.largura" [attr.height]="image.altura" />
 </svg>
}@else{
 <img [src]="image.src" [attr.srcset]="image.srcset" sizes="(max-width: 650px) 85vw, 600px" [class.editorial-photo]="image.src.startsWith('images/clama/')" [style.translate]="image.ajuste" [alt]="decorative ? '' : image.alt" [loading]="decorative ? 'lazy' : 'eager'" decoding="async">
}
`})
export class LookImageView {
 @Input({required:true}) image!: LookImage;
 @Input() decorative = false;
 readonly clipId = `look-image-clip-${nextClipId++}`;
 inicio(){return this.image.enquadramento === 'direita' ? this.image.largura! / 2 : 0;}
 viewBox(){
  const half=this.image.largura! / 2;
  return `${this.image.enquadramento === 'direita' ? half : 0} 0 ${half} ${this.image.altura}`;
 }
}
