
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
	that.button_add.click(function(){
		that.add_item();
	});

	that.add_item(){
		var txt = that.txt_item.val(); //on récupère le titre de l'item

		//Si le texte est vide on ne fait rien
		if(jq.trim(txt) == ""){
			that.txt_item.focus();
			return;
		}

		//Ajout dans le menu
		var parent = that.lst_items.find(":selected").val(); //on récupère le parent

		var it = new Item();
		var it_parent = this.menu.get(parent);

		it.set_txt(txt);

		that.menu.push(it,it_parent);


		//Ajout dans la liste au bon endroit

		//Ajout dans chaque container


	}

	//Suppression d'un item
	that.delete_item(){
		
	}

	//Organisation d'un item
	that.organize_item(){
		
	}

	//Édition d'un item
	that.edit_item(){
		
	}

	//Bouton save
	that.save(){

	}

	//Bouton cancel
	that.cancel(){

	}

	//Bouton publish
	that.publish(){

	}

	//Bouton clear
	that.clear(){

	}

	//Charger le menu
	//On charge par défaut le dernier menu de la langue sur laquelle l'utilisateur travaillait
	that.load_menu(langue){

	}

};

