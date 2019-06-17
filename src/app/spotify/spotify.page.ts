import { Component, OnInit } from '@angular/core';

import { SpotifyAuthService } from '../services/spotifyAuth.service';
import { SpotifyApiService } from '../services/spotifyApi.service';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.page.html',
  styleUrls: ['./spotify.page.scss'],
})
export class SpotifyPage implements OnInit {

  private token;

  private tracks: string[];

  constructor(private spotifyAuthService: SpotifyAuthService, private spotifyApiService: SpotifyApiService) { }

  ngOnInit() {
    this.token = this.spotifyAuthService.getTokenFromUrl();

    if (!this.token) {
      this.spotifyAuthService.generateToken();
    }

    this.spotifyApiService.getPlaylists().subscribe(p => this.getIdsOfTracksInPlaylists(p)), error => console.log(error);
  }

  getIdsOfTracksInPlaylists(playlists) {
    let tracks = []
    playlists['items'].forEach(playlist => {
      this.spotifyApiService.getTracksFromPlaylist(playlist['tracks']['href']).subscribe(t => tracks.push(t['items']), error => console.log(error));
    });
    console.log(tracks);
  }
} 
