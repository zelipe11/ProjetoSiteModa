import { BrandMark } from './brand-mark';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({selector:'clama-home',imports:[RouterLink, BrandMark],templateUrl:'./app.html'})
export class Home {}
