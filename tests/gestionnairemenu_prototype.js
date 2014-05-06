
//////////////////////////////
//PROTOTYPE GestionnaireMenu//
//////////////////////////////

//@brief : sert d'interface entre les éléments du DOM de la page et le Menu



function GestionnaireMenu(){

	var that = this;
	///////////////////////////////////
	//           ATTRIBUTS           //
	///////////////////////////////////
	that.key = jq.now() + Math.random().toString(36).substr(2); //jq.now() + Math.random().toString(36).substr(2)
	that.menu = null; //Menu

	that.container_structure = jq("#menu_container"); //node
	that.container_editable = jq("#menu_container_editable"); //node
	that.container_deletable = jq("#menu_container_deletable"); //node
	that.container_organizable = jq("#menu_organizable"); //node

	that.mode = "structure"; //structure, edit, delete, organize

	that.lst_items = jq("#lst_items"); //node
	that.suff_lst = "_lst"; //suffixe des IDs des items dans la liste

	that.suff_li_editable = "_editable"; //suffixe des IDs des <ul> dans le container_editable
	that.suff_input = "_edited"; //suffixe des IDs des <inputs> dans le container_editable
	that.class_edited = "item_edited"; //nom de la classe qu'ont les inputs dans le container_editable


	that.suff_deletable = "_deletable"; //suffixe des IDs des <ul> dans le container_deletable
	that.suff_deleted = "_deleted"; //suffixe des IDs des <a> dans le container_deletable
	that.class_deleted = "item_deleted"; //nom de la classe qu'ont les <a> dans le container_deletable

	that.suff_organizable = "_organizable"; //suffixe des IDs des <ul> dans le container_organizable
	that.class_organized = "item_organized"; //nom de la classe qu'ont les <ul> dans le container_organizable

	that.panel_structure = jq("#panel_structure"); //node
	that.panel_editable = jq("#panel_editable"); //node
	that.panel_organizable = jq("#panel_organizable"); //node
	that.panel_deletable = jq("#panel_deletable"); //node

	that.button_add = jq("#add_item"); //node
	that.button_cancel = jq("#cancel"); //node
	that.button_save = jq("#save"); //node
	that.button_publish = jq("#publish"); //node
	that.button_clear = jq("#clear"); //node

	that.input_add = jq("#txt_item"); //node

	that.tab_structure = jq('#li_structure a'); //onglet 'structure'
	that.tab_edit = jq('#li_modifier a'); //onglet 'modifier'
	that.tab_organize = jq('#li_organiser a'); //onglet 'structure'
	that.tab_delete = jq('#li_supprimer a'); //onglet 'modifier'




	//////////////////////////////////
	//           METHODES           //
	//////////////////////////////////


	//Ajout d'un item
	that.add_item = function(){
		var txt = that.input_add.val(); //on récupère le titre de l'item
		var previous_it;
		var parent;
		var it;
		var it_parent;
		var previous;

		//Si le texte est vide on ne fait rien
		if(jq.trim(txt) == ""){
			that.input_add.val('');
			that.input_add.focus();
			return;
		}

		//Ajout dans le menu
		parent = that.lst_items.find(":selected").val().replace(that.suff_lst,''); //on récupère le parent

		//Création de l'item
		it = new Item();
		it.set_txt(txt);


		//On récupère l'item qui sera le parent
		it_parent = that.menu.get(parent);

		//Si le parent est null, c'est qu'il s'agit du menu lui-même
		if(it_parent == null){
			it_parent = that.menu;
		}

		//On récupère ensuite le dernier enfant du parent
		//afin de déterminer où insérer la valeur dans la liste déroulante
		previous_it = it_parent.last_child();

		if(previous_it != null){
			previous = previous_it.get_key() + that.suff_lst;
		}
		else{
			if(it_parent == that.menu){
				previous = that.container_structure.attr("id") + that.suff_lst;
			}
			else{
				previous = it_parent.get_key() + that.suff_lst;
			}
		}


		//Si l'insertion échoue dans l'objet Menu du gestionnaire, on sort de la fonction
		if(!(that.menu.push(it, it_parent))){
			return;
		}

		//Ajout dans la liste au bon endroit
		jq("#" + previous)
			.after("<option id='" + it.get_key() + that.suff_lst + "' value='" + it.get_key() + "'>" 
				+ it.get_txt() + "</option>");

		//Ajout dans l'arborescence selon le mode
		switch (that.mode) {
    		case "structure":
    			//Si le parent contient déjà des enfants, on rajoute juste  l'item
    			//sinon on crée une nouvelle liste
    			if(it_parent.get_nb_children() > 1){ //on test > 1 car on a déjà rajouté l'enfant tout à l'heure
    				jq("#" + parent + ">ul").append("<li class='item'  id='" + it.get_key() + "'>" + it.get_txt() + "</li>");
    			}
    			else{
    				jq("#" + parent).append("<ul><li class=' item'  id='" + it.get_key() + "'>" + it.get_txt() + "</li></ul>");
    			}

    			break;
    		case "edit":
    			
    			break;
    		case "delete":
    			break;
    		case "organize":
    			break;
		}

		//On se replace ensuite dans l'input
		that.input_add.select();

	}

	//Suppression d'un item
	that.delete_item = function(){
		
	}

	//Organisation d'un item
	that.organize_item = function(){
		
	}

	//Édition d'un item
	that.edit_item = function(){
		
	}

	//Bouton save
	that.save = function(){
		var date = new Date();
		that.menu.release = date.getFullYear()  + "-" + date.getMonth() + "-" +
			date.getDay() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + "-" + date.getMilliseconds();
		//TODO : variabiliser la langue

		that.menu.lang = "EN";
		var to_send =  JSON.stringify(that.menu.to_json());
		jq.ajax({
			url : 'http://localhost:8080/component/' + that.menu.key,
			type : 'POST',
			dataType : 'json',
			data : to_send,
			contentType : "application/json; charset=utf-8",
			traditional : true,
			success : function(msg) {
				alert("Enregistrement réussi")
			},
			error : function(msg) {
				alert("Erreur lors de l'enregistrement");
			},
		});
	}

	//Bouton cancel
	that.cancel = function(){
		that.clear();
		menu = new Menu();
		that.recup_menu(that.menu);
	}

	//Bouton clear
	that.clear = function(){
		that.container_structure.empty();
		that.container_editable.empty();
		that.container_organizable.empty();
		that.container_deletable.empty();

		that.lst_items.empty();
		that.menu.empty();
	}	



	//Récupérer le menu du backend
	//[in/out] menu : variable de type Menu qui va recevoir le message du backend
	//return : true si la récupération a réussi, false sinon
	that.recup_menu = function(menu){

		jq.ajax({
			url : 'http://localhost:8080/component/en/menu', //récupère le menu publié
			type : 'GET',
			dataType : 'json',
			data : '',
			contentType : "application/json; charset=utf-8",
			traditional : true,
			success : function(msg) {
			 	//Menu.prototype.from_json retourne true en cas de succès
			 	//et false si la récupération a échoué
				menu.from_json(msg);
				//On render le menu en html
				that.render_menu(that.menu);
			},
			error : function(msg) {
			},
		});

	}

	//Render le menu en mode structure
	that.render_menu = function(menu) {

		var i;
		var it;
		var parent;


		for(i=0; i<menu.get_nb_children(); ++i){
			it = menu.get_at(i);

			//On récupère l'ID du parent
			parent = (it.parent != null ? it.parent.key : that.container_structure.attr("id"));

			//Soit on crée une nouvelle liste soit on insère un nouvel élément
			if(it.get_ordre() == 0){
				jq("#" + parent).append("<ul><li class='item'  id='" + it.get_key() + "'>" + it.get_txt() + "</li></ul>");
			}
			else{
				jq("#" + parent + " >ul").append("<li class='item'  id='" + it.get_key() + "'>" + it.get_txt() + "</li>");
			}
			//On fait le même traitement pour les enfants
			that.render_menu(it);

		}

	};

	//Render le menu en mode edit
	that.render_edit = function(menu) {

		var i;
		var it;
		var parent;


		for(i=0; i<menu.get_nb_children(); ++i){
			it = menu.get_at(i);

			//On récupère l'ID du parent
			parent = (it.parent != null ? (it.parent.key + that.suff_li_editable) : that.container_editable.attr("id"));

			//Soit on crée une nouvelle liste soit on insère un nouvel élément
			if(it.get_ordre() == 0){
				jq("#" + parent).append("<ul><li class='item'  id='" + it.get_key() + that.suff_li_editable + "'><input id='" + it.get_key() + that.suff_input + 
					" type='text' class='list-group-item item_edited' value='" + it.get_txt() + "'></input></li></ul>");
			}
			else{
				jq("#" + parent + " >ul").append("<li class='item'  id='" + it.get_key() + that.suff_li_editable + "'><input id='" + it.get_key() + that.suff_input +
						 " type='text' class='list-group-item item_edited' value='" + it.get_txt() + "'></input></li>");
			}
			//On fait le même traitement pour les enfants
			that.render_edit(it);
			
		}
	};

	//Charger le menu
	//On charge par défaut le dernier menu de la langue sur laquelle l'utilisateur travaillait
	that.load = function(langue){

		that.lst_items.append("<option id='" + that.container_structure.attr('id') 
			+ that.suff_lst + "' value='" + that.container_structure.attr('id') + "'>/</option>");

		//On crée le menu
		that.menu = new Menu();
		that.recup_menu(that.menu);
	}


	////////////////////////////////////////
	//VISUALISER LA STRUCTURE EN READ-ONLY//
	////////////////////////////////////////
	that.tab_structure.click(function (e) {
	  that.mode = "structure";
	  e.preventDefault();
	  jq(this).tab('show');

	});

	///////////////////////
	//ORGANISER LES ITEMS//
	///////////////////////
	that.tab_organize.click(function (e) {
	  that.mode = "organize";
	  e.preventDefault();
	  jq(this).tab('show');
	});

	///////////////////////
	//SUPPRIMER DES ITEMS//
	///////////////////////
	that.tab_delete.click(function (e) {
	  that.mode = "delete";
	  e.preventDefault();
	  jq(this).tab('show');

	});

	//////////////////////
	//MODIFIER DES ITEMS//
	//////////////////////
	that.tab_edit.click(function (e) {
		
		that.mode = "edit";
		e.preventDefault();
		jq(this).tab('show');

		//On vide les containers
		that.container_structure.empty();
		that.container_deletable.empty();
		that.container_organizable.empty();

		//On cache les autres panels
		that.panel_organizable.addClass("hidden");
		that.panel_deletable.addClass("hidden");
		that.panel_structure.addClass("hidden");

		//On montre le panel qu'il faut
		that.panel_organisable.removeClass("hidden");
		that.render_edit(that.menu);

	});


	//ÉVÈNEMENTS À CHAQUE FOIS QUE L'ON CLIQUE SUR UN ONGLET
	jq('.options').click(function(){

	});


	//ENREGISTRER LE MENU EN BD
	that.button_save.click(function (e){
		that.menu.published = false;
		that.save();
	});

	//CLEAR LE MENU <=> VIDER LE MENU
	that.button_clear.click(function (e){
		that.clear();
		that.lst_items.append("<option id='" + that.container_structure.attr('id') 
			+ that.suff_lst + "' value='" + that.container_structure.attr('id') + "'>/</option>");
	});

	//PUBLIER LE MENU
	that.button_publish.click(function (e){
		that.menu.published = true;
		that.save();
	});

	//ANNULER TOUTE SAISIE
	that.button_cancel.click(function (e){
		that.cancel();
		that.lst_items.append("<option id='" + that.container_structure.attr('id') 
			+ that.suff_lst + "' value='" + that.container_structure.attr('id') + "'>/</option>");
	});


	//Quand on clique sur le bouton ou que l'on presse "entrée" quand on est dans l'input
	//on déclenche l'ajout d'un item
	that.button_add.click(function(){
		that.add_item();
	});

	that.input_add.keydown(function(event){
		//alert(event.which);
		if(event.which == '13'){
			that.add_item();
			return false; //on empêche le refresh de la page par l'event submit
		}
	});
};

