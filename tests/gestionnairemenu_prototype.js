
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
	that.menu; //Menu

	that.container_structure = jq("#menu_container"); //node
	that.container_editable = jq("#menu_container_editable"); //node
	that.container_deletable = jq("#menu_container_deletable"); //node
	that.container_organizable = jq("#menu_organizable"); //node

	that.mode = "structure"; //structure, edit, delete, organize

	that.lst_items = jq("#lst_items"); //node
	that.suff_lst = "_lst"; //suffixe des IDs des items dans la liste

	that.suff_editable = "_editable"; //suffixe des IDs des <ul> dans le container_editable
	that.suff_edited = "_edited"; //suffixe des IDs des <inputs> dans le container_editable
	that.class_edited = "item_edited"; //nom de la classe qu'ont les inputs dans le container_editable


	that.suff_deletable = "_deletable"; //suffixe des IDs des <ul> dans le container_deletable
	that.suff_deleted = "_deleted"; //suffixe des IDs des <a> dans le container_deletable
	that.class_deleted = "item_deleted"; //nom de la classe qu'ont les <a> dans le container_deletable

	that.suff_organizable = "_organizable"; //suffixe des IDs des <ul> dans le container_organisable
	that.class_organized = "item_organized"; //nom de la classe qu'ont les <ul> dans le container_organisable

	that.panel_structure = jq("#panel_structure"); //node
	that.panel_editable = jq("#panel_editable"); //node
	that.panel_organizable = jq("#panel_organisable"); //node
	that.panel_deletable = jq("#panel_deletable"); //node

	that.button_add = jq("#add_item"); //node
	that.button_cancel = jq("#cancel"); //node
	that.button_save = jq("#save"); //node
	that.button_publish = jq("#publish"); //node
	that.button_clear = jq("#clear"); //node

	that.input_add = jq("#txt_item"); //node



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

	}

	//Bouton cancel
	that.cancel = function(){

	}

	//Bouton publish
	that.publish = function(){

	}

	//Bouton clear
	that.clear = function(){

	}

	//Charger le menu
	//On charge par défaut le dernier menu de la langue sur laquelle l'utilisateur travaillait
	that.load = function(langue){

		that.lst_items.
			append("<option id='" + that.container_structure.attr('id') 
				+ that.suff_lst + "' value='" + that.container_structure.attr('id') + "'>/</option>");

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

		//On crée le menu
		that.menu = new Menu();
		//TODO : récupérer le menu avec le backend
	}

};

