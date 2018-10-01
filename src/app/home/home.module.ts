import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { InputWithIconInsideComponent } from '../input-with-icon-inside/input-with-icon-inside.component';
import { ListAddressComponent } from '../list-address/list-address.component';
import { ListRouteComponent } from '../list-route/list-route.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, InputWithIconInsideComponent, ListAddressComponent, ListRouteComponent]
})
export class HomePageModule {}
