// Obtén el botón de inicio de sesión por su ID
const loginButton = document.getElementById('login');

// URL de redireccionamiento después de la autorización
const redirectUri = 'http://localhost:3000/callback';

// ID de cliente y lista de permisos de tu aplicación registrada en Spotify Developer Dashboard
const clientId = 'bf49d4f246214dc4ad62d3a02aad8a6a';
const scopes = 'user-read-private user-read-email';

// Escucha el evento de clic del botón de inicio de sesión
loginButton.addEventListener('click', () => {
    // Redirige al usuario a la página de autorización de Spotify
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scopes)}&response_type=token`;
});

// Función para extraer los parámetros de la URL
function getHashParams() {
    const hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

// Extrae los parámetros de la URL
const params = getHashParams();

// Verifica si se ha obtenido un token de acceso
if (params.access_token) {
    const token = params.access_token;

    // Realiza una solicitud a la API de Spotify para obtener los datos del perfil del usuario
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            // Muestra los datos del perfil del usuario
            document.getElementById('displayName').textContent = data.display_name;
            document.getElementById('id').textContent = data.id;
            document.getElementById('email').textContent = data.email;
            document.getElementById('uri').textContent = data.uri;
            document.getElementById('uri').href = data.uri;
            document.getElementById('url').textContent = data.external_urls.spotify;
            document.getElementById('url').href = data.external_urls.spotify;
            document.getElementById('imgUrl').textContent = data.images[0].url;
            document.getElementById('avatar').innerHTML = `<img src="${data.images[0].url}" alt="Profile Image">`;

            // Muestra la sección de perfil
            document.getElementById('profile').style.display = 'block';
        })
        .catch(error => {
            console.error('Error al obtener los datos del perfil del usuario:', error);
        });
}
