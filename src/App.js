import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Icon } from '@iconify/react'
import bxCopy from '@iconify/icons-bx/bx-copy'

import './App.scss'

function App() {

  // getting playlist from Spotify API
  const [playlistID, setID] = useState('Enter Playlist ID')
  const [playlistName, setName] = useState('')
  const [playlistOwner, setOwner] = useState('')
  const [playlistTracks, setTrack] = useState([])

  const GetPlaylist = event => {
    event.preventDefault()
    let request = require('request')
    const client_id = '3db56f3a8f864d0f82169d8d74dea551'
    const client_secret = '95dd0815b84541ac86fe502139f3f91d'
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      form: {
        grant_type: 'client_credentials'
      },
      json: true
    }
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        let token = body.access_token
        let options = {
          url: 'https://api.spotify.com/v1/playlists/' + playlistID,
          headers: {
            'Authorization': 'Bearer ' + token
          },
          json: true
        }
        request.get(options, function(error, response, body) {
          document.getElementById("instruction").style.display = "none"
          if (typeof body === 'object' && body !== null) {
            if (body.name !== undefined) {
              setName(body.name)
              document.getElementById("results").style.display = "block"
              document.getElementById("tryagain").style.display = "none"
            } else {
              document.getElementById("tryagain").style.display = "block"
            }
            if (body.owner !== undefined) {setOwner(body.owner.display_name)}
            if (body.tracks !== undefined) {setTrack(body.tracks.items)}
          }
        })
      }
    })
    console.log(playlistTracks)
    console.log(playlistID)
  }

  // for copy to clipboard button
  function CopyToClipboard(element) {
    var range = document.createRange()
    range.selectNode(document.getElementById( element ))
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)
    document.execCommand("copy")
    window.getSelection().removeAllRanges()
  }

  return (
    <main className="App">
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <form onSubmit={GetPlaylist} autoComplete="off" className="trackIDform">
        <input type="text" id="playlist" name="playlist" value={playlistID} onClick={() => setID('')} onChange={event => setID(event.target.value)} />
        <button type="submit">Let's Go</button>
      </form>

      <div className="results" id="results">
        <h3 id="playlistName">{playlistName}<small>Playlist Name</small></h3>
        <h3 id="playlistOwner">{playlistOwner}<small>Published By</small></h3>
        <table className="tracklisting" id="tracktable">
        <thead>
          <tr>
            <th>Track</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Added on</th>
          </tr>
        </thead>
        <tbody>
          {playlistTracks.map((track, index) => (
            <tr key={index}>
              <td>
                <div className="justify">
                  <div id={`${index}trackname`}>{track.track.name}</div>
                  <button onClick={() => CopyToClipboard(`${index}trackname`)}><Icon icon={bxCopy} width="20px" /></button>
                </div>
              </td>
              <td>
                <div className="justify">
                  <div id={`${index}artistname`}>
                    {track.track.artists.map((artist, index) => (
                      index === 0 ? 
                      <span key={index}>{artist.name}</span> : 
                      <span key={index}>, {artist.name}</span>
                    ))}
                  </div>
                  <button onClick={() => CopyToClipboard(`${index}artistname`)}>Copy</button>
                </div>
              </td>
              <td>
                <div className="justify">
                  <div id={`${index}albumname`}>{track.track.album.name}</div>
                  <button onClick={() => CopyToClipboard(`${index}albumname`)}>Copy</button>
                </div>
              </td>
              <td>{track.added_at.substring(0, 10)}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      <div id="tryagain"> 
        Try again
      </div>

      <div id="instruction">
        Get the basic information and tracklist of any public Spotify playlist.
      </div>

      
    </main>
  )
}

export default App
