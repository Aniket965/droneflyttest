import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DronePositionService {
  public lat:BehaviorSubject<any> = new BehaviorSubject<any>(0);
  public long:BehaviorSubject<any> = new BehaviorSubject<any>(0);
}
