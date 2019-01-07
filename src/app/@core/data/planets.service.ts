import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { URL_PLANETS } from '../../app.config';
import { Planets } from '../../shared/planets.module';
import { NgxAuthModule } from '../../auth/auth.module';
import { NbAuthSimpleToken, NbAuthService } from '@nebular/auth';
import { map, catchError } from "rxjs/operators";
import { throwError as observableThrowError } from 'rxjs';
// let counter = 0;

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
    })
};

@Injectable()
export class PlanetsService {

    // private users = {
    //     nick: { name: 'Nick Jones', picture: 'assets/images/nick.png' },
    //     eva: { name: 'Eva Moor', picture: 'assets/images/eva.png' },
    //     jack: { name: 'Jack Williams', picture: 'assets/images/jack.png' },
    //     lee: { name: 'Lee Wong', picture: 'assets/images/lee.png' },
    //     alan: { name: 'Alan Thompson', picture: 'assets/images/alan.png' },
    //     kate: { name: 'Kate Martinez', picture: 'assets/images/kate.png' },
    // };

    // private userArray: any[];
    planets: Object;
    public auth: NgxAuthModule;
    token: string;
    t: any;

    constructor(
        private http: HttpClient, 
        private authService: NbAuthService
    ) {
        this.authService.onTokenChange()
            .subscribe((token: NbAuthSimpleToken) => {
                if (token.isValid()) {
                    this.t = token.getValue();
                    this.token = this.t.token;
                }
            });

        this.getHeaders();
        
    }

    public getPlanets(): Observable<Planets[]> {
        
        return this.http.get<Planets[]>(URL_PLANETS, httpOptions)
        .pipe(
            catchError(this.errorHandler)
        );

    }

    public getPlanet(id): Observable<Planets> {
        
        return this.http.get<Planets>(URL_PLANETS+'/'+id, httpOptions)
        .pipe(
            catchError(this.errorHandler)
        );

    }

    public newPlanet(planet): Observable<Planets[]> {

        return this.http.post<Planets[]>(URL_PLANETS, planet, httpOptions)
            .pipe(
                catchError(this.errorHandler)
            );

    }

    public editPlanet(id, planet): Observable<Planets[]> {

        return this.http.post<Planets[]>(URL_PLANETS+'/'+id, planet, httpOptions)
            .pipe(
                catchError(this.errorHandler)
            );

    }

    public deletePlanet(id): Observable<Planets[]> {

        return this.http.delete<Planets[]>(URL_PLANETS+'/'+id, httpOptions)
            .pipe(
                catchError(this.errorHandler)
            );

    }


    private getHeaders(){
        // let headers = new HttpHeaders(BASIC_REQUEST_HEADERS);
        let auth =  'Bearer ' + this.token;
        httpOptions.headers = httpOptions.headers.set('Authorization', auth);
    }

    errorHandler(error: HttpErrorResponse){
        return observableThrowError(error.message || "server error");
    }

}
