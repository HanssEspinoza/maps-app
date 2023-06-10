import { Component } from '@angular/core';

@Component({
  templateUrl: './maps-layout.component.html',
  styles: [
    `
      maps-side-menu {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 999;
      }
    `
  ]
})
export class MapsLayoutComponent {

}
