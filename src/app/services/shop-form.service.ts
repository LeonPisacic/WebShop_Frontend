import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private countryUrl = environment.ApiUrl + '/countries';
  private stateUrl = environment.ApiUrl + '/states';

  countries: Country[] = [];
  states: State[] = [];


  constructor(private http: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];

    //start with currnet month and loop through
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }

    return of(data); //wrapping object as observable
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    //start with currnet year and loop through next 10 years

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }

    return of(data); //wrapping object as observable
  }


  getCountries(): Observable<Country[]> {
    return this.http.get<GetResponseCountries>(this.countryUrl).pipe(
      map(resp => resp._embedded.countries)
    )
  }

  getStates(theCountryCode: string): Observable<State[]> {

    const searchUrl = `${this.stateUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.http.get<GetResponseStates>(searchUrl).pipe(
      map(state => state._embedded.states)
    )

  }

}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}


interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}