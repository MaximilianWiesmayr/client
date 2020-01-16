import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../entities/User';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  // Sends a REST-Request to our Auth-Backend
  login(user: User) {
    return this.http.post(environment.apiUrl + 'auth/login', user);
  }

  // Sends a REST-Request to our Auth-Backend
  register(user: User) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json;charset=utf-8');
    return this.http.post(environment.apiUrl + 'auth/register', user, {headers});
  }

  // Sends the verificationcode from the email back to our Auth-Server
  verify(token: string) {
    return this.http.post(environment.apiUrl + 'auth/verify', token);
  }

  /*================================================
                  CLIENT AREA
  ================================================*/
  getOverview(username: string) {
    return this.http.get(environment.apiUrl + 'clientarea/overview/' + username);
  }

  uploadImage(formData: FormData) {
    return this.http.post(environment.apiUrl + 'image/upload', formData);
  }

  loadPhotos(username: string) {
    return this.http.get(environment.apiUrl + 'clientarea/photos/' + username);
  }

  deletePhoto(imageName: string, owner: string) {
    return this.http.post(environment.apiUrl + 'image/delete', {imageName, owner});
  }

  recoverPhoto(imageName: string, owner: string) {
    return this.http.post(environment.apiUrl + 'image/recover', {imageName, owner});
  }
}
