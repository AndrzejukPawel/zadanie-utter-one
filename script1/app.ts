import { Playlist } from '../model/Playlist';
import { Song } from '../model/Song';
import { Fetch } from './Fetch';
import Database from 'better-sqlite3'
import { ProgramArguments } from './ProgramArguments';

class App{
    readonly dropIfExistsPlaylistTable = `DROP TABLE IF EXISTS Playlist;`
    readonly createPlaylistTable = `
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
    
    readonly dropIfExistsSongTable = `DROP TABLE IF EXISTS Song;`
    readonly createSongTable = `
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
    
    readonly dropIfExistsPlaylistSongListTable = `DROP TABLE IF EXISTS PlaylistSongList;`
    readonly createPlaylistSongListTable = `
    CREATE TABLE PlaylistSongList(
        playlistId string,
        songId string,
        PRIMARY KEY (playlistId, songId)
    );`;

    readonly dropIfExistsSongGrouped = `DROP TABLE IF EXISTS SongGrouped;`
    readonly createSongGrouped = `
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
    
    insertData(db: Database, tablename: string, data: object[]){
        const cols = Object.keys(data[0]).join(", ");
        const placeholders = Object.keys(data[0]).fill('?').join(", ");
        var insert = db.prepare('INSERT OR IGNORE INTO ' + tablename + ' (' + cols + ') VALUES (' + placeholders + ')');
        var insertMany = db.transaction((array)=>{
            for(const element of array){
                insert.run(Object.values(element));
            }
        });
        insertMany(data);
    }

    groupSongs(db: Database){
        db.prepare(`
            CREATE TABLE SongGrouped AS
            SELECT songId, isrc, title, artist, parentalAdvisory, adultOnly, label, subLabel, displayedTitle, displayedArtist, artwork, itunes, spotify, sample_aac10, sample_wav10, sample_mp310, sample_ogg10, sample_aac20, sample_wav20, sample_mp320, sample_mp320_enc, sample_ogg20, sample_ogg20_enc, sample_aac30, sample_wav30, sample_mp330, sample_ogg30
            FROM Song
            GROUP BY songId, isrc, title, artist, parentalAdvisory, adultOnly, label, subLabel, displayedTitle, displayedArtist, artwork, itunes, spotify, sample_aac10, sample_wav10, sample_mp310, sample_ogg10, sample_aac20, sample_wav20, sample_mp320, sample_mp320_enc, sample_ogg20, sample_ogg20_enc, sample_aac30, sample_wav30, sample_mp330, sample_ogg30;
        `).run();
    }

    initializeDatabase(db: Database){        
        db.prepare(this.dropIfExistsPlaylistTable).run();
        db.prepare(this.dropIfExistsSongTable).run();
        db.prepare(this.dropIfExistsPlaylistSongListTable).run();
        db.prepare(this.dropIfExistsSongGrouped).run();

        db.prepare("VACUUM").run();

        db.prepare(this.createPlaylistTable).run();
        db.prepare(this.createSongTable).run();
        db.prepare(this.createPlaylistSongListTable).run();
    }

    main(args: string[]){
    
        var params = new ProgramArguments(args.slice(2));
        
        const db = new Database(params.databasePath);
        this.initializeDatabase(db);


        (Fetch.Get(params.url) as Promise<Playlist[]>).then(playlists => {
            playlists.forEach((playlist) =>{
                playlist.artist = playlist.artist?1:0;
                playlist.adultOnly = playlist.adultOnly?1:0;
            })
            this.insertData(db, 'Playlist', playlists);
            var promises:Promise<any>[] = [];
            playlists.forEach((playlist) => {
                promises.push((Fetch.Get(playlist.songsLink) as Promise<Song[]>).then(songs => {
                    
                    console.log("processing playlist " + playlist.playlistId)

                    songs.forEach((song) =>{
                        song.adultOnly = song.adultOnly?1:0;
                    })
                    this.insertData(db, 'Song', songs);
                    this.insertData(db, 'PlaylistSongList', songs.map(song => {
                        return {playlistId: playlist.playlistId, songId: song.songId}
                    }));
                }));
            })
            Promise.allSettled(promises).then(() =>{
                console.log("grouping songs");
                db.prepare(this.createSongGrouped).run();
            });
        });
    }    
}
new App().main(process.argv);

//node ./script1/app.js -url https://storage.googleapis.com/songpop3-catalog/v1/latest/catalog.spp.json -databasePath D:/tmp/db.sqlite