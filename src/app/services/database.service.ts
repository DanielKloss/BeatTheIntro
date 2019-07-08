import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

import { SpotifyTrack } from '../models/spotifyTrack';

@Injectable()
export class databaseService {
    private sqlite: SQLite;
    private database: SQLiteObject

    constructor(Sqlite: SQLite) {
        this.sqlite = Sqlite;

        this.sqlite.create({
            name: 'spotifyMusic.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            this.database = db;
        });
    }

    addTracksToDatabase(tracks: SpotifyTrack[]) {
        for (let i = 0; i < tracks.length; i++) {
            this.database.executeSql('SELECT id FROM artist WHERE id = ?', [tracks[i].artist.id]).then(data => {
                if (data.rows.length == 0) {
                    this.database.executeSql('INSERT INTO artist VALUES ?, ?, ?', [tracks[i].artist.id, tracks[i].artist.name, tracks[i].artist.uri]);
                }
            });
            this.database.executeSql('SELECT uri FROM track WHERE uri = ?', [tracks[i].uri]).then(data => {
                if (data.rows.length == 0) {
                    this.database.executeSql('INSERT INTO track VALUES ?, ?, ?', [tracks[i].uri, tracks[i].artist.id, tracks[i].name]);
                }
            })
        }
    }
}
