import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { SpotifyPlaylist } from '../models/spotifyPlaylist';
import { SpotifyTrack } from '../models/spotifyTrack';

@Injectable({ providedIn: 'root' })
export class SpotifyApiService {

    constructor(private http: HttpClient) { }

    getPlaylists(): Observable<SpotifyPlaylist[]> {
        return this.http.get('https://api.spotify.com/v1/me/playlists')
            .pipe(
                map(response => {
                    return response["items"].map(playlist =>
                        new SpotifyPlaylist({
                            href: playlist["href"],
                            id: playlist["id"],
                            name: playlist["name"],
                            tracks: playlist["tracks"]["href"],
                            numberOfTracks: playlist["tracks"]["total"],
                            uri: playlist["uri"]
                        }))
                }
                ));
    }

    getListOfTracksFromPlaylist(playlistHref) {
        return this.http.get(playlistHref + '/tracks')
            .pipe(
                map(response => {
                    return response["items"].map(track =>
                        // console.log(track["track"]["uri"])
                        new SpotifyTrack({
                            album: track["track"]["album"]["name"],
                            artist: track["track"]["artists"][0]["name"],
                            name: track["track"]["name"],
                            uri: track["track"]["uri"]
                        })
                    );
                }
                )
            );
    }
}