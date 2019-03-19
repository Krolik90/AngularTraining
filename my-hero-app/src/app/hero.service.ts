import { Injectable } from '@angular/core'; // import dekoratora
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // dostepny w całej app
})
export class HeroService {
  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService
    ) { }

  private heroesUrl = 'api/heroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>( this.heroesUrl ).pipe(
      tap( () => this.log( 'fetched heroes' ) ),
      catchError( this.handleError<Hero[]>('getHeroes', []) )
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${ this.heroesUrl }/${ id }`;
    return this.httpClient.get<Hero>(url).pipe(
      tap( () => this.log(`fetched hero id=${ id }`)),
      catchError( this.handleError<Hero>( `getHero id=${ id }`))
    );
  }

  updateHero (hero: Hero): Observable<any> {
    return this.httpClient.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap( () => this.log(`updated hero id=${hero.id}`) ),
      catchError( this.handleError<any>('updated Hero') )
    );
  }

  addHero ( hero: Hero ): Observable<Hero> {
    return this.httpClient.post<Hero>( this.heroesUrl, hero, this.httpOptions ).pipe(
      tap( (newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`) ),
      catchError( this.handleError<Hero>('addHero') )
    );
  }

  deleteHero ( hero: Hero | number ): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${ this.heroesUrl }/${ id }`;

    return this.httpClient.delete<Hero>( url, this.httpOptions ).pipe(
      tap( () => this.log(`delete hero id=${ id }`) ),
      catchError( this.handleError<Hero>('deleteHero') )
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if ( !term.trim() ) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.httpClient.get<Hero[]>(`${ this.heroesUrl }/?name=${ term }`).pipe(
      tap( () => this.log(`found heroes matching "${ term }"`) ),
      catchError( this.handleError<Hero[]>('searchHeroes', []) )
    );
  }

  private log( message: string ) {
    this.messageService.add(`HeroService: ${ message }`);
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
 
    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead
 
    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);
 
    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}
