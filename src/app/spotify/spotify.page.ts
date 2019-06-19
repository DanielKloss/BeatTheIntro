import { Component, OnInit } from '@angular/core';

import { SpotifyAuthService } from '../services/spotifyAuth.service';
import { SpotifyApiService } from '../services/spotifyApi.service';
import { SpotifyPlaylist } from '../models/spotifyPlaylist';
import { SpotifyTrack } from '../models/spotifyTrack';
import { SpotifyArtist } from '../models/spotifyArtist';
import { SpotifyAlbum } from '../models/spotifyAlbum';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.page.html',
  styleUrls: ['./spotify.page.scss'],
})
export class SpotifyPage implements OnInit {

  private token;
  private player;

  private tracks: SpotifyTrack[] = [];
  private artists: SpotifyArtist[] = [];
  private trackNumber: number = 0;

  constructor(private spotifyAuthService: SpotifyAuthService, private spotifyApiService: SpotifyApiService) { }

  async ngOnInit() {
    this.token = this.spotifyAuthService.getTokenFromUrl();

    if (!this.token) {
      this.spotifyAuthService.generateToken();
    }

    //@ts-ignore
    window.onSpotifyPlayerAPIReady = () => {
      //@ts-ignore
      this.player = new Spotify.Player({
        name: 'Beat The Intro',
        getOAuthToken: cb => { cb(this.token); }
      });

      this.player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        console.log("play " + this.tracks[this.trackNumber].name);
        //this.playSong(this.tracks[this.trackNumber].uri);
      });

      this.player.addListener('player_state_changed', state => {
        if (state.paused == true) {
          this.trackNumber++;
          //this.playSong(this.tracks[this.trackNumber].uri);
          console.log("play " + this.tracks[this.trackNumber].name);
        }
      });

      this.player.connect();
    }

    await this.getSongsFromPlaylist();
    await this.getSongsFromArtist();
    await this.getSongsFromLibrary();
  }

  async getSongsFromPlaylist() {
    let playlists: SpotifyPlaylist[] = await this.spotifyApiService.getPlaylists().toPromise();

    for (let i = 0; i < playlists.length; i++) {
      this.addTracksToQueue(await this.spotifyApiService.getListOfTracksFromPlaylist(playlists[i].href).toPromise());
    }
  }

  async getSongsFromArtist() {
    let artists: SpotifyArtist[] = await this.spotifyApiService.getArtists().toPromise();

    for (let i = 0; i < artists.length; i++) {
      this.addTracksToQueue(await this.spotifyApiService.getListOfArtistsTopTracks(artists[i].href).toPromise());
    }
  }

  async getSongsFromLibrary() {
    this.addTracksToQueue(await this.spotifyApiService.getSongs().toPromise());
  }

  addTracksToQueue(tracks: SpotifyTrack[]) {
    for (let i = 0; i < tracks.length; i++) {
      if (this.tracks.find(t => t.uri == tracks[i].uri) == null) {
        this.tracks.push(tracks[i]);
      }
      if (this.artists.find(t => t.id == tracks[i].artist.id) == null){
        this.artists.push(tracks[i].artist);
      }
    }
  }

  playSong(songUri) {
    const play = ({
      spotify_uri,
      playerInstance: {
        _options: {
          getOAuthToken,
          id
        }
      }
    }) => {
      getOAuthToken(access_token => {
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [spotify_uri] }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
          },
        });
      });
    };

    play({
      playerInstance: this.player,
      spotify_uri: songUri,
    });
  }
}
