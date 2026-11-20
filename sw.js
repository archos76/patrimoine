Aucun élément sélectionné

Aller au contenu
Utiliser Gmail avec un lecteur d'écran
1 sur 3 521
(aucun objet)
Boîte de réception

raphael rousselle <raphael.rousselle@gmail.com>
Pièces jointes
16:37 (il y a 0 minute)
À moi




Envoyé de mon iPhone
 Une pièce jointe
  •  Analysé par Gmail
Avertissement de l'analyse antivirus – 1 pièce jointe contient un virus ou un fichier bloqué. Le téléchargement de cette pièce jointe a été désactivé.

sw.js
100 %
/* Mon Patrimoine : ce qui permet d'ouvrir l'application sans réseau.
   - la page elle-même : on essaie d'abord le réseau (pour avoir la dernière version),
     et on garde une copie pour les moments sans connexion ;
   - les bibliothèques (graphiques, Firebase) et l'icône : la copie gardée suffit.
   Les cours de bourse et tes données ne passent pas par ici : Firebase garde sa propre copie. */
const CACHE = 'patrimoine-v2';
const PAGE = './index.html';
const LIBS = [
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/d3@7.9.0/dist/d3.min.js',
  'https://cdn.jsdelivr.net/npm/d3-sankey@0.12.3/dist/d3-sankey.min.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c =>
    Promise.all([PAGE, './icone.png', './icone-192.png', './manifest.webmanifest', './actions.json'].concat(LIBS)
      .map(u => c.add(new Request(u, {cache: 'reload'})).catch(() => null)))
  ).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  /* la page : réseau d'abord, copie si hors connexion */
  if (r.mode === 'navigate' && u.origin === location.origin) {
    e.respondWith(fetch(r).then(rep => {
      if (rep && rep.ok) { const copie = rep.clone(); caches.open(CACHE).then(c => c.put(PAGE, copie)); }
      return rep;
    }).catch(() => caches.match(PAGE).then(x => x || caches.match(r))));
    return;
  }
  /* bibliothèques et images : la copie gardée, sinon le réseau */
  if (LIBS.indexOf(r.url) >= 0 || (u.origin === location.origin && /\.(png|webmanifest|json)$/.test(u.pathname))) {
    e.respondWith(caches.match(r).then(x => x || fetch(r).then(rep => {
      if (rep && (rep.ok || rep.type === 'opaque')) { const copie = rep.clone(); caches.open(CACHE).then(c => c.put(r, copie)); }
      return rep;
    })));
  }
});
Affichage de sw.js en cours...pierre-edouard.alzon@1687.notaires.fr. Appuyez sur Tabulation pour insérer.
