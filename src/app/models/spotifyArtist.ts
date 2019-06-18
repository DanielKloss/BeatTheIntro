export class SpotifyArtist {
    public constructor(init?: Partial<SpotifyArtist>) {
        Object.assign(this, init);
    }

    name: string;
    href: string;
    uri: string;
    id: string;
}