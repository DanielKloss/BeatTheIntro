import { Component, OnInit } from '@angular/core';

import { SpotifyAuthService } from '../services/spotifyAuth.service';
import { SpotifyApiService } from '../services/spotifyApi.service';
import { SpotifyPlaylist } from '../models/spotifyPlaylist';
import { SpotifyTrack } from '../models/spotifyTrack';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.page.html',
  styleUrls: ['./spotify.page.scss'],
})
export class SpotifyPage implements OnInit {

  private token;

  private tracks: SpotifyTrack[];

  constructor(private spotifyAuthService: SpotifyAuthService, private spotifyApiService: SpotifyApiService) { }

  ngOnInit() {
    this.token = this.spotifyAuthService.getTokenFromUrl();

    if (!this.token) {
      this.spotifyAuthService.generateToken();
    }

    this.getSongs();
  }

  async getSongs() {
    let playlists: SpotifyPlaylist[] = await this.spotifyApiService.getPlaylists().toPromise();

    for (let i = 0; i < playlists.length; i++) {
      this.tracks = this.tracks.concat(await this.spotifyApiService.getListOfTracksFromPlaylist(playlists[i].href).toPromise());
    }
  }
} 
