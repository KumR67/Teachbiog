1️⃣ Fonctionnalités opérationnelles dans le navigateur

Recherche avancée :

Par mot, expression exacte (entre guillemets), ou avec des jokers (*).

Filtres par rubriques activables/désactivables.

Affichage des fiches :

Les enregistrements JSON sont affichés avec le HTML interprété (<i>, <br>, etc.).

Les rubriques sont listées correctement.

Colonne sources → clic pour naviguer vers la fiche correspondante.

Édition locale :

Bouton Modifier sur chaque fiche.

Les champs deviennent modifiables via <textarea>.

Boutons Prévisualiser, Valider, Annuler disponibles.

Modifications locales appliquées à l’objet JSON en mémoire.

2️⃣ Limitations actuelles

Les modifications ne sont pas encore sauvegardées directement dans GitHub depuis le navigateur.

Le workflow proxy côté GitHub Actions ne peut pas être appelé directement depuis le navigateur sans serveur intermédiaire ou exposer un token côté client (ce qui n’est pas sûr).



3️⃣ Architecture du projet

/docs/index.html → interface principale.

/docs/css/style.css et /docs/css/editor.css → styles généraux et édition.

/docs/js/main.js → recherche + affichage des résultats + gestion rubriques + surlignage.

/docs/js/editor.js → édition locale et boutons Modifier/Prévisualiser/Valider/Annuler.

/docs/data/Word_to_Json_BiblioTeacher.json → données JSON locales.

.github/workflows/modify_json.yaml → workflow GitHub pour modifier le JSON via Actions, mais pas accessible directement depuis le navigateur sans serveur intermédiaire.

4️⃣ Prochaines étapes possibles

Mettre en place un petit serveur intermédiaire pour déclencher le workflow en toute sécurité depuis le navigateur (via fetch + token côté serveur).

Ajouter export/backup local des modifications avant commit GitHub.

Améliorer l’UI/UX : boutons toujours visibles, responsive, affichage sur une seule page sans scroll horizontal.

Ajouter historique des modifications locales avant validation.
