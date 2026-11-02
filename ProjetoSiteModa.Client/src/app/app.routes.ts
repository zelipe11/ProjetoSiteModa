import { Routes } from '@angular/router';
import { Home } from './home';
import { LookPage } from './look-page';
export const routes: Routes = [
 {path:'',component:Home,title:'CLAMA — Moda, memória e resistência'},
 {path:'colecao/:slug',component:LookPage,title:'A coleção — CLAMA'},
 {path:'**',redirectTo:''}
];
