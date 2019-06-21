import { SpotifyTrack } from "./spotifyTrack";

export class Question {
    constructor() {
        this.artistAnswers = [];
        this.trackAnswers = [];
    }

    track: SpotifyTrack;
    artistAnswers: Answer[];
    trackAnswers: Answer[];
}

export class Answer {
    public constructor(init?: Partial<Answer>) {
        Object.assign(this, init);
    }

    answer: string;
    correct: boolean;
}