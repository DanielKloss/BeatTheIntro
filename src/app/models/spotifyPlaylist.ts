export class SpotifyPlaylist {

    public constructor(init?: Partial<SpotifyPlaylist>) {
        Object.assign(this, init);
    }

    href: string;
    id: string;
    name: string;
    tracks: string;
    numberOfTracks: number;
    uri: string;
}