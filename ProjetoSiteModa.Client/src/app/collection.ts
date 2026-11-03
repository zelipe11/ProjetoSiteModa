import { LookGallery } from './look-gallery';
import { Component, inject, signal } from '@angular/core';
import { LooksService } from './looks.service';
import { RouterLink } from '@angular/router';
import { Look } from './look';
@Component({selector:'clama-collection',imports:[RouterLink, LookGallery],templateUrl:'./collection.html'})
export class Collection {
 private readonly catalogo = inject(LooksService);
 readonly looks = signal<Look[]>([]);
 readonly loading = signal(true);
 readonly error = signal(false);
 constructor(){this.carregar();}
 carregar(){this.loading.set(true);this.error.set(false);this.catalogo.listar().subscribe({next: data=>{this.looks.set(data);this.loading.set(false);},error:()=>{this.error.set(true);this.loading.set(false);}});}
}
