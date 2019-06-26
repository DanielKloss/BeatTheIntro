import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

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
  private artistAnswers: boolean;
  private trackAnswers: boolean;

  private score: number = 0;

  private tracks: SpotifyTrack[] = [];
  private artists: SpotifyArtist[] = [];
  private trackNumber: number = 0;
  private question: Question;

  constructor(private spotifyAuthService: SpotifyAuthService, private spotifyApiService: SpotifyApiService, private cd: ChangeDetectorRef) { }

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
        this.playerReady = true;
      });

      this.player.addListener('player_state_changed', state => {
        if (state.paused == true && state.track_window.current_track.uri == this.question.track.uri) {
          this.trackNumber++;
          this.question = this.questionConstructor.constructQuestion(this.trackNumber);

          this.artistAnswers = true;
          this.trackAnswers = false;
          console.log("playing " + this.question.track.name);
          this.playSong(this.question.track.uri);
        }
      });

      this.player.connect();
    }

    await this.getSongsFromArtist();
    //await this.getSongsFromLibrary();
    //await this.getSongsFromPlaylist();
    await this.getAllTracksForArtists();

    this.tracks = this.shuffleList(this.tracks);
    this.artists = this.shuffleList(this.artists);

    this.questionsReady = true;
  }

  async start() {
    this.questionConstructor = new QuestionConstructor(this.tracks, this.artists);
    this.question = this.questionConstructor.constructQuestion(this.trackNumber);

    this.artistAnswers = true;
    this.trackAnswers = false;

    console.log("playing " + this.question.track.name);
    this.playSong(this.question.track.uri);
  }

  submitAnswer(answer, questionType) {
    if (questionType == "artist" && answer == this.question.artistAnswers.find(a => a.correct == true).answer) {
      this.score++;
      this.artistAnswers = false;
      this.trackAnswers = true;
    } else if (questionType == "track" && answer == this.question.trackAnswers.find(t => t.correct == true).answer) {
      this.score++;
      this.trackNumber++;
      this.question = this.questionConstructor.constructQuestion(this.trackNumber);

      this.artistAnswers = true;
      this.trackAnswers = false;
      console.log("playing " + this.question.track.name);
      this.playSong(this.question.track.uri);
    }
  }

  async getSongsFromPlaylist() {
    let playlists: SpotifyPlaylist[] = await this.spotifyApiService.getPlaylists();

    for (let i = 0; i < playlists.length; i++) {
      this.addTracksToQueue(await this.spotifyApiService.getListOfTracksFromPlaylist(playlists[i].href));
    }
  }

  async getSongsFromArtist() {
    let artists: SpotifyArtist[] = await this.spotifyApiService.getArtists();

    for (let i = 0; i < artists.length; i++) {
      this.addTracksToQueue(await this.spotifyApiService.getListOfArtistsTopTracks(artists[i].href));
    }
  }

  async getSongsFromLibrary() {
    this.addTracksToQueue(await this.spotifyApiService.getSongs());
  }

  addTracksToQueue(tracks: SpotifyTrack[]) {
    for (let i = 0; i < tracks.length; i++) {
      if (this.tracks.find(t => t.uri == tracks[i].uri) == null) {
        this.tracks.push(tracks[i]);
      }
      if (this.artists.find(t => t.id == tracks[i].artist.id) == null
        && (tracks[i].artist.href != null && tracks[i].artist.uri != null)) {
        this.artists.push(new SpotifyArtist({ name: tracks[i].artist.name, href: tracks[i].artist.href, id: tracks[i].artist.id, uri: tracks[i].artist.uri }));
      }
    }
  }

  async getAllTracksForArtists() {
    for (let i = 0; i < this.artists.length; i++) {
      let albums = await this.spotifyApiService.getAlbumsForArtist(this.artists[i].href);
      for (let j = 0; j < albums.length; j++) {
        this.artists[i].tracks = this.artists[i].tracks.concat(await this.spotifyApiService.getTracksForArtist(albums[j].href));
      }
    }
  }

  shuffleList(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
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
