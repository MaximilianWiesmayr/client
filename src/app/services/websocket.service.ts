import {EventEmitter, Injectable} from '@angular/core';
import {GradingSetting} from '../entities/grading-setting';
import {Image} from '../entities/Image';
import {DataService} from './data.service';
import {GradingComponent} from '../components/client-area/grading/grading.component';
import {environment} from '../../environments/environment';
import {HttpService} from './http.service';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  ws: WebSocket;

  // Event Emitter for sending Responses
  connectionEmitter: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  gradingEmitter: EventEmitter<GradingSetting> = new EventEmitter<GradingSetting>(true);
  errorEmitter: EventEmitter<string> = new EventEmitter(false);
  image: Image;
  private download;

  constructor(public dataservice: DataService) {
    this.gradingEmitter.subscribe(
      (setting: GradingSetting) => this.ws.send(JSON.stringify(setting)));
  }

  connect(url: string, token?: string) {
    this.ws = new WebSocket(url);
    this.ws.onerror = (evt: Event) => this.errorEmitter.emit(evt.type);
    this.ws.onopen = (evt: Event) => {
      if (token) {
        this.setToken(token);
      }
      this.connectionEmitter.emit(true);
    };
    this.ws.onclose = (evt: Event) => {
      console.log("hi lol");
      this.connectionEmitter.emit(false);
    };
    this.ws.onmessage = (evt: MessageEvent) => this.onMessage(evt);
  }

  onMessage(event: MessageEvent) {
    if (event.data === 'settings') {
      this.dataservice.thumbnailEmitter.emit('hi');
    }
  }

  // Sends the toke to the server
  setToken(token: string) {
    const obj: object = {
      type: 'init',
      token
    };
    this.ws.send(JSON.stringify(obj));
  }

  importImage(image: Image) {
    if (image) {
      console.log(image.filepath);
      const obj: object = {
        type: 'import',
        path: image.filepath
      };
      this.ws.send(JSON.stringify(obj));
    }
  }
  exportImage(image: Image) {
    if (image) {
      console.log(image.filepath);
      this.download = image.filepath.split('/');
      const obj: object = {
        type: 'export',
        path: image.filepath
      };
      this.ws.send(JSON.stringify(obj));
    }
  }
}
