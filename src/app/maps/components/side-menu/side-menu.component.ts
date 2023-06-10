import { Component, signal } from '@angular/core';

interface MenuItem {
  name: string;
  route: string;
}

@Component({
  selector: 'maps-side-menu',
  templateUrl: './side-menu.component.html',
  styles: [`
    li {
      cursor: pointer;
      transition: 0.2s all;
    }
  `]
})
export class SideMenuComponent {

  public menuItems = signal<MenuItem[]>([
    { route: '/maps/fullscreen', name: 'FullScreen' },
    { route: '/maps/zoom-range', name: 'Zoom Range' },
    { route: '/maps/markers', name: 'Markers' },
    { route: '/maps/properties', name: 'Houses' },
  ])

}
