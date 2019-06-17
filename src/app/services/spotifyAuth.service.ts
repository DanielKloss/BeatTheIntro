import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SpotifyAuthService {

    private token: string;

    private baseUrl: string = 'https://accounts.spotify.com/authorize';
    private redirectUrl: string = 'http://localhost:8100/spotify';
    private clientId: string;
    private scopes: string[] = ["streaming", "user-read-birthdate", "user-read-email", "user-read-private", "playlist-read-private", "playlist-read-collaborative"];

    constructor(private http: HttpClient) { }

    getTokenFromUrl(): string {
        // Get the hash of the url
        const hash = window.location.hash
            .substring(1)
            .split('&')
            .reduce(function (initial, item) {
                if (item) {
                    var parts = item.split('=');
                    initial[parts[0]] = decodeURIComponent(parts[1]);
                }
                return initial;
            }, {});
        window.location.hash = '';

        // Set token
        this.token = hash.access_token;
        return this.token;
    }

    async generateToken() {
        this.clientId = await this.http.get("../assets/config.json").pipe(map(res => res["clientId"])).toPromise();
        window.location.href = this.baseUrl + '?client_id=' + this.clientId + '&redirect_uri=' + this.redirectUrl + '&scope=' + encodeURIComponent(this.scopes.join(' ')) + '&response_type=token';
    }

    getToken() {
        return this.token;
    }
}