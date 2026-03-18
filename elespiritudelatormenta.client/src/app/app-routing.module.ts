import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { JuegoComponent } from './juego/juego.component';
import { LavaderoComponent } from './lavadero/lavadero.component';

const routes: Routes = [
  { path: '', component: IntroComponent },      // Si la URL está vacía, muestra la Intro
  { path: 'juego', component: JuegoComponent }, // Si la URL es /juego, muestra el Pasillo
  { path: 'lavadero', component: LavaderoComponent } // este lo hice yo a mano
  // Aquí iremos agregando { path: 'cocina', component: CocinaComponent }, etc.
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
