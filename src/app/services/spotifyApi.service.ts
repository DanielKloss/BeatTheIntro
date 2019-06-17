import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SpotifyApiService {

    constructor(private http: HttpClient) { }

    getPlaylists() {
        return this.http.get('https://api.spotify.com/v1/me/playlists');
    }

    getTracksFromPlaylist(playlistHref) {
        return this.http.get(playlistHref);
    }

    getTracks() {
        return this.http.get('https://api.spotify.com/v1/tracks/');
    }
}