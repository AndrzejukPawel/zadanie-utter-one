"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Fetch_1 = require("./Fetch");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const ProgramArguments_1 = require("./ProgramArguments");
class App {
    constructor() {
        this.dropIfExistsPlaylistTable = `DROP TABLE IF EXISTS Playlist;`;
        this.createPlaylistTable = `
    CREATE TABLE Playlist(
        categoryId string,
        keyCost number,
        playlistId string,
        description string,
        artist boolean,
        fieldOnly string,
        popularity number,
        artwork string,
        songsLink string,
        locale string,
        replacing string,
        adultOnly boolean,
        displayName string
    );`;
        this.dropIfExistsSongTable = `DROP TABLE IF EXISTS Song;`;
        this.createSongTable = `
    CREATE TABLE Song(
        songId string,
        isrc string,
        title string,
        artist string,
        parentalAdvisory string,
        adultOnly boolean,
        label string,
        subLabel string,
        displayedTitle string,
        displayedArtist string,
        artwork string,
        itunes string,
        spotify string,
        sample_aac10 string,
        sample_wav10 string,
        sample_mp310 string,
        sample_ogg10 string,
        sample_aac20 string,
        sample_wav20 string,
        sample_mp320 string,
        sample_mp320_enc string,
        sample_ogg20 string,
        sample_ogg20_enc string,
        sample_aac30 string,
        sample_wav30 string,
        sample_mp330 string,
        sample_ogg30 string
    );`;
        this.dropIfExistsPlaylistSongListTable = `DROP TABLE IF EXISTS PlaylistSongList;`;
        this.createPlaylistSongListTable = `
    CREATE TABLE PlaylistSongList(
        playlistId string,
        songId string,
        PRIMARY KEY (playlistId, songId)
    );`;
        this.dropIfExistsSongGrouped = `DROP TABLE IF EXISTS SongGrouped;`;
        this.createSongGrouped = `
        CREATE TABLE SongGrouped AS
        SELECT songId, isrc, title, artist, parentalAdvisory, 
            adultOnly, label, subLabel, displayedTitle, displayedArtist, 
            artwork, itunes, spotify, sample_aac10, sample_wav10, 
            sample_mp310, sample_ogg10, sample_aac20, sample_wav20, sample_mp320, 
            sample_mp320_enc, sample_ogg20, sample_ogg20_enc, sample_aac30, sample_wav30, 
            sample_mp330, sample_ogg30
        FROM Song
        GROUP BY songId, isrc, title, artist, parentalAdvisory, 
            adultOnly, label, subLabel, displayedTitle, displayedArtist, 
            artwork, itunes, spotify, sample_aac10, sample_wav10, 
            sample_mp310, sample_ogg10, sample_aac20, sample_wav20, sample_mp320, 
            sample_mp320_enc, sample_ogg20, sample_ogg20_enc, sample_aac30, sample_wav30, 
            sample_mp330, sample_ogg30;`;
    }
    insertData(db, tablename, data) {
        const cols = Object.keys(data[0]).join(", ");
        const placeholders = Object.keys(data[0]).fill('?').join(", ");
        var insert = db.prepare('INSERT OR IGNORE INTO ' + tablename + ' (' + cols + ') VALUES (' + placeholders + ')');
        var insertMany = db.transaction((array) => {
            for (const element of array) {
                insert.run(Object.values(element));
            }
        });
        insertMany(data);
    }
    groupSongs(db) {
        db.prepare(`
            CREATE TABLE SongGrouped AS
            SELECT songId, isrc, title, artist, parentalAdvisory, adultOnly, label, subLabel, displayedTitle, displayedArtist, artwork, itunes, spotify, sample_aac10, sample_wav10, sample_mp310, sample_ogg10, sample_aac20, sample_wav20, sample_mp320, sample_mp320_enc, sample_ogg20, sample_ogg20_enc, sample_aac30, sample_wav30, sample_mp330, sample_ogg30
            FROM Song
            GROUP BY songId, isrc, title, artist, parentalAdvisory, adultOnly, label, subLabel, displayedTitle, displayedArtist, artwork, itunes, spotify, sample_aac10, sample_wav10, sample_mp310, sample_ogg10, sample_aac20, sample_wav20, sample_mp320, sample_mp320_enc, sample_ogg20, sample_ogg20_enc, sample_aac30, sample_wav30, sample_mp330, sample_ogg30;
        `).run();
    }
    initializeDatabase(db) {
        db.prepare(this.dropIfExistsPlaylistTable).run();
        db.prepare(this.dropIfExistsSongTable).run();
        db.prepare(this.dropIfExistsPlaylistSongListTable).run();
        db.prepare(this.dropIfExistsSongGrouped).run();
        db.prepare("VACUUM").run();
        db.prepare(this.createPlaylistTable).run();
        db.prepare(this.createSongTable).run();
        db.prepare(this.createPlaylistSongListTable).run();
    }
    main(args) {
        var params = new ProgramArguments_1.ProgramArguments(args.slice(2));
        const db = new better_sqlite3_1.default(params.databasePath);
        this.initializeDatabase(db);
        Fetch_1.Fetch.Get(params.url).then(playlists => {
            playlists.forEach((playlist) => {
                playlist.artist = playlist.artist ? 1 : 0;
                playlist.adultOnly = playlist.adultOnly ? 1 : 0;
            });
            this.insertData(db, 'Playlist', playlists);
            var promises = [];
            playlists.forEach((playlist) => {
                promises.push(Fetch_1.Fetch.Get(playlist.songsLink).then(songs => {
                    console.log("processing playlist " + playlist.playlistId);
                    songs.forEach((song) => {
                        song.adultOnly = song.adultOnly ? 1 : 0;
                    });
                    this.insertData(db, 'Song', songs);
                    this.insertData(db, 'PlaylistSongList', songs.map(song => {
                        return { playlistId: playlist.playlistId, songId: song.songId };
                    }));
                }));
            });
            Promise.allSettled(promises).then(() => {
                console.log("grouping songs");
                db.prepare(this.createSongGrouped).run();
            });
        });
    }
}
new App().main(process.argv);
//node ./script1/app.js -url https://storage.googleapis.com/songpop3-catalog/v1/latest/catalog.spp.json -databasePath D:/tmp/db.sqlite
