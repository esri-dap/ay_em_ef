import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { HomePage } from "./home.page";
import { InputWithIconInsideComponent } from "../input-with-icon-inside/input-with-icon-inside.component";
import { ListAddressComponent } from "../list-address/list-address.component";
import { ListRouteComponent } from "../list-route/list-route.component";
import { DestinationInputWithIconInsideComponent } from "../destination-input-with-icon-inside/destination-input-with-icon-inside.component";
import { LottieAnimationViewModule } from "ng-lottie";
import { AnimWeatherComponent } from "../anim-weather/anim-weather.component";
import { TitleControllerComponent } from "../title-controller/title-controller.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LottieAnimationViewModule.forRoot(),
    RouterModule.forChild([
      {
        path: "",
        component: HomePage
      }
    ])
  ],
  declarations: [
    HomePage,
    InputWithIconInsideComponent,
    DestinationInputWithIconInsideComponent,
    ListAddressComponent,
    ListRouteComponent,
    AnimWeatherComponent,
    TitleControllerComponent
  ]
})
export class HomePageModule {}
