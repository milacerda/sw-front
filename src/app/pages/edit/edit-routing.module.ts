import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditComponent } from './edit.component';

const routes: Routes = [{
    path: '',
    component: EditComponent,
    // children: [{
    //     path: 'grid',
    //     component: GridComponent,
    // }, {
    //     path: 'icons',
    //     component: IconsComponent,
    // }, {
    //     path: 'typography',
    //     component: TypographyComponent,
    // }, {
    //     path: 'search-fields',
    //     component: SearchComponent,
    // }],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EditRoutingModule { }
