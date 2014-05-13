//Éviter les conflits entre browsers
var jq = jQuery.noConflict();
var vers = 1;


//TODO:
//NOMENCLATURE DES BLOCS
//menu_container_editable
//.item
//etc...
//À SPECIFIER ET DOCUMENTER!!!

/////////////////////////////////
//CONSTRUCTION STATIQUE DU MENU//
/////////////////////////////////
menu = [
{ clef : 3, str : "menu3", parent : 0, ordre : 3, version : 1, langue : "FR", publie : 1, items : [
		{ clef : 5, str : "menu3-1", parent : 3, ordre : 1, version : 1, langue : "FR", publie : 1, items : [] }
		] },
{ clef : 1, str : "menu1", parent : 0, ordre : 1, version : 1, langue : "FR", publie : 1, items : [
		{ clef : 6, str : "menu1-2", parent : 1, ordre : 2, version : 1, langue : "FR", publie : 1, items : [] },
		{ clef : 4, str : "menu1-1", parent : 1, ordre : 1, version : 1, langue : "FR", publie : 1, items : [] }
		] },
{ clef : 2, str : "menu2", parent : 0, ordre : 2, version : 1, langue : "FR", publie : 1, items : []}
];

next_clef = 7; //Comme ici on utilise des données statiques, j'ai mis une clé primaire statique

//Pour ces deux lignes: on set la liste déroulante en haut de page et l'arborescence
jq("#lst_items").append("<option id='menu_container_lst' value='menu_container'>/</option>");
placer_noeuds(jq("#menu_container"),menu);

//TODO: DÉCOMMENTER CETTE LIGNE ET RENSEIGNER L'URL DANS LA FONCTION recuperer_arborescence() juste après
//placer_noeuds(jq("#menu_container"),recuperer_arborescence());

//////////////////////////////////
//CONSTRUCTION DYNAMIQUE DU MENU//
//////////////////////////////////
function recuperer_arborescence(){
	var menu;
	jq.ajax({
		url : 'URL',//TODO: RENSEIGNER URL
		type : 'GET',
		dataType : 'json',
		data : '',
		contentType : "application/json; charset=utf-8",
		traditional : true,
		success : function(msg) {
			menu = JSON.parse(msg);
		},
		error : function(msg) {
		},
	});

	return menu;

}


//Placer une liste de noeud dans un arbre
//à partir d'un parent donné
//parent: le parent
//noeuds: la liste de noeuds
function placer_noeuds(parent,noeuds){
	var l = noeuds.length;
	var i, j;
	for(i=0; i<l; ++i){
		for(j=0; j<l; ++j){
			if(noeuds[j].ordre == i+1){
				//ajouter le noeud à l'arborescence
				parent.append("<ul class='breadcrumb item' id='" + noeuds[j].clef + "''>" + noeuds[j].str + "</ul >");

				//ajouter le noeud à la liste des items

				jq("#lst_items").append("<option id='" + noeuds[j].clef + "_lst' value='" + noeuds[j].clef + "'>" + noeuds[j].str + "</option>");


				//placer les items du noeud avec ce dernier en racine
				placer_noeuds(jq("#" + noeuds[j].clef),noeuds[j].items);
				break;
			}
		}
	}
}

///////////////////
//AJOUTER UN ITEM//
///////////////////
jq("#add_item").click(function(){

	var txt = jq("#txt_item").val(); //on récupère le titre de l'item
	if(txt == ""){
		jq("#txt_item").focus();
		return;
	}
	var parent = jq('#lst_items').find(":selected").val(); //on récupère le parent
	alert(parent);
	//ajouter le nouveau noeud à l'arbre
	//TODO: DANS CETTE FONCTION LUI FAIRE RETOURNER 
	add_new_item(creer_nouvel_item(parent,txt));
	next_clef ++; //TODO: À COMMENTER SI ON UTILISE LE BACKEND
}
);


function add_new_item(item){

	//var child = jq("#" + item.parent).children().last(); //on récupère le dernier enfant du parent
	//var grand_childrend = child.children(); //on récupère 
	//var lg = grand_childrend.length;
	//TODO : FONCTION POUR RÉCUPÉRER L'ID DANS LA LISTE DÉROULANTE OÙ PLACER LE NOUVEL ITEM
	//RÉCURSIVITÉ EN VUE MON CAPITAINE!
	//POUR LE PLACER APRÈS LE DERNIER ENFANT DU DERNIER ENFANT DU .... DU DERNIER ENFANT DU PARENT.



	var place = child.children(lg-1);
	alert(place.id);
	jq("#" + place.id + "_lst").after("<option id='" + item.clef +"_lst' value='" + item.clef + "'>" + item.str + "</option>");
	
	//Si on est en mode 'modification'
	if(!jq("#panel_editable").hasClass("hidden")){
		jq("#" + item.parent + "_editable").append("<ul id='" + item.clef + "_editable' class='breadcrumb item'> <input id='" + item.clef +
		"_edited' type='text' class='list-group-item item_edited' value='" + item.str + "'></input></ul>");
		maj_lst_items();
		return;
	}

	//sinon on est en mode 'structure'
	jq("#" + item.parent).append("<ul class='breadcrumb item'  id='" + item.clef + "'>" + item.str + "</ul>");
}

//Fonction retournant le nouvel objet JSON
function creer_nouvel_item(parent,str){
	//TODO: à la place de 'next_clef', mettre 'jq.now()'
	return { clef : jq.now()  , str : str, parent : parent, ordre : (jq("#" + parent).children().size() + 1)
	, version : (vers+1) , langue : "FR", items : [] };
}

///////////////////////
//ANNULER LES SAISIES//
///////////////////////
jq("#cancel").click(function(){

	jq("#lst_items").empty(); ///on vide la liste déroulante

	//On vide le container
	jq("#menu_container").empty();
	jq("#panel_structure").removeClass("hidden");

	//Et on se replace sur l'onglet 'structure'
	afficher_onglet(jq('#li_structure a'));
	//on remplit la liste déroulante 
	jq("#lst_items").append("<option id='menu_container_lst' value='menu_container'>/</option>");

	//TODO: REMPLACER 'menu' PAR 'recuperer_arborescence()'
	placer_noeuds(jq("#menu_container"),menu);

	//Puis on vide tous les autres containers
	jq("#menu_container_editable").empty();

});


/////////////////////////////////////////
//ENREGISTRER/PUBLIER LES MODIFICATIONS//
/////////////////////////////////////////
jq('.btn_insertion_bd').click(function () {

	//Si on est en mode 'modifications'
	if(jq("#li_modifier").hasClass("active")){
		rendre_non_editable("menu_container_editable");
		inserer(this);
		jq("#menu_container").empty();
		return;
	}

	//TODO: RAJOUTER LES AUTRES MODES

	//Sinon on est en mode 'structure'
	inserer(this);

});


//SELON LE BOUTON ON VA SOIT PUBLIER SOIT ENREGISTRER
function pre_insertion(button){
	if(button.id == "enregistrer"){
		enregistrer_publier(0);
	}
	else{
		if(button.id == "publier")
			enregistrer_publier(1);
	}
}

//FONCTION D'ENREGISTREMENT/PUBLICATION
//publier <---- 0 ; enregistrer <---- 1 ;
function enregistrer_publier(publier){
	var json = arborescence_vers_json(0,"menu_container",publier);
	json = json['items'] ;
	alert(JSON.stringify(json));
	jq.ajax({
		url : 'URL',//donner l'URL de service
		type : 'POST',
		dataType : 'json',
		data : JSON.stringify(json),
		contentType : "application/json; charset=utf-8",
		traditional : true,
		success : function(msg) {
		},
		error : function(msg) {
		},
	});
}




////////////////////////////////////////
//VISUALISER LA STRUCTURE EN READ-ONLY//
////////////////////////////////////////
jq('#li_structure a').click(function (e) {
  e.preventDefault();
  jq(this).tab('show');

});

///////////////////////
//ORGANISER LES ITEMS//
///////////////////////
jq('#li_organiser a').click(function (e) {
  e.preventDefault();
  jq(this).tab('show');

});

///////////////////////
//SUPPRIMER DES ITEMS//
///////////////////////
jq('#li_supprimer a').click(function (e) {
  e.preventDefault();
  jq(this).tab('show');

});

//////////////////////
//MODIFIER DES ITEMS//
//////////////////////
jq('#li_modifier a').click(function (e) {
	

	e.preventDefault();
	jq(this).tab('show');

  	if(jq("#panel_editable").hasClass("hidden")){
	  //on vide le container editable
	  jq("#menu_container_editable").empty();

	  //on le remplit de nouveau
	  rendre_editable("menu_container");

	  //on cache le container de structure
	  jq("#panel_structure").addClass("hidden");

	  //on vide le container de structure
	  jq("#menu_container").empty();

	  //on affiche le container editable
	  jq("#panel_editable").removeClass("hidden");

	  //on set les events
	  maj_lst_items();
	}
});


//ÉVÈNEMENTS À CHAQUE FOIS QUE L'ON CLIQUE SUR UN ONGLET
jq('.options').click(function(){
	if(this.id != "li_modifier"){
		if(!jq("#panel_editable").hasClass("hidden")){
			//on vide le container non-editable
			jq("#menu_container").empty();

			//on le remplit de nouveau
			rendre_non_editable("menu_container_editable");

			//on cache le container editable
			jq("#panel_editable").addClass("hidden");

			//on vide le container editable
			jq("#menu_container_editable").empty();

			//on affiche le container de structure
			jq("#panel_structure").removeClass("hidden");
		}
	}
});


function afficher_onglet(lien){
  	jq(lien).tab('show');
}

//RENDRE EDITABLE LES CHAMPS DE L'ARBORESCENCE
function rendre_editable(id_noeud){
	jq("#" + id_noeud).children(".item").each(function () {
		jq("#" + id_noeud + "_editable").append("<ul id='" + this.id + "_editable' class='breadcrumb item'> <input id='" + this.id +
			"_edited' type='text' class='list-group-item item_edited' value='" + jq("#" + this.id).clone().children().remove().end().text() +
			 "'></input></ul>");
    	rendre_editable(this.id);
	});

}

//RENDRE NON-EDITABLE LES CHAMPS DE L'ARBORESCENCE
function rendre_non_editable(id_noeud){

	var toRemove = '_editable';

	var id_noeud_dest = id_noeud.replace(toRemove,'');
	jq("#" + id_noeud).children(".item").each(function () {

		//On remplace tous les items du panel_structure par ceux du panel_editable
		jq("#" + id_noeud_dest).append("<ul id='" + (this.id).replace(toRemove,'') + "' class='breadcrumb item'>" + 
					jq('#' + (this.id).replace(toRemove,'') + '_edited').val() + "</ul>");

    	rendre_non_editable(this.id);
	});
}


//MISE À JOUR DE LA LISTE DÉROULANTE À CHAQUE MODIFICATION D'UN CHAMP
function maj_lst_items(){
	jq(".item_edited").keyup(function(){ //à chaque fois qu'on écrit un caractère dans un champs
		var toRemove = "_edited";
		jq("#" + this.id.replace(toRemove,'') + "_lst").text(this.value);
	});
}

/////////////////////////////////////////////
//SERIALISER SOUS FORME JSON L'ARBORESCENCE//
/////////////////////////////////////////////
//id_parent : l'id du noeud parent
//id_noeud : l'id du noeud courant
//publie_ : l'arborescence est-elle publiée? 1 si oui, 0 si non
function arborescence_vers_json(id_parent, id_noeud, publie_){
	var json;
	json = { clef : id_noeud , str : jq("#" + id_noeud).clone().children().remove().end().text(), 
			parent : id_parent, ordre : jq("#" + id_noeud).index()
								, version : (vers+1) , langue : "FR", publie : publie_, items : [] };
	
	jq("#" + id_noeud).children(".item").each(function () {
    	json['items'].push(arborescence_vers_json(id_noeud,this.id, publie_));
	});
	return json;
}