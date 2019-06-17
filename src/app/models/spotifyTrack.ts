export class SpotifyTrack {
    public constructor(init?: Partial<SpotifyTrack>) {
        Object.assign(this, init);
    }

    album: string;
    artist: string;
    name: string;
    uri: string;
}