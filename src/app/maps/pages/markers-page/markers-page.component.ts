import { AfterViewInit, Component, ElementRef, ViewChild, signal } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

import { MarkerAndColor, PlainMarker } from '../../models';

@Component({
  templateUrl: './markers-page.component.html',
  styles: [`
    #map {
      width: 100vw;
      height: 100vh;
      background-color: red;
    }

    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      cursor: pointer;
    }

    button {
      position: fixed;
      bottom: 30px;
      right: 20px;
    }
  `]
})
export class MarkersPageComponent implements AfterViewInit {

  @ViewChild('map')
  public divMap?: ElementRef;

  public markers = signal<MarkerAndColor[]>([]);

  public zoom = signal(13);
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

    this.readFromLocalStorage();
  }

  createMarker(): void {
    if (!this.map()) return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const lngLat = this.map()!.getCenter();

    this.addMarker(lngLat, color);
  }

  addMarker(lngLat: LngLat, color: string): void {
    if( !this.map()) return;

    const marker = signal<Marker>(new Marker({
      color,
      draggable: true
    })
      .setLngLat(lngLat)
      .addTo( this.map()! ));

    this.markers().push({
      color,
      marker: marker()
    });

    this.saveToLocalStorage();

    marker().on('dragend', () => this.saveToLocalStorage());
  }

  deleteMarker(index: number): void {
    this.markers.update((marker) => {
      marker[index].marker.remove();
      marker.splice(index, 1);
      this.saveToLocalStorage();
      return marker;
    })
  }

  flyTo(marker: Marker) {
    this.map()?.flyTo({
      zoom: 14,
      center: marker.getLngLat()
    })
  }

  saveToLocalStorage() {
    const plainMarkers = signal<PlainMarker[]>(this.markers().map(({color, marker}) => {
      return {
        color,
        lngLat: marker.getLngLat().toArray()
      }
    }));

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers()));
  }

  readFromLocalStorage() {
    const plainMarkersString = signal<string>(localStorage.getItem('plainMarkers') ?? '[]');

    const plainMarkers = signal<PlainMarker[]>(JSON.parse(plainMarkersString()));

    plainMarkers().forEach(({color, lngLat})=> {
      const [lng, lat] = lngLat;
      const coords = signal(new LngLat(lng, lat));

      this.addMarker(coords(), color);
    });
  }

}
