import { Routes } from '@angular/router';
import { Home } from './home';
import { Collection } from './collection';
import { LookPage } from './look-page';
import { Manifesto, History, Reality, Editorial, Voices, Contact, About } from './pages';
export const routes: Routes = [
 {path:'',component:Home,pathMatch:'full',title:'CLAMA — Moda, memória e resistência'},
 {path:'colecao',component:Collection,title:'A coleção — CLAMA'},
 {path:'colecao/silencio',redirectTo:'colecao/dor',pathMatch:'full'},
 {path:'colecao/ferida',redirectTo:'colecao/danos',pathMatch:'full'},
 {path:'colecao/ruptura',redirectTo:'colecao/culpa',pathMatch:'full'},
 {path:'colecao/florescer',redirectTo:'colecao/heranca',pathMatch:'full'},
 {path:'colecao/voz',redirectTo:'colecao/libertacao',pathMatch:'full'},
 {path:'colecao/:slug',component:LookPage,title:'A coleção — CLAMA'},
 {path:'manifesto',component:Manifesto,title:'Manifesto — CLAMA'},
 {path:'historia',component:History,title:'Nossa história — CLAMA'},
 {path:'realidade',component:Reality,title:'Dados e realidade — CLAMA'},
 {path:'editorial',component:Editorial,title:'Editorial — CLAMA'},
 {path:'vozes',component:Voices,title:'Sua voz também importa — CLAMA'},
 {path:'sobre-nos',component:About,title:'Sobre Nós — CLAMA'},
 {path:'contato',component:Contact,title:'Contato — CLAMA'},
 {path:'**',redirectTo:''}
];
