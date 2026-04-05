import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IntroComponent } from './intro/intro.component';
import { JuegoComponent } from './juego/juego.component';
import { LavaderoComponent } from './lavadero/lavadero.component';
import { MochilaComponent } from './mochila/mochila.component';
import { PuzzleFusiblesComponent } from './puzzle-fusibles/puzzle-fusibles.component';
import { MapaComponent } from './mapa/mapa.component';
import { GarajeComponent } from './garaje/garaje.component';
import { CocinaComponent } from './cocina/cocina.component';
import { LivingComponent } from './living/living.component';
import { DormitorioComponent } from './dormitorio/dormitorio.component';
import { SotanoComponent } from './sotano/sotano.component';
import { PuertaGarajeComponent } from './puerta-garaje/puerta-garaje.component';
import { PuertaSotanoComponent } from './puerta-sotano/puerta-sotano.component';
import { PuzzleCajaComponent } from './puzzle-caja/puzzle-caja.component';
import { PuzzleCamionetaComponent } from './puzzle-camioneta/puzzle-camioneta.component';
import { EscapeFinalComponent } from './escape-final/escape-final.component';
import { AgradecimientoComponent } from './agradecimiento/agradecimiento.component';
import { PuzzleSotanoComponent } from './puzzle-sotano/puzzle-sotano.component';
import { ElEspirituDeLaTormentaComponent } from './el-espiritu-de-la-tormenta/el-espiritu-de-la-tormenta.component';
import { CatacumbasComponent } from './catacumbas/catacumbas.component';
import { FinalSalidaPorLaPuertaComponent } from './final-salida-por-la-puerta/final-salida-por-la-puerta.component';
import { CartelEventoComponent } from './cartel-evento/cartel-evento.component';
import { FinalPorMovimientosComponent } from './final-por-movimientos/final-por-movimientos.component';

@NgModule({
  declarations: [
    AppComponent,
    IntroComponent,
    JuegoComponent,
    LavaderoComponent,
    MochilaComponent,
    PuzzleFusiblesComponent,
    MapaComponent,
    GarajeComponent,
    CocinaComponent,
    LivingComponent,
    DormitorioComponent,
    SotanoComponent,
    PuertaGarajeComponent,
    PuertaSotanoComponent,
    PuzzleCajaComponent,
    PuzzleCamionetaComponent,
    EscapeFinalComponent,
    AgradecimientoComponent,
    PuzzleSotanoComponent,
    ElEspirituDeLaTormentaComponent,
    CatacumbasComponent,
    FinalSalidaPorLaPuertaComponent,
    CartelEventoComponent,
    FinalPorMovimientosComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
