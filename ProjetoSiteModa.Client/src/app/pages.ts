import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({selector:'clama-manifesto',imports:[],templateUrl:'./manifesto.html'})
export class Manifesto {}
@Component({selector:'clama-historia',imports:[RouterLink],templateUrl:'./historia.html'})
export class History {}
@Component({selector:'clama-realidade',imports:[],templateUrl:'./realidade.html'})
export class Reality {}
@Component({selector:'clama-editorial',imports:[],templateUrl:'./editorial.html'})
export class Editorial {}
@Component({selector:'clama-contato',imports:[RouterLink],templateUrl:'./contato.html'})
export class Contact {}

@Component({selector:'clama-sobre-nos',imports:[RouterLink],templateUrl:'./sobre-nos.html'})
export class About {}
