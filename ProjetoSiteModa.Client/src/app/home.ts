import { BrandMark } from './brand-mark';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { RouterLink } from '@angular/router';
import { LooksService } from './looks.service';
@Component({selector:'clama-home',imports:[RouterLink, BrandMark],templateUrl:'./app.html'})
export class Home {
 readonly looks = toSignal(inject(LooksService).listar().pipe(catchError(() => of([]))), { initialValue: [] });
}
