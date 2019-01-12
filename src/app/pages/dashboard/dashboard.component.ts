import { Component, OnDestroy, NgZone } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { takeWhile } from 'rxjs/operators' ;
import { Planets } from '../../shared/planets.module';
import { PlanetsService } from '../../@core/data/planets.service';

import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './planets-dashboard.component.html',
})
export class DashboardComponent implements OnDestroy {

  private alive = true;

  public planets: Planets[]; 

  planetsForm = this.fb.group({
    nome: ['', Validators.required],
    clima: ['', Validators.required],
    terreno: ['', Validators.required],
  });

  planet;
  onHold = false;

  constructor(
    private planetsService: PlanetsService,
    private fb: FormBuilder,
    private router: Router) {}

public getPlanets(){
  this.planetsService.getPlanets().subscribe(
    (data: Planets[]) => {
      this.planets = data;
    }
  );
}

  public newPlanet() {
    this.onHold = true;
    var body = 
      'nome='+this.planetsForm.value.nome+
      '&clima='+this.planetsForm.value.clima+
      '&terreno='+this.planetsForm.value.terreno;
      
    this.planetsService.newPlanet(body).subscribe(
      (data) => {
        this.planetsForm.reset();
        this.planet = data;
        this.getPlanets();
        
        this.updateOnHold();
      }
    );
  }

  public deletePlanet(id) {

    this.planetsService.deletePlanet(id).subscribe(
      (data) => {
        this.planet = data;
        this.getPlanets();
      }
    );
  }

  public editPlanet(id){
    this.router.navigate(['/dashboard/edit/'+id]);
  }

  
  ngOnInit() {
    this.getPlanets();
    
  }

  ngOnDestroy() {
    this.alive = false;
  }

  public updateOnHold(){
    this.onHold = !this.onHold;
  }

}
