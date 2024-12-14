import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { TripDataService } from '../services/trip-data.service';
import { AuthResponse } from '../models/auth-response';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) { }

  public getToken(): string {
    //console.log('AuthenticationService::getToken');
    return this.storage.getItem('travlr-token') || '';
  }

  public saveToken(token: string): void {
    console.log('AuthenticationService::saveToken');
    this.storage.setItem('travlr-token', token);
  }

  public login(user: User): Promise<any> {
    return this.tripDataService
      .login(user)
      .then((authResp: AuthResponse) => {
        console.log('Saving token:', authResp.token);
        this.saveToken(authResp.token);  // This should save the token correctly
      });
  }

  public register(user: User): Promise<any> {
    return this
      .tripDataService
      .register(user)
      .then((authResp: AuthResponse) =>
        this.saveToken(authResp.token));
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      console.log('Token: ' + token);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > (Date.now() / 1000);
      } catch (error) {
        console.error('Error decoding token:', error);
        return false; // Invalid token format
      }
    }
    return false;
  }

  public getCurrentUser(): User | null {
    if (this.isLoggedIn()) {
      const token: string = this.getToken();
      const { email, name } = JSON.parse(atob(token.split('.')[1]));
      return { email, name } as User;
    }
    return null;
  }
}
