import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({selector:'clama-contato',templateUrl:'./contato.html'})
export class Contact {
 private readonly http = inject(HttpClient);
 private envioId: string | null = null;
 readonly celular = signal('');
 readonly nome = signal('');
 readonly mensagem = signal('');
 readonly email = signal('');
 readonly website = signal('');
 readonly enviando = signal(false);
 readonly sucesso = signal('');
 readonly erro = signal('');
 alterar(campo:'nome'|'mensagem'|'celular'|'email',value:string){this[campo].set(value);this.envioId=null;this.sucesso.set('');this.erro.set('');}
 enviar(event:Event){
  event.preventDefault();
  if(this.enviando()) return;
  this.erro.set('');this.sucesso.set('');
  if(this.nome().trim().length<2 || this.nome().trim().length>120){this.erro.set('Informe seu nome, entre 2 e 120 caracteres.');return;}
  if(this.mensagem().trim().length<3 || this.mensagem().trim().length>2000){this.erro.set('Escreva uma mensagem entre 3 e 2.000 caracteres.');return;}
  if(!/^(?:55)?[1-9]\d9\d{8}$/.test(this.celular().replace(/\D/g,''))){this.erro.set('Informe um celular válido com DDD.');return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email().trim())){this.erro.set('Informe um e-mail válido.');return;}
  this.envioId ??= crypto.randomUUID();
  this.enviando.set(true);
  this.http.post<{mensagem:string}>('api/contato',{id:this.envioId,nome:this.nome(),mensagem:this.mensagem(),celular:this.celular(),email:this.email(),website:this.website()}).subscribe({
   next:result=>{this.enviando.set(false);this.nome.set('');this.mensagem.set('');this.celular.set('');this.email.set('');this.envioId=null;this.sucesso.set(result.mensagem);},
   error:(e:HttpErrorResponse)=>{this.enviando.set(false);this.erro.set(typeof e.error?.mensagem==='string' ? e.error.mensagem : 'Não foi possível enviar. Seus dados foram mantidos; tente novamente mais tarde.');}
  });
 }
}
