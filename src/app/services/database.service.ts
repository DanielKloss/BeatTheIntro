import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

import { SpotifyTrack } from '../models/spotifyTrack';
import { SpotifyArtist } from '../models/spotifyArtist';
import { Platform } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
    private sqlite: SQLite;
    private database: SQLiteObject

    constructor(private Sqlite: SQLite, private platform: Platform) {
        this.sqlite = Sqlite;

        if(platform.is("cordova")){
            this.sqlite.create({
                name: 'spotifyMusic.db',
                location: 'default'
            }).then((db: SQLiteObject) => {
                this.database = db;
                this.database.executeSql('CREATE TABLE IF NOT EXISTS artists(id INT NOT NULL PRIMARY KEY, name VARCHAR(50) NOT NULL, uri VARCHAR(50) NOT NULL)');
                this.database.executeSql('CREATE TABLE IF NOT EXISTS tracks(uri INT NOT NULL PRIMARY KEY, name VARCHAR(50) NOT NULL, artistId INT NOT NULL)');
            });
        }
    }

    async databaseEmpty(): Promise<boolean>{
        if(!this.platform.is("cordova")){
            return true;
        }

        let artists = await this.database.executeSql('SELECT id FROM artists');
        let tracks = await this.database.executeSql('SELECT uri FROM tracks');

        if(artists.rows.length > 0 && tracks.rows.length > 0){
            return false;
        } else {
            return true;
        }
    }

    async addTracksToDatabase(tracks: SpotifyTrack[]) : Promise<boolean> {
        if(!this.platform.is("cordova")){
            return false;
        }

        for (let i = 0; i < tracks.length; i++) {
            let data = await this.database.executeSql('SELECT id FROM artists WHERE id = ?', [tracks[i].artist.id]);

            if (data.rows.length == 0) {
                this.database.executeSql('INSERT INTO artists VALUES ?, ?, ?', [tracks[i].artist.id, tracks[i].artist.name, tracks[i].artist.uri]);
            }

            data = await this.database.executeSql('SELECT uri FROM tracks WHERE uri = ?', [tracks[i].uri]);

            if (data.rows.length == 0) {
                this.database.executeSql('INSERT INTO tracks VALUES ?, ?, ?', [tracks[i].uri, tracks[i].name, tracks[i].artist.id]);
            }
        }

        return true;
    }

    async getTracksFromDatabase(): Promise<SpotifyTrack[]>{
        return await this.database.executeSql('SELECT * FROM tracks');
    }

    async getArtistsFromDatabase(): Promise<SpotifyArtist[]>{
        return await this.database.executeSql('SELECT * FROM artists');
    }
}
