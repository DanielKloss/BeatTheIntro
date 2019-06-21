import { Component, OnInit } from '@angular/core';

import { SpotifyAuthService } from '../services/spotifyAuth.service';
import { SpotifyApiService } from '../services/spotifyApi.service';
import { SpotifyPlaylist } from '../models/spotifyPlaylist';
import { SpotifyTrack } from '../models/spotifyTrack';
import { SpotifyArtist } from '../models/spotifyArtist';
import { Question } from '../models/question';
import { QuestionConstructor } from '../services/questionConstructor';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.page.html',
  styleUrls: ['./spotify.page.scss'],
})
export class SpotifyPage implements OnInit {

  questionConstructor: QuestionConstructor;

  private token;
  private player;

  private playerReady: boolean = false;
  private questionsReady: boolean = false;
  private score: number = 0;

  private tracks: SpotifyTrack[] = [];
  private artists: SpotifyArtist[] = [];
  private trackNumber: number = 0;
  private question: Question;

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
        this.playerReady = true;
      });

      this.player.connect();
    }

    //await this.getSongsFromPlaylist();
    this.questionsReady = await this.getSongsFromArtist();
    //await this.getSongsFromLibrary();

    this.questionsReady = await this.getAllTracksForArtists();

    this.questionsReady = true;
  }

  start() {
    if (this.playerReady) {
      console.log(this.artists);

      this.questionConstructor = new QuestionConstructor(this.tracks, this.artists);
      this.question = this.questionConstructor.constructQuestion(this.trackNumber);

      console.log("play " + this.question.track.name);
      this.playSong(this.question.track.uri);
    } else {
      console.log("player not ready");
    }
  }

  submitAnswer(answer) {
    if (answer == this.question.artistAnswers.find(a => a.correct == true).answer) {
      console.log("correct");
      this.score++;
    }

    this.trackNumber++;
    this.question = this.questionConstructor.constructQuestion(this.trackNumber);

    console.log(this.score);

    console.log("play " + this.question.track.name);
    this.playSong(this.question.track.uri);
  }

  async getSongsFromPlaylist() {
    let playlists: SpotifyPlaylist[] = await this.spotifyApiService.getPlaylists().toPromise();

    for (let i = 0; i < playlists.length; i++) {
      this.addTracksToQueue(await this.spotifyApiService.getListOfTracksFromPlaylist(playlists[i].href).toPromise());
    }
  }

  async getSongsFromArtist(): Promise<boolean> {
    let artists: SpotifyArtist[] = await this.spotifyApiService.getArtists().toPromise();

    for (let i = 0; i < artists.length; i++) {
      this.addTracksToQueue(await this.spotifyApiService.getListOfArtistsTopTracks(artists[i].href).toPromise());
    }

    return true;
  }

  async getSongsFromLibrary() {
    this.addTracksToQueue(await this.spotifyApiService.getSongs().toPromise());
  }

  addTracksToQueue(tracks: SpotifyTrack[]) {
    for (let i = 0; i < tracks.length; i++) {
      if (this.tracks.find(t => t.uri == tracks[i].uri) == null) {
        this.tracks.push(tracks[i]);
      }
      if (this.artists.find(t => t.id == tracks[i].artist.id) == null) {
        this.artists.push(tracks[i].artist);
      }
    }
  }

  async getAllTracksForArtists(): Promise<boolean> {
    for (let i = 0; i < this.artists.length; i++) {
      let albums = await this.spotifyApiService.getAlbumsForArtist(this.artists[i].href).toPromise();
      for (let j = 0; j < albums.length; j++) {
        this.artists[i].tracks = this.artists[i].tracks.concat(await this.spotifyApiService.getTracksForArtist(albums[j].href).toPromise());
      }
    }
    return true;
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
