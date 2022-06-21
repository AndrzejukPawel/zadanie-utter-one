import { ProgramArguments } from "./ProgramArguments";
import Database from 'better-sqlite3'
import { Spotify } from "./Spotify";
import { CsvIO } from '../Utilities/CsvIO'
import { Fetch } from "../Utilities/Fetch";

class App{

    db: Database;
    spotify: Spotify;

    constructor(args: string[]){
        var params = new ProgramArguments(args.slice(2));
        this.db = new Database(params.databasePath);
        this.spotify = new Spotify(params.oauthToken);


        switch(params.action){
            case 'getInfoForSongsInPlaylist':{
                Fetch.setThrottle(5);
                this.getInfoForSongsInPlaylist(params.actionParameter).then(tracksInfoPromises => {
                    Promise.all(tracksInfoPromises).then(tracksInfo => {
                        CsvIO.Write(params.outputFolder + '/result3a.csv', tracksInfo);
                    })
                })
                break;
            }
            case 'importPlaylistToSpotify':{
                Fetch.setThrottle(0.5);
                this.importPlaylistToSpotify(params.userId, params.actionParameter);
                break;
            }
        }
    }

    async getInfoForSongsInPlaylist(playlistId: string): Promise<object[]>{
        const query = `SELECT s.spotify 
            FROM (
                Select playlistId from Playlist p 
                WHERE p.playlistId = '${playlistId}'
            ) p
            left join PlaylistSongList psl on p.playlistId = psl.playlistId 
            left join Song s on s.songId = psl.songId
            GROUP BY s.songId, s.spotify `

        var statement = this.db.prepare(query);
        var queryResult:any[] = [];
        for(var row of statement.iterate()){
            queryResult.push(row);
        }

        var spotifySongIds = (queryResult as {spotify:string}[]).filter(row => row.spotify != null).map(row => row.spotify.substring(14));

        return spotifySongIds.map(async songId => {
            return this.spotify.getTracks([songId]).then(track => {
                console.log(track.name);
                return {
                    trackName: track.name,
                    trackLengthMs: track.duration_ms,
                    trackPopularity: track.popularity,
                    albumName: track.album.name
                };
            })
        })
    }

    importPlaylistToSpotify(userId:string, playlistId: string){
        var playlistInfo = this.getPlaylistInfo(playlistId);
        var tracksURIs = this.getPlaylistTracksURIs(playlistId);
        this.spotify.createPlaylist(userId, {name: playlistInfo.displayName, description: playlistInfo.description, public: true}).then((response) => {
            tracksURIs.forEach(trackURI => {
                this.spotify.addTrackToPlaylist([trackURI], response.id)
            })
        })
    }

    getPlaylistInfo(playlistId:string): any{
        const playlistQuery = `
            Select displayName, description  
            from Playlist p 
            WHERE p.playlistId = '${playlistId}'`;

        var playlistStatement = this.db.prepare(playlistQuery);
        var playlistInfo:any;
        for(var row of playlistStatement.iterate()){
            playlistInfo = row;
        }
        return playlistInfo;
    }

    getPlaylistTracksURIs(playlistId:string): string[]{
        const tracksQuery = `SELECT s.spotify 
            FROM (
                Select playlistId from Playlist p 
                WHERE p.playlistId = '${playlistId}'
            ) p
            left join PlaylistSongList psl on p.playlistId = psl.playlistId 
            left join Song s on s.songId = psl.songId
            GROUP BY s.songId, s.spotify `

        var tracksStatment = this.db.prepare(tracksQuery);
        var tracksURIs:any[] = [];
        for(var row of tracksStatment.iterate()){
            tracksURIs.push(row);
        }
        return (tracksURIs as {spotify:string}[]).filter(row => row.spotify != null).map(row => row.spotify);
    }
}

new App(process.argv);
//node .\script3\app.js -oauthToken BQBot4FRv0gLMKYuYstyzAJ6cj3zTpT0fWZazwJWO8zOXHedDbc8xoNGgTfHDSOwQ2G3L70967YgDkEBm7sO06mGP9WMhcdX_t97pRkE5pZ6c5OkaJ4RtOpitHvcv8jAOP3xljayDX8il42BZPLXL6oPtOvqvAVhfsTFL0duLf0rz6yEeUz2VaAXfZCWWXugQMfDKe7QmF4N1qMbC81CUmyzLuoXdgvRqu3sCYZQODziUNuIUijnQ5EKsAGWCmnD7A -databasePath D:/tmp/db.sqlite -outputFolder D:/tmp -action getInfoForSongsInPlaylist -actionParameter 74ea0e6b-bdf0-5271-a5d3-92f6efa98581

//node .\script3\app.js -oauthToken BQBot4FRv0gLMKYuYstyzAJ6cj3zTpT0fWZazwJWO8zOXHedDbc8xoNGgTfHDSOwQ2G3L70967YgDkEBm7sO06mGP9WMhcdX_t97pRkE5pZ6c5OkaJ4RtOpitHvcv8jAOP3xljayDX8il42BZPLXL6oPtOvqvAVhfsTFL0duLf0rz6yEeUz2VaAXfZCWWXugQMfDKe7QmF4N1qMbC81CUmyzLuoXdgvRqu3sCYZQODziUNuIUijnQ5EKsAGWCmnD7A -databasePath D:/tmp/db.sqlite -outputFolder D:/tmp -action importPlaylistToSpotify -actionParameter 74ea0e6b-bdf0-5271-a5d3-92f6efa98581 -userId 31llqvdpyytecv3wmhtjyyh2dxwq