import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({selector:'clama-vozes',templateUrl:'./vozes.html'})
export class Voices {
 private readonly http = inject(HttpClient);
 private envioId: string | null = null;
 readonly escrita = signal('');
 readonly consentimento = signal(false);
 readonly website = signal('');
 readonly enviando = signal(false);
 readonly sucesso = signal('');
 readonly erro = signal('');
 readonly frases = ['Minha voz pertence a mim.', 'Existir também é resistir.', 'Que a nossa presença abra caminhos.'];

 alterarTexto(value:string){this.escrita.set(value);this.envioId=null;this.sucesso.set('');this.erro.set('');}
 limpar(){if(!this.enviando()){this.alterarTexto('');this.consentimento.set(false);}}
 enviar(event:Event){
  event.preventDefault();
  if(this.enviando()) return;
  this.erro.set('');this.sucesso.set('');
  const texto=this.escrita().trim();
  if(texto.length < 3 || texto.length > 1000){this.erro.set('Escreva entre 3 e 1.000 caracteres.');return;}
  if(!this.consentimento()){this.erro.set('Confirme que deseja enviar o texto para a equipe CLAMA.');return;}
  this.envioId ??= crypto.randomUUID();
  this.enviando.set(true);
  this.http.post<{mensagem:string}>('api/vozes',{
   id:this.envioId,texto,consentimento:true,website:this.website()
  }).subscribe({
   next: result=>{
    this.enviando.set(false);this.escrita.set('');this.consentimento.set(false);this.envioId=null;
    this.sucesso.set(result.mensagem);
   },
   error:(e:HttpErrorResponse)=>{
    this.enviando.set(false);
    this.erro.set(typeof e.error?.mensagem === 'string' ? e.error.mensagem : 'Não foi possível enviar. Seu texto foi mantido; tente novamente mais tarde.');
   }
  });
 }
}
