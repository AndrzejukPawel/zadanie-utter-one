"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProgramArguments_1 = require("./ProgramArguments");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const Spotify_1 = require("./Spotify");
const CsvIO_1 = require("../Utilities/CsvIO");
const Fetch_1 = require("../Utilities/Fetch");
class App {
    constructor(args) {
        var params = new ProgramArguments_1.ProgramArguments(args.slice(2));
        this.db = new better_sqlite3_1.default(params.databasePath);
        this.spotify = new Spotify_1.Spotify(params.oauthToken);
        switch (params.action) {
            case 'getInfoForSongsInPlaylist': {
                Fetch_1.Fetch.setThrottle(5);
                this.getInfoForSongsInPlaylist(params.actionParameter).then(tracksInfoPromises => {
                    Promise.all(tracksInfoPromises).then(tracksInfo => {
                        CsvIO_1.CsvIO.Write(params.outputFolder + '/result3a.csv', tracksInfo);
                    });
                });
                break;
            }
            case 'importPlaylistToSpotify': {
                Fetch_1.Fetch.setThrottle(0.5);
                this.importPlaylistToSpotify(params.userId, params.actionParameter);
                break;
            }
        }
    }
    async getInfoForSongsInPlaylist(playlistId) {
        const query = `SELECT s.spotify 
            FROM (
                Select playlistId from Playlist p 
                WHERE p.playlistId = '${playlistId}'
            ) p
            left join PlaylistSongList psl on p.playlistId = psl.playlistId 
            left join Song s on s.songId = psl.songId
            GROUP BY s.songId, s.spotify `;
        var statement = this.db.prepare(query);
        var queryResult = [];
        for (var row of statement.iterate()) {
            queryResult.push(row);
        }
        var spotifySongIds = queryResult.filter(row => row.spotify != null).map(row => row.spotify.substring(14));
        return spotifySongIds.map(async (songId) => {
            return this.spotify.getTracks([songId]).then(track => {
                console.log(track.name);
                return {
                    trackName: track.name,
                    trackLengthMs: track.duration_ms,
                    trackPopularity: track.popularity,
                    albumName: track.album.name
                };
            });
        });
    }
    importPlaylistToSpotify(userId, playlistId) {
        var playlistInfo = this.getPlaylistInfo(playlistId);
        var tracksURIs = this.getPlaylistTracksURIs(playlistId);
        this.spotify.createPlaylist(userId, { name: playlistInfo.displayName, description: playlistInfo.description, public: true }).then((response) => {
            tracksURIs.forEach(trackURI => {
                this.spotify.addTrackToPlaylist([trackURI], response.id);
            });
        });
    }
    getPlaylistInfo(playlistId) {
        const playlistQuery = `
            Select displayName, description  
            from Playlist p 
            WHERE p.playlistId = '${playlistId}'`;
        var playlistStatement = this.db.prepare(playlistQuery);
        var playlistInfo;
        for (var row of playlistStatement.iterate()) {
            playlistInfo = row;
        }
        return playlistInfo;
    }
    getPlaylistTracksURIs(playlistId) {
        const tracksQuery = `SELECT s.spotify 
            FROM (
                Select playlistId from Playlist p 
                WHERE p.playlistId = '${playlistId}'
            ) p
            left join PlaylistSongList psl on p.playlistId = psl.playlistId 
            left join Song s on s.songId = psl.songId
            GROUP BY s.songId, s.spotify `;
        var tracksStatment = this.db.prepare(tracksQuery);
        var tracksURIs = [];
        for (var row of tracksStatment.iterate()) {
            tracksURIs.push(row);
        }
        return tracksURIs.filter(row => row.spotify != null).map(row => row.spotify);
    }
}
new App(process.argv);
//node .\script3\app.js -oauthToken BQBot4FRv0gLMKYuYstyzAJ6cj3zTpT0fWZazwJWO8zOXHedDbc8xoNGgTfHDSOwQ2G3L70967YgDkEBm7sO06mGP9WMhcdX_t97pRkE5pZ6c5OkaJ4RtOpitHvcv8jAOP3xljayDX8il42BZPLXL6oPtOvqvAVhfsTFL0duLf0rz6yEeUz2VaAXfZCWWXugQMfDKe7QmF4N1qMbC81CUmyzLuoXdgvRqu3sCYZQODziUNuIUijnQ5EKsAGWCmnD7A -databasePath D:/tmp/db.sqlite -outputFolder D:/tmp -action getInfoForSongsInPlaylist -actionParameter 74ea0e6b-bdf0-5271-a5d3-92f6efa98581
//node .\script3\app.js -oauthToken BQBot4FRv0gLMKYuYstyzAJ6cj3zTpT0fWZazwJWO8zOXHedDbc8xoNGgTfHDSOwQ2G3L70967YgDkEBm7sO06mGP9WMhcdX_t97pRkE5pZ6c5OkaJ4RtOpitHvcv8jAOP3xljayDX8il42BZPLXL6oPtOvqvAVhfsTFL0duLf0rz6yEeUz2VaAXfZCWWXugQMfDKe7QmF4N1qMbC81CUmyzLuoXdgvRqu3sCYZQODziUNuIUijnQ5EKsAGWCmnD7A -databasePath D:/tmp/db.sqlite -outputFolder D:/tmp -action importPlaylistToSpotify -actionParameter 74ea0e6b-bdf0-5271-a5d3-92f6efa98581 -userId 31llqvdpyytecv3wmhtjyyh2dxwq
