import { AxiosRequestHeaders } from 'axios';
import { Fetch } from '../Utilities/Fetch'

export class Spotify{

    private oauthToken:string;

    constructor(oauthToken: string){
        this.oauthToken = oauthToken;
    }

    getTracks(ids: string[]): Promise<any>{
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.oauthToken
        }
        return Fetch.Get(`https://api.spotify.com/v1/tracks/${ids.join(',')}`, headers);
    }

    createPlaylist(user: string, playlistInfo: {name:string, description: string, public: boolean}){
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.oauthToken
        }
        return Fetch.Post(`https://api.spotify.com/v1/users/${user}/playlists`, playlistInfo, headers)
    }

    addTrackToPlaylist(trackURIs: string[], playlistId: string){
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.oauthToken
        }
        return Fetch.Post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${trackURIs.join(',')}`, null, headers)
    }
}