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
        console.log(this.artists);
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
        this.question.artistAnswers.push(new Answer({ answer: this.artists.splice(this.artists.indexOf(this.tracks[this.currentTrackNumber].artist), 1)[0].name, correct: true }));
        for (let i = 0; i < 3; i++) {
            this.question.artistAnswers.push(new Answer({ answer: this.artists.splice(Math.floor(Math.random() * this.artists.length), 1)[0].name, correct: false }));
        }
        for (let i = 0; i < this.question.artistAnswers.length; i++) {
            this.artists.push(this.question.artistAnswers[i][0]);
        }
    }

    generateTrackAnswers() {
        let currentArtist = this.artists.find(a => a.id == this.tracks[this.currentTrackNumber].artist.id);

        this.question.trackAnswers.push(new Answer({ answer: currentArtist.tracks.find(t => t.name == this.tracks[this.currentTrackNumber].name).name, correct: true }));

        for (let i = 0; i < currentArtist.tracks.length; i++) {
            if (currentArtist.tracks[i].name == this.tracks[this.currentTrackNumber].name) {
                currentArtist.tracks.splice(i, 1);
            }
        }

        for (let i = 0; i < 3; i++) {
            this.question.trackAnswers.push(new Answer({ answer: currentArtist.tracks.splice(Math.floor(Math.random() * currentArtist.tracks.length), 1)[0].name, correct: false }));
        }

        for (let i = 0; i < this.question.trackAnswers.length; i++) {
            currentArtist.tracks.push(this.question.trackAnswers[i][0]);
        }
    }
}