import { Component, OnInit } from '@angular/core';
import { Planets } from '../../shared/planets.module';
import { PlanetsService } from '../../@core/data/planets.service';

import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'ngx-edit',
    styleUrls: ['./edit.component.scss'],
    templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {

    planetsForm = this.fb.group({
        nome: ['', Validators.required],
        clima: ['', Validators.required],
        terreno: ['', Validators.required],
    });

    planet;
    onHold = false;
    id: number = 0;

    constructor(
        private planetsService: PlanetsService,
        private fb: FormBuilder,
        private route: ActivatedRoute) {
    }

    public getPlanet(id) {
        this.planetsService.getPlanet(id).subscribe(
            (data: Planets) => {
                this.planet = data;
                // console.log(data);
            }
        );
    }

    public editPlanet() {
        this.onHold = true;
        var body =
            'nome=' + this.planetsForm.value.nome +
            '&clima=' + this.planetsForm.value.clima +
            '&terreno=' + this.planetsForm.value.terreno;

        this.planetsService.editPlanet(this.id, body).subscribe(
            (data) => {
                this.planetsForm.reset();
                this.planet = data;
                this.getPlanet(this.id);

                this.updateOnHold();
            }
        );
    }


    ngOnInit() {
        this.route.params.subscribe(params => {
            console.log(params['id']) //log the value of id
            this.id = params['id'];
            this.getPlanet(this.id);
        });
    }

    public updateOnHold() {
        this.onHold = !this.onHold;
    }

}