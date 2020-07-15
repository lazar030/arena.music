import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { MenuComponent } from './menu/menu';
import { MusicComponent } from './music/music';
import { HeaderComponent } from './header/header';
import { UserComponent } from './user/user';
import { DebugComponent } from './debug/debug';

import { PanelService } from '../service/panels/panel';

import { NbTooltipModule, NbPopoverModule, NbTreeGridModule, NbCardModule, NbWindowModule, NbSelectModule, NbAccordionModule } from '@nebular/theme';
import { ClickOutsideModule } from 'ng-click-outside';
import { AngularDraggableModule } from 'angular2-draggable';

@NgModule({
    declarations: [ MenuComponent, MusicComponent, HeaderComponent, UserComponent, DebugComponent ],
    imports: [
        RouterModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        IonicModule,
        NbTooltipModule,
        NbPopoverModule,
        NbTreeGridModule,
        NbCardModule,
        NbSelectModule,
        NbAccordionModule,
        NbWindowModule.forRoot(),
        ClickOutsideModule,
        AngularDraggableModule,
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        PanelService
    ],
    exports: [ MenuComponent, MusicComponent, HeaderComponent, UserComponent, DebugComponent ]
})
export class PanelModule {}