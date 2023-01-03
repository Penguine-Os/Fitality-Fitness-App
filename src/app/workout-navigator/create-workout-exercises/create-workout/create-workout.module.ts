import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateWorkoutPageRoutingModule } from './create-workout-routing.module';

import { CreateWorkoutPage } from './create-workout.page';
import {SharedModule} from '../../../shared/shared.module';
import {MatSliderModule} from '@angular/material/slider';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CreateWorkoutPageRoutingModule,
        SharedModule,
        MatSliderModule
    ],
  declarations: [CreateWorkoutPage]
})
export class CreateWorkoutPageModule {}
