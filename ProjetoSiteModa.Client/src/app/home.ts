import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Look } from './look';
@Component({selector:'clama-home',imports:[RouterLink],templateUrl:'./app.html'})
export class Home {
 private readonly http = inject(HttpClient);
 readonly looks = signal<Look[]>([]);
 readonly loading = signal(true);
 readonly error = signal(false);
 readonly escrita = signal('');
 readonly frases = ['Minha voz pertence a mim.', 'Existir também é resistir.', 'Que a nossa presença abra caminhos.'];
 constructor(){this.carregar();}
 carregar(){this.loading.set(true);this.error.set(false);this.http.get<Look[]>('/api/looks').subscribe({next: data=>{this.looks.set(data);this.loading.set(false);},error:()=>{this.error.set(true);this.loading.set(false);}});}
}
