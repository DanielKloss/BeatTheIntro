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

        this.question.artistAnswers = this.shuffleList(this.question.artistAnswers);
        this.question.trackAnswers = this.shuffleList(this.question.trackAnswers);

        return this.question;
    }

    generateArtistAnswers() {
        let artistAnswers = [];

        let currentArtist = this.artists.splice(this.artists.findIndex(a => a.id == this.tracks[this.currentTrackNumber].artist.id), 1)[0];
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
        let trackAnswers = [];
        let currentTrack;
        let currentArtist = this.artists.find(a => a.id == this.tracks[this.currentTrackNumber].artist.id);

        let trackindex = currentArtist.tracks.findIndex(t => t.uri == this.tracks[this.currentTrackNumber].uri);

        if (trackindex == -1) {
            currentTrack = this.tracks[this.currentTrackNumber]
        } else {
            currentTrack = currentArtist.tracks.splice(trackindex, 1)[0];
        }

        this.question.trackAnswers.push(new Answer({ answer: currentTrack.name, correct: true }));
        trackAnswers.push(currentTrack);

        for (let i = 0; i < 3; i++) {
            currentTrack = currentArtist.tracks.splice(Math.floor(Math.random() * currentArtist.tracks.length), 1)[0];
            this.question.trackAnswers.push(new Answer({ answer: currentTrack.name, correct: false }));
            trackAnswers.push(currentTrack);
        }

        currentArtist.tracks = currentArtist.tracks.concat(trackAnswers);
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
}