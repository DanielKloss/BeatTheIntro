import { SpotifyArtist } from "./spotifyArtist";
import { SpotifyTrack } from "./spotifyTrack";

export class Question {
    constructor() {
        this.artistAnswers = [];
        this.trackAnswers = [];
    }

    track: SpotifyTrack;
    artistAnswers: [SpotifyArtist, boolean][];
    trackAnswers: [SpotifyTrack, boolean][];
}