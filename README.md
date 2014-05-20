frontendcmsvs
=============

Dossiers contenant les différentes versions de l'interface du CMS.

### Structure
**Bootstrap**
Le CMS utilise Bootstrap pour le CSS et l'ergonomie

**Prototypes**
Utilisation de trois prototypes pour le moment : 

*Item* : représente un élément d'un menu ==> item_prototype.js<br/>
*Menu* : représente un menu d'un site ==> menu_prototype.js<br/>
*GestionnaireMenu* : fait le lien entre les prototypes et le DOM via des fonctions.<br/>

### Communication avec le backend

Communication exclusivement en *JSON* => Envoi par exemple de la chaine JSON représentant un Menu.

Pour toute modification du format : Voir les méthodes *to_json* et *from_json*.


