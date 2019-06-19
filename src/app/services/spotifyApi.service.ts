import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SpotifyPlaylist } from '../models/spotifyPlaylist';
import { SpotifyTrack } from '../models/spotifyTrack';
import { SpotifyArtist } from '../models/spotifyArtist';

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
                        })
                    );
                })
            );
    }

    getArtists(): Observable<SpotifyArtist[]> {
        return this.http.get('https://api.spotify.com/v1/me/following?type=artist')
            .pipe(
                map(response => {
                    return response["artists"]["items"].map(artist =>
                        new SpotifyArtist({
                            href: artist["href"],
                            id: artist["id"],
                            name: artist["name"],
                            uri: artist["uri"]
                        })
                    );
                })
            )
    }

    getSongs(): Observable<SpotifyTrack[]> {
        return this.http.get('https://api.spotify.com/v1/me/tracks')
            .pipe(
                map(response => {
                    return response["items"].map(track =>
                        new SpotifyTrack({
                            album: track["track"]["album"]["name"],
                            artist: new SpotifyArtist({
                                name: track["track"]["artists"][0]["name"],
                                href: track["track"]["artists"][0]["href"],
                                id: track["track"]["artists"][0]["id"],
                                uri: track["track"]["artists"][0]["uri"]
                            }),
                            name: track["track"]["name"],
                            uri: track["track"]["uri"]
                        })
                    );
                })
            )
    }

    getListOfTracksFromPlaylist(baseHref): Observable<SpotifyTrack[]> {
        return this.http.get(baseHref + '/tracks')
            .pipe(
                map(response => {
                    return response["items"].map(track =>
                        new SpotifyTrack({
                            album: track["track"]["album"]["name"],
                            artist: new SpotifyArtist({
                                name: track["track"]["artists"][0]["name"],
                                href: track["track"]["artists"][0]["href"],
                                id: track["track"]["artists"][0]["id"],
                                uri: track["track"]["artists"][0]["uri"]
                            }),
                            name: track["track"]["name"],
                            uri: track["track"]["uri"]
                        })
                    );
                })
            );
    }

    getListOfArtistsTopTracks(baseHref): Observable<SpotifyTrack[]> {
        return this.http.get(baseHref + '/top-tracks?country=from_token')
            .pipe(
                map(response => {
                    return response["tracks"].map(track =>
                        new SpotifyTrack({
                            album: track["album"]["name"],
                            artist: new SpotifyArtist({
                                name: track["artists"][0]["name"],
                                href: track["artists"][0]["href"],
                                id: track["artists"][0]["id"],
                                uri: track["artists"][0]["uri"]
                            }),
                            name: track["name"],
                            uri: track["uri"]
                        })
                    );
                })
            )
    }
}