import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { JuegoComponent } from './juego/juego.component';
import { LavaderoComponent } from './lavadero/lavadero.component';
import { CocinaComponent } from './cocina/cocina.component';
import { LivingComponent } from './living/living.component';
import { GarajeComponent } from './garaje/garaje.component';
import { DormitorioComponent } from './dormitorio/dormitorio.component';
import { MapaComponent } from './mapa/mapa.component';
import { PuertaGarajeComponent } from './puerta-garaje/puerta-garaje.component';
import { SotanoComponent } from './sotano/sotano.component';
import { PuertaSotanoComponent } from './puerta-sotano/puerta-sotano.component';
import { EscapeFinalComponent } from './escape-final/escape-final.component';
import { AgradecimientoComponent } from './agradecimiento/agradecimiento.component';
import { ElEspirituDeLaTormentaComponent } from './el-espiritu-de-la-tormenta/el-espiritu-de-la-tormenta.component';
import { CatacumbasComponent } from './catacumbas/catacumbas.component'; 
import { FinalSalidaPorLaPuertaComponent } from './final-salida-por-la-puerta/final-salida-por-la-puerta.component'; 
import { CartelEventoComponent } from './cartel-evento/cartel-evento.component'; 
import { FinalPorMovimientosComponent } from './final-por-movimientos/final-por-movimientos.component';

const routes: Routes = [
  { path: '', component: IntroComponent },      // Si la URL está vacía, muestra la Intro
  { path: 'juego', component: JuegoComponent }, // Si la URL es /juego, muestra el Pasillo
  { path: 'lavadero', component: LavaderoComponent }, // este lo hice yo a mano
  { path: 'cocina', component: CocinaComponent },
  { path: 'living', component: LivingComponent },
  { path: 'garaje', component: GarajeComponent },
  { path: 'dormitorio', component: DormitorioComponent },
  { path: 'mapa', component: MapaComponent },
  { path: 'puerta-garaje', component: PuertaGarajeComponent },
  { path: 'sotano', component: SotanoComponent },
  { path: 'puerta-sotano', component: PuertaSotanoComponent },
  { path: 'escapeFinal', component: EscapeFinalComponent },
  { path: 'agradecimiento', component: AgradecimientoComponent },
  { path: 'el-espiritu-de-la-tormenta', component: ElEspirituDeLaTormentaComponent },
  { path: 'catacumbas', component: CatacumbasComponent },
  { path: 'final-salida-por-la-puerta', component: FinalSalidaPorLaPuertaComponent },
  { path: 'cartel-evento', component: CartelEventoComponent },
  { path: 'finalPorMovimientos', component: FinalPorMovimientosComponent }, 
  { path: '**', redirectTo: '/juego' } // Por si escriben cualquier cosa
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
