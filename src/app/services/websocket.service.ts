import {EventEmitter, Injectable} from '@angular/core';
import {GradingSetting} from '../entities/grading-setting';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  ws: WebSocket;

  // Event Emitter for sending Responses
  connectionEmitter: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  gradingEmitter: EventEmitter<GradingSetting> = new EventEmitter<GradingSetting>(true);
  errorEmitter: EventEmitter<string> = new EventEmitter(false);

  constructor() {
    this.gradingEmitter.subscribe(
      (setting: GradingSetting) => this.ws.send(JSON.stringify(setting)));
  }

  connect(url: string) {
    this.ws = new WebSocket(url);
    this.ws.onerror = (evt: Event) => this.errorEmitter.emit(evt.type);
    this.ws.onopen = (evt: Event) => this.connectionEmitter.emit(true);
    this.ws.onclose = (evt: Event) => this.connectionEmitter.emit(false);
    this.ws.onmessage = (evt: MessageEvent) => this.onMessage(evt);
  }

  onMessage(event: MessageEvent) {
    // const request: GradingSetting = JSON.parse(event.data);

  }
}
