import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-mapview',
  templateUrl: './mapview.component.html',
  styleUrls: ['./mapview.component.scss']
})
export class MapviewComponent implements AfterViewInit {
  title = 'app-mapview';
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;

  coordinates = new google.maps.LatLng(28.676300, 77.183659);

   mapOptions: google.maps.MapOptions = {
     center: this.coordinates,
     zoom: 16
    };

    marker = new google.maps.Marker({
      position: this.coordinates,
      map: this.map,
    });

    ngAfterViewInit() {
      this.mapInitializer();
    }


    mapInitializer() {
      this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
      this.marker.setMap(this.map);
    }

}
