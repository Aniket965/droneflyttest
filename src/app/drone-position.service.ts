import { Injectable } from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DronePositionService {
  private locationSocket:WebSocketSubject<String> = webSocket('ws://localhost:4000/GlobalPosition');
  
  getLocationUpdates():Observable<any> {
    return this.locationSocket.asObservable();
  }
  sendStartMessage(): void {
    this.locationSocket.next('start');
  }
}
