import { Component, input } from '@angular/core';
import { Peca } from './look';

@Component({
 selector: 'clama-look-prices',
 template: `@if(pecas()?.length){<dl aria-label="Preços das peças">@for(peca of pecas(); track peca.nome){<div><dt>{{peca.nome}}</dt><dd>{{formatar(peca.preco)}}</dd></div>}</dl>}`,
 styles: [`
  :host{display:block}
  dl{margin:20px 0 0;padding:0;border-top:1px solid var(--line)}
  dl>div{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 16px;padding:12px 0;border-bottom:1px solid var(--line);font-size:13px;line-height:1.6}
  dt{color:var(--muted)}
  dd{margin:0;white-space:nowrap;font-variant-numeric:tabular-nums}
  @media(max-width:650px){dl>div{grid-template-columns:minmax(0,1fr)}}
 `]
})
export class LookPrices {
 readonly pecas = input<Peca[]>();
 private readonly moeda = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});
 formatar(preco:number){return this.moeda.format(preco);}
}
