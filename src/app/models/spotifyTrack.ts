import { SpotifyArtist } from "./spotifyArtist";

export class SpotifyTrack {
    public constructor(init?: Partial<SpotifyTrack>) {
        Object.assign(this, init);
    }

    album: string;
    artist: SpotifyArtist;
    name: string;
    uri: string;
}