var html = require('choo/html')
var choo = require('choo')
var app = choo()
var $ = require('jquery')
require('./styles/styles.css')

app.model({
  state: {
    user: [],
    repos: [],
    username: '',
    placeholder: 'Github username',
    deshabilitar: 'deshabilitar',
    error: ''
  },
  reducers: {
    update: function (state, data) {
      const username = data.toLowerCase().trim()
      return {username}
    },
    userData: function (state, data) {
      state.user = []
      const usuarioData = state.user.slice()
      usuarioData.push(data)
      return {user: usuarioData, error: ''}
    },
    reposData: function (state, data) {
      return {repos: data, deshabilitar: '', error: ''}
    },
    error: function (state, data) {
      return {deshabilitar: 'deshabilitar', error: 'Username does not exist'}
    }
  },
  effects: {
    getUser: (state, data, send, done) => {
      $.ajax({
        url: `https://api.github.com/users/${state.username}`,
        data: {
          client_id: '9e85a1593e50dfcdd468',
          client_secret: '441c931f99b75e65d2d0dfb373a68424031fad44'
        }
      }).done((user) => {
        send('userData', user, done)
        $.ajax({
          url: `https://api.github.com/users/${state.username}/repos`,
          data: {
            client_id: '9e85a1593e50dfcdd468',
            client_secret: '441c931f99b75e65d2d0dfb373a68424031fad44',
            sort: 'created: asc'
          }
        }).done((repos) => {
          send('reposData', repos, done)
        })
      }).fail((error) => {
        send('error', error, done)
      })
    }
  }
})

function mainView (state, prev, send) {
  return html`
    <main class="contenedor">
      <div class="fila">
        <div class="titulo">GitSearch</div>
        <div class="subtitulo">Type a username and press enter</div>
        <form onsubmit=${onSubmit} autocomplete="off">
          <input
            type="text"
            id="search"
            oninput=${update}
            placeholder=${state.placeholder}
          />
          <div class="error">${state.error}</div>
        </form>
        <div class="${state.deshabilitar}">
          ${state.user.map((usuario, index) => html`
            <div id="profile">
              <div class="datos-numeros">
                <div>Public Repos: ${usuario.public_repos}</div>
                <div>Public Gists: ${usuario.public_gists}</div>
                <div>Followers: ${usuario.followers}</div>
                <div>Following: ${usuario.following}</div>
              </div>
              <div class="perfil">
                <p class="perfil-nombre">${usuario.name}</p>
                <a class="perfil-boton" href="${usuario.html_url}" target="_blank">View profile</a>
              </div>
              <div class="datos-extras">
                <idv>
                  <img width="150" src="${usuario.avatar_url}" alt=""/>
                </idv>
                <div class="extras">
                  <div><strong>Company:</strong> ${usuario.company}</div>
                  <div><strong>Website/Blog:</strong> 
                    <a href="${usuario.blog}" target="_blank">${usuario.blog}</a>
                  </div>
                  <div><strong>Location:</strong> ${usuario.location}</div>
                  <div><strong>Member Since:</strong> ${usuario.created_at}</div>
                </div>
              </div>
            </div>
          `)}
          <div id="repos">
            <div class="repos-titulo">
              <h3>Latest Repos</h3>
            </div>
            ${state.repos.map((repo, index) => html`
              <div class="repo-contenedor">
                <div class="repo-encabezado">
                  <div class="repo-titulo">${repo.name}:</div>
                  <div class="repo-descripcion">${repo.description}</div>
                </div>
                <div class="repo-cuerpo">
                  <div>Forks: ${repo.forks_count}</div>
                  <div>Watchers: ${repo.watchers_count}</div>
                  <div>Stars: ${repo.stargazers_count}</div>
                </div>
                <div class="repo-boton">
                  <a href="${repo.html_url}" target="_blank">Repo page</a>
                </div>
              </div>  
            `)}
          </div>
        </div>
      </div>
    </main>
  `

  function update (e) {
    send('update', e.target.value)
  }

  function onSubmit (e) {
    e.preventDefault()
    send('getUser')
  }
}

app.router([
  ['/', mainView],
  ['/gitSearch/', mainView]
])

var tree = app.start()
document.body.appendChild(tree)
