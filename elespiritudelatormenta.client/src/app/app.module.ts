import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IntroComponent } from './intro/intro.component';
import { JuegoComponent } from './juego/juego.component';
import { LavaderoComponent } from './lavadero/lavadero.component';
import { MochilaComponent } from './mochila/mochila.component';

@NgModule({
  declarations: [
    AppComponent,
    IntroComponent,
    JuegoComponent,
    LavaderoComponent,
    MochilaComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
