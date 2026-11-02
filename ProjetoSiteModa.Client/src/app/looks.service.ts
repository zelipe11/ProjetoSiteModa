import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../environments/environment';
import { Look } from './look';

@Injectable({ providedIn: 'root' })
export class LooksService {
  private readonly http = inject(HttpClient);

  listar() {
    return this.http.get<Look[]>(environment.githubPages ? 'data/looks.json' : '/api/looks');
  }

  obter(slug: string) {
    if (!environment.githubPages) {
      return this.http.get<Look>('/api/looks/' + encodeURIComponent(slug));
    }
    return this.listar().pipe(map(looks => {
      const look = looks.find(item => item.slug === slug);
      if (!look) throw new HttpErrorResponse({ status: 404, statusText: 'Look não encontrado' });
      return look;
    }));
  }
}
