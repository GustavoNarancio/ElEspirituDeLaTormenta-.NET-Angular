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
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component'; 

const routes: Routes = [
  { path: '', component: JuegoComponent, canActivate: [AuthGuard] },      // Si la URL está vacía, muestra la Intro
  { path: 'juego', component: JuegoComponent, canActivate: [AuthGuard] },
  { path: 'intro', component: IntroComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent},
  { path: 'lavadero', component: LavaderoComponent, canActivate: [AuthGuard] }, 
  { path: 'cocina', component: CocinaComponent, canActivate: [AuthGuard] },
  { path: 'living', component: LivingComponent, canActivate: [AuthGuard] },
  { path: 'garaje', component: GarajeComponent, canActivate: [AuthGuard] },
  { path: 'dormitorio', component: DormitorioComponent, canActivate: [AuthGuard] },
  { path: 'mapa', component: MapaComponent, canActivate: [AuthGuard] },
  { path: 'puerta-garaje', component: PuertaGarajeComponent, canActivate: [AuthGuard] },
  { path: 'sotano', component: SotanoComponent, canActivate: [AuthGuard] },
  { path: 'puerta-sotano', component: PuertaSotanoComponent, canActivate: [AuthGuard] },
  { path: 'escapeFinal', component: EscapeFinalComponent, canActivate: [AuthGuard] },
  { path: 'agradecimiento', component: AgradecimientoComponent, canActivate: [AuthGuard] },
  { path: 'el-espiritu-de-la-tormenta', component: ElEspirituDeLaTormentaComponent, canActivate: [AuthGuard] },
  { path: 'catacumbas', component: CatacumbasComponent, canActivate: [AuthGuard] },
  { path: 'final-salida-por-la-puerta', component: FinalSalidaPorLaPuertaComponent, canActivate: [AuthGuard] },
  { path: 'cartel-evento', component: CartelEventoComponent, canActivate: [AuthGuard] },
  { path: 'finalPorMovimientos', component: FinalPorMovimientosComponent, canActivate: [AuthGuard] }, 
  { path: '**', redirectTo: '/juego' } // Por si escriben cualquier cosa
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
