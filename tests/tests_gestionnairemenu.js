//Éviter les conflits entre browsers
var jq = jQuery.noConflict();


//Création d'un menu et set des attributs
var menu = new Menu();

jq("#results").append("<p>-----------------------------------------");
jq("#results").append("        TESTS PROTOTYPE Menu        <br/>");
jq("#results").append("-----------------------------------------</p>");

jq("#results").append("<p>Clé générée dès la création de l'objet : " + menu.get_key() +"</p>");

menu.set_key(jq.now() + Math.random().toString(36).substr(2));
menu.set_url("http://www.virtualsensitive.com/fr");
menu.set_release("1.0");
menu.set_published(false);
menu.set_language("FR");

jq("#results").append("<p>Nouvelle clé : " + menu.get_key() +"</p>");
jq("#results").append("<p>Nouvelle URL : " + menu.get_url() +"</p>");
jq("#results").append("<p>Nouvelle release : " + menu.get_release() +"</p>");
jq("#results").append("<p>Publié : " + menu.get_published() +"</p>");
jq("#results").append("<p>Langage : " + menu.get_language() +"</p>");
jq("#results").append("<p>Nombre d'items : " + menu.get_published() +"</p>");


//to json et from json
var it = new Item();
var it2 = new Item();

menu.push(it);
it.set_txt("Item 1");

it = new Item();
menu.push(it);
it.set_txt("Item 2");

it2.set_txt("Item 1-1");
it.push(it2);


jq("#results").append("<p>JSON du menu :  " + JSON.stringify(menu.to_json()) +"</p>");

jq("#results").append("<p>JSON de l'item 1-1 :  " + JSON.stringify(menu.get(it2.get_key()).to_json()) +"</p>");

var menu_res = new Menu();
menu_res.from_json(menu.to_json());

jq("#results").append("<p>JSON du menu_res :  " + JSON.stringify(menu_res.to_json()) +"</p>");
