import { Routes } from '@angular/router';
import { Home } from './home';
import { Collection } from './collection';
import { LookPage } from './look-page';
import { Manifesto, History, Reality, Editorial, Voices, Contact } from './pages';
export const routes: Routes = [
 {path:'',component:Home,pathMatch:'full',title:'CLAMA — Moda, memória e resistência'},
 {path:'colecao',component:Collection,title:'A coleção — CLAMA'},
 {path:'colecao/:slug',component:LookPage,title:'A coleção — CLAMA'},
 {path:'manifesto',component:Manifesto,title:'Manifesto — CLAMA'},
 {path:'historia',component:History,title:'Nossa história — CLAMA'},
 {path:'realidade',component:Reality,title:'Dados e realidade — CLAMA'},
 {path:'editorial',component:Editorial,title:'Editorial — CLAMA'},
 {path:'vozes',component:Voices,title:'Sua voz também importa — CLAMA'},
 {path:'contato',component:Contact,title:'Contato — CLAMA'},
 {path:'**',redirectTo:''}
];
