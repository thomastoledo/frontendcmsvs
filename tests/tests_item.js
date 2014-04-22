//Éviter les conflits entre browsers
var jq = jQuery.noConflict();

var it = new Item();

jq("#results").append("<p>-----------------------------------------");
jq("#results").append("        TESTS PROTOTYPE Item        <br/>");
jq("#results").append("-----------------------------------------</p>");

jq("#results").append("<p>Clé générée dès la création de l'objet : " + it.get_key() +"</p>");

it.set_key(jq.now());
it.set_ordre(1);
it.set_txt("Hello! Je suis l'item 1!");

jq("#results").append("<p>Nouvelle clé : " + it.get_key() +"</p>");
jq("#results").append("<p>Nouvel ordre : " + it.get_ordre() +"</p>");
jq("#results").append("<p>Parent null : " + it.get_parent() +"</p>");
jq("#results").append("<p>Nouveau texte: " + it.get_txt() +"</p>");


jq("#results").append("<p>----------------------------------------------------------------------------------</p><br/>");

var it2 = new Item();

it.push(it2);

jq("#results").append("<p>Nouvel item ayant pour parent le premier item : " + it2.get_parent().get_txt() +"</p>");

it2 = it.clone();
jq("#results").append("<p>Deuxième item cloné et équivalent au premier :</p>");
jq("#results").append("<p>Nouvelle clé : " + it2.get_key() +"</p>");
jq("#results").append("<p>Nouvel ordre : " + it2.get_ordre() +"</p>");
jq("#results").append("<p>Parent null : " + it2.get_parent() +"</p>");
jq("#results").append("<p>Nouveau texte: " + it2.get_txt() +"</p>");

jq("#results").append("<p>----------------------------------------------------------------------------------</p><br/>");

it2.set_txt("Je suis l'item 2!");
it2.push(it);
jq("#results").append("<p>Longueur du tableau du premier item : " + it.get_nb_children() + "</p>");
jq("#results").append("<p>Longueur du tableau du second item : " + it2.get_nb_children() + "</p>");
jq("#results").append("<p>Parent du premier item : " + it.get_parent().get_txt() + "</p>");

jq("#results").append("<p>----------------------------------------------------------------------------------</p><br/>");

it.push(it2);
jq("#results").append("<p>Longueur du tableau du premier item après tentative d'insertion du second item parmi les enfants: " 
	+ it.get_nb_children() + "</p>");

it.push(it2);
jq("#results").append("<p>Parent du second item après tentative de set le premier en parent : " + it2.get_parent() + "</p>");
jq("#results").append("<p>Texte de l'enfant de l'item 2 de key " + it.get_key() + " : " + it2.get(it.get_key()).get_txt() + "</p>");
jq("#results").append("<p>Enfant de l'item 2 de key 0 : " + it2.get(0) + "</p>");


jq("#results").append("<p>----------------------------------------------------------------------------------</p><br/>");

var it3 = it2.pop();
jq("#results").append("<p>Troisième item = it2.pop() :</p>");
jq("#results").append("<p>Nouvelle clé : " + it3.get_key() +"</p>");
jq("#results").append("<p>Nouvel ordre : " + it3.get_ordre() +"</p>");
jq("#results").append("<p>Parent : " + it3.get_parent().get_txt() +"</p>");
jq("#results").append("<p>Nouveau texte: " + it3.get_txt() +"</p>");
jq("#results").append("<p>Longueur du tableau du second item : " + it2.get_nb_children() + "</p>");

it2.push(3);
jq("#results").append("<p>Longueur du tableau du second item après push d'un int : " + it2.get_nb_children() + "</p>");


jq("#results").append("<p>----------------------------------------------------------------------------------</p><br/>");

jq("#results").append("<p>Chaine JSON correspondante à l'it2 : " + JSON.stringify(it2.to_json()) + "</p>");

it2.push(it);
it3.from_json(JSON.stringify(it2.to_json()));

jq("#results").append("<p>Troisième item ==> it3.from_json(it2.to_json()) :</p>");
jq("#results").append("<p>Nouvelle clé : " + it3.get_key() +"</p>");
jq("#results").append("<p>Nouvel ordre : " + it3.get_ordre() +"</p>");
jq("#results").append("<p>Parent null : " + it3.get_parent() +"</p>");
jq("#results").append("<p>Nouveau texte : " + it3.get_txt() +"</p>");
jq("#results").append("<p>Nombre d'enfants : " + it3.get_nb_children() +"</p>");

