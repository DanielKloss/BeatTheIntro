import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { SpotifyConfig } from '../models/spotifyConfig';

@Injectable({ providedIn: 'root' })
export class SpotifyAuthService {

    private token: string;
    private spotifyConfig: SpotifyConfig;

    private scopes: string[] = [
        "streaming",
        "app-remote-control",
        "user-read-birthdate",
        "user-read-email",
        "user-read-private",
        "playlist-read-private",
        "playlist-read-collaborative",
        "user-library-read",
        "user-follow-read"
    ];

    constructor(private http: HttpClient) {
        this.spotifyConfig = new SpotifyConfig();
    }

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

        //@ts-ignore
        this.token = hash.access_token;
        return this.token;
    }

    async generateToken() {
        await this.http.get("../assets/config.json").pipe(map<SpotifyConfig, SpotifyConfig>(res => this.spotifyConfig = res)).toPromise();
        window.location.href = this.spotifyConfig.spotifyApiUrl + '?client_id=' + this.spotifyConfig.clientId + '&redirect_uri=' + this.spotifyConfig.redirectUrl + '&scope=' + encodeURIComponent(this.scopes.join(' ')) + '&response_type=token';
    }

    getToken() {
        return this.token;
    }
}