import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({selector:'clama-manifesto',imports:[],templateUrl:'./manifesto.html'})
export class Manifesto {}
@Component({selector:'clama-historia',imports:[RouterLink],templateUrl:'./historia.html'})
export class History {}
@Component({selector:'clama-realidade',imports:[],templateUrl:'./realidade.html'})
export class Reality {}
@Component({selector:'clama-editorial',imports:[],templateUrl:'./editorial.html'})
export class Editorial {}
@Component({selector:'clama-vozes',imports:[],templateUrl:'./vozes.html'})
export class Voices {readonly escrita = signal(''); readonly frases = ['Minha voz pertence a mim.', 'Existir também é resistir.', 'Que a nossa presença abra caminhos.'];}
@Component({selector:'clama-contato',imports:[RouterLink],templateUrl:'./contato.html'})
export class Contact {}
