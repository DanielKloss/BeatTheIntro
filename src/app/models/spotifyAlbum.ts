export class SpotifyAlbum{
    public constructor(init?: Partial<SpotifyAlbum>) {
        Object.assign(this, init);
    }

    href: string;
    id: string;
    name: string;
    artist: string;
    tracks: string;
    numberOfTracks: number;
    uri: string;
}