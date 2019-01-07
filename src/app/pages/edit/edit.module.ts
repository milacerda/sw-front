import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { EditComponent } from '../edit/edit.component';
import { EditRoutingModule } from './edit-routing.module';

@NgModule({
    imports: [
        ThemeModule,
        EditRoutingModule
    ],
    declarations: [
        EditComponent,
    ],
})
export class EditModule { }
