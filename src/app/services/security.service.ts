import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor() {
  }

  hash(str) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  }

  hex(buff) {
    return [].map.call(new Uint8Array(buff), b => ('00' + b.toString(16)).slice(-2)).join('');
  }

// Base64 encode
  encode64(buff) {
    return btoa(new Uint8Array(buff).reduce((s, b) => s + String.fromCharCode(b), ''));
  }
}
