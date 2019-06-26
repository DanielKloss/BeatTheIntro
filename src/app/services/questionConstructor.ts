import { Question, Answer } from "../models/question";
import { SpotifyTrack } from "../models/spotifyTrack";
import { SpotifyArtist } from "../models/spotifyArtist";

export class QuestionConstructor {

    question: Question;

    tracks: SpotifyTrack[];
    artists: SpotifyArtist[];
    currentTrackNumber: number;

    constructor(tracks: SpotifyTrack[], artists: SpotifyArtist[]) {
        this.tracks = tracks;
        this.artists = artists;
    }

    constructQuestion(currentTrackNumber: number): Question {
        this.currentTrackNumber = currentTrackNumber;
        this.question = new Question();
        this.question.track = this.tracks[this.currentTrackNumber];

        this.generateArtistAnswers();
        this.generateTrackAnswers();

        return this.question;
    }

    generateArtistAnswers() {
        let artistAnswers = [];

        let currentArtist;

        currentArtist = this.artists.splice(this.artists.indexOf(this.tracks[this.currentTrackNumber].artist), 1)[0];
        this.question.artistAnswers.push(new Answer({ answer: currentArtist.name, correct: true }));
        artistAnswers.push(currentArtist);

        for (let i = 0; i < 3; i++) {
            currentArtist = this.artists.splice(Math.floor(Math.random() * this.artists.length), 1)[0];
            artistAnswers.push(currentArtist);
            this.question.artistAnswers.push(new Answer({ answer: currentArtist.name, correct: false }));
        }

        this.artists = this.artists.concat(artistAnswers);
    }

    generateTrackAnswers() {
        let currentArtist = this.artists.find(a => a.id == this.tracks[this.currentTrackNumber].artist.id);

        let trackAnswers = [];
        let currentTrack;

        currentTrack = currentArtist.tracks.splice(currentArtist.tracks.indexOf(this.tracks[this.currentTrackNumber], 1))[0];
        this.question.trackAnswers.push(new Answer({ answer: currentTrack.name, correct: true }));
        trackAnswers.push(currentTrack);

        for (let i = 0; i < 3; i++) {
            currentTrack = currentArtist.tracks.splice(Math.floor(Math.random() * currentArtist.tracks.length), 1)[0];
            this.question.trackAnswers.push(new Answer({ answer: currentTrack.name, correct: false }));
            trackAnswers.push(currentTrack);
        }

        currentArtist.tracks = currentArtist.tracks.concat(trackAnswers);
    }
}