"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spotify = void 0;
const Fetch_1 = require("../Utilities/Fetch");
class Spotify {
    constructor(oauthToken) {
        this.oauthToken = oauthToken;
    }
    getTracks(ids) {
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.oauthToken
        };
        return Fetch_1.Fetch.Get(`https://api.spotify.com/v1/tracks/${ids.join(',')}`, headers);
    }
    createPlaylist(user, playlistInfo) {
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.oauthToken
        };
        return Fetch_1.Fetch.Post(`https://api.spotify.com/v1/users/${user}/playlists`, playlistInfo, headers);
    }
    addTrackToPlaylist(trackURIs, playlistId) {
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.oauthToken
        };
        return Fetch_1.Fetch.Post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${trackURIs.join(',')}`, null, headers);
    }
}
exports.Spotify = Spotify;
