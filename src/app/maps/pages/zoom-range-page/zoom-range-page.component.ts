import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styles: [`
    #map {
      width: 100vw;
      height: 100vh;
      background-color: red;
    }

    .floating-range {
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 999;
      width: 500px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0px 5px 10px rgba(0,0,0,0.1);
    }

    .floating-content {
      display: flex;
      align-items: center;
    }
  `]
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map')
  public divMap?: ElementRef;

  public zoom = signal(10);
  public map = signal<Map | null>(null);
  public currentLngLat = signal<LngLat>(new LngLat(-90.5132588267888, 14.615485437580773));

  ngAfterViewInit(): void {

    if( !this.divMap ) throw 'El elemento HTML no fue encontrado';

    this.map.set(new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat(), // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
    }));

    this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map()?.remove();
  }

  mapListeners(): void {
    this.map()?.on('zoom', () => {
      this.zoom.set(this.map()!.getZoom());
    });

    this.map()?.on('zoomend', () => {
      if ( this.map()!.getZoom() < 18) return;
      this.map()!.zoomTo(18);
    });

    this.map()?.on('move', () => {
      this.currentLngLat.set(this.map()!.getCenter());
    });
  }

  zoomIn(): void {
    this.map()?.zoomIn();
  }

  zoomOut(): void {
    this.map()?.zoomOut();
  }

  zoomChanged(value: string): void {
    this.zoom.set(Number(value));
    this.map()?.zoomTo(this.zoom());
  }

}
