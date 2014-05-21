
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

	that.mode = "structure"; //structure, configure


	that.tab_structure = jq('#li_structure a'); //onglet 'structure'
	that.tab_settings = jq('#li_settings a'); //onglet 'settings'


	//NAVBAR SUPERIEURE
	that.button_add = jq("#add_item"); //ajout d'un item
	that.input_add = jq("#txt_item"); //nom de l'item à ajouter
	that.lst_items = jq("#lst_items"); //liste des items
	that.suff_lst = "_lst"; //suffixe des IDs des items dans la liste
	that.button_cancel = jq("#cancel"); //annuler toutes les saisies
	that.button_save = jq("#save"); //enregistrer les saisies
	that.button_publish = jq("#publish"); //publier les saisies


	//PANEL STRUCTURE
	that.container_structure = jq("#menu_container"); //arborescence des items
	that.panel_structure = jq("#panel_structure"); //node


	//PANEL SETTINGS
	that.panel_settings = jq("#panel_settings"); //node
	that.container_settings = jq("#settings"); //div contenant l'interface ==> div
	that.lst_items_settings = jq("#lst_items_settings"); //Choix de l'item ==> select
	that.txt_title = jq("#txt_title"); //Titre de l'item ==> input
	that.lst_parents = jq("#lst_parents"); //Liste des parents disponibles ==> select
	that.item_parent = jq("#parent_to_edit"); //Parent à afficher ==> span
	that.items_children = jq("#children > tbody"); //Tableau des enfants de la page ==> table
	that.submit_config = jq("#submit_config"); //Valider la config ==> button
	that.cancel_config = jq("#cancel_config"); //Reset la config ==> button
	that.show_item = jq("#show_item"); //La page est visible dans le menu ==> checkbox
	that.edit_parent = jq("#edit_parent"); //Configurer le parent ===> button
	that.txt_url = jq("#txt_url"); //L'URL de la page ===> input
	that.suff_lst_settings = "_lst_settings";
	that.span_url = jq("#span_url");
	that.suff_lst_parents = "_lst_parents";
	that.suff_table_children = "_table_children";

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
		it.set_url(txt);

		//On récupère l'item qui sera le parent
		it_parent = that.menu.get(parent);

		//On récupère ensuite le dernier enfant du parent
		//afin de déterminer où insérer la valeur dans la liste déroulante
		previous_it = it_parent;

		while(previous_it.get_nb_children() != 0){
			previous_it = previous_it.last_child();
		}


		if(previous_it != null){
			previous = previous_it.get_key();
		}
		else{
			previous = it_parent.get_key() ;
		}


		//Si l'insertion échoue dans l'objet Menu du gestionnaire, on sort de la fonction
		if(!(that.menu.push(it, it_parent))){
			return;
		}

		//Ajout dans les listes au bon endroit
		jq("#" + previous + that.suff_lst)
			.after("<option id='" + it.get_key() + that.suff_lst + "' value='" + it.get_key() + "'>" 
				+ it.get_txt() + "</option>");
		jq("#" + previous + that.suff_lst_settings)
			.after("<option id='" + it.get_key() + that.suff_lst_settings + "' value='" + it.get_key() + "'>" 
				+ it.get_txt() + "</option>");

		that.lst_items_settings.trigger("change");

		//Si le parent contient déjà des enfants, on rajoute juste  l'item
		//sinon on crée une nouvelle liste
		if(it_parent.get_nb_children() > 1){ //on test > 1 car on a déjà rajouté l'enfant tout à l'heure
			jq("#" + parent + ">ul").append("<li class = 'item'  id='" + it.get_key() + "'><a href='http://www.virtualsensitive.com/en/"
				+  it.get_url() + "' target='_blank'>" + it.get_txt() + "</a></li>");
		}
		else{
			jq("#" + parent).append("<ul><li class = ' item'  id='" + it.get_key() + "'><a href='http://www.virtualsensitive.com/en/" 
				+  it.get_url() + "' target='_blank'>" + it.get_txt() + "</a></li></ul>");
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
	that.save = function(menu){
		var date = new Date();
		var pages;
		var i = 0;

		menu.release = date.getFullYear()  + "-" + date.getMonth() + "-" +
			date.getDay() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + "-" + date.getMilliseconds();
		

		//Récupérer toutes les pages du Menu
		//pages = that.pages_of_menu(that.menu);
		//Delete chaque page de la BD
		//Modifier l'URL de chaque page
		//Enregistrer chaque nouvelle page.

		//TODO : variabiliser la langue
		menu.lang = "en";
		var to_send =  JSON.stringify(menu.to_json());
		jq.ajax({
			url : 'http://localhost:8080/component/' + menu.key,
			type : 'POST',
			dataType : 'text',
			data : to_send,
			contentType : "application/json; charset=utf-8",
			traditional : true,
			success : function(msg) {
				console.log("Enregistrement réussi")
			},
			error : function(msg) {
				console.log("Erreur lors de l'enregistrement");
			},
		});
	}

	//Bouton cancel
	that.cancel = function(){
		that.clear();
		menu = new Menu();
		that.recup_menu(that.menu);
		that.render_menu(menu);
	}

	//Bouton clear
	that.clear = function(){

		//Vider l'arborescence
		that.container_structure.empty();

		//Vider la liste
		that.lst_items.empty();

		//Vider le menu
		that.menu.empty();

		//Vider le panneau de configuration
		that.empty_settings_panel();
	}	

	that.empty_settings_panel = function(){
		that.lst_items_settings.empty();
		that.txt_title.val("");
		that.lst_parents.empty();
		that.item_parent.val("");
		that.items_children.empty();
		that.show_item.attr('checked', false);
		that.txt_url.val("");
	}

	//Récupérer le menu du backend
	//[in/out] menu : variable de type Menu qui va recevoir le message du backend
	that.recup_menu = function(menu){
	 	//Menu.prototype.from_json retourne true en cas de succès
	 	//et false si la récupération a échoué
		menu.from_json(
			jq.ajax({
				url : 'http://localhost:8080/component/en/menu', //récupère le menu publié
				type : 'GET',
				dataType : 'text',
				data : '',
				contentType : "application/json; charset=utf-8",
				traditional : true,
				success : function(msg) {

				},
				error : function(msg) {
				},
				async : false
			}).responseText);

	}

	//Render le menu en mode structure
	that.render_menu = function(menu) {

		var i;
		var it;
		var parent;


		for(i=0; i<menu.get_nb_children(); ++i){
			it = menu.get_at(i);

			//On récupère l'ID du parent
			//parent = (it.parent != null ? it.parent.key : that.container_structure.attr("id"));
			parent = it.parent.get_key();
			//Soit on crée une nouvelle liste soit on insère un nouvel élément
			if(it.get_ordre() == 0){
				jq("#" + parent).append("<ul><li class = ' item'  id='" + it.get_key() + "'><a href='http://www.virtualsensitive.com/en/" 
    				+  it.get_url() + "' target='_blank'>" + it.get_txt() + "</a></li></ul>");

			}
			else{
				jq("#" + parent + ">ul").append("<li class = 'item'  id='" + it.get_key() + "'><a href='http://www.virtualsensitive.com/en/"
    					+  it.get_url() + "' target='_blank'>" + it.get_txt() + "</a></li>");
			}
			//Ajout dans la liste au bon endroit
			jq("#" + parent + that.suff_lst).after("<option id='" + it.get_key() + that.suff_lst + "' value='" + it.get_key() + "'>" 
				+ it.get_txt() + "</option>");
			//On fait le même traitement pour les enfants
			that.render_menu(it);

		}

	};	


	//Charger le menu
	//On charge par défaut le dernier menu de la langue sur laquelle l'utilisateur travaillait
	that.load = function(langue){

		//On crée le menu
		that.menu = new Menu();
		that.recup_menu(that.menu);
		that.container_structure.attr('id',that.menu.get_key());

		that.lst_items.append("<option id='" + that.menu.get_key()
			+ that.suff_lst + "' value='" + that.menu.get_key() + "'>/</option>");

		//On render le menu en html
		that.render_menu(that.menu);
	}


	////////////////////////////////////////
	//VISUALISER LA STRUCTURE EN READ-ONLY//
	////////////////////////////////////////
	that.tab_structure.click(function (e) {
	  that.mode = "structure";
	  e.preventDefault();
	  jq(this).tab('show');

	  //On cache le panel de configuration et on montre l'arborescence
	  that.panel_structure.removeClass("hidden");
	  that.panel_settings.addClass("hidden");

	});

	///////////////////////
	//ORGANISER LES ITEMS//
	///////////////////////
	that.tab_settings.click(function (e) {
		var i;
		that.mode = "settings";
		e.preventDefault();
		jq(this).tab('show');

		//On cache l'arborescence et on montre l'interface de configuration
		that.panel_settings.removeClass("hidden");
		that.panel_structure.addClass("hidden");

		//On remplit la liste des items si besoin est
		if(jq("#lst_items_settings option").size() == 0 ){
			that.fill_lst_items_settings(that.menu);
			that.lst_items_settings.trigger("change");
		}

	});

	that.fill_lst_items_settings = function(racine){
		var i;
		for(i=0; i<racine.get_nb_children(); ++i){
			that.lst_items_settings.append("<option id='" + racine.get_at(i).get_key() 
			+ that.suff_lst_settings + "' value='" + racine.get_at(i).get_key() + "'>" +
			 racine.get_at(i).get_txt() + "</option>");
			that.fill_lst_items_settings(racine.get_at(i));
		}
	}

	//ENREGISTRER LE MENU EN BD
	that.button_save.click(function (e){
		that.menu.key = jq.now() + Math.random().toString(36).substr(2);
		that.menu.published = false;
		that.save(that.menu);
	});


	//PUBLIER LE MENU
	that.button_publish.click(function (e){
		var menu_published = new Menu();

		that.recup_menu(menu_published);
		menu_published.published = false;
		that.save(menu_published);


		that.menu.key = jq.now() + Math.random().toString(36).substr(2);
		that.menu.published = true;
		that.save(that.menu);
	});

	//ANNULER TOUTE SAISIE
	that.button_cancel.click(function (e){
		that.cancel();
		that.lst_items.append("<option id='" + that.menu.get_key()
			+ that.suff_lst + "' value='" + that.menu.get_key() + "'>/</option>");
	});


	//Quand on clique sur le bouton ou que l'on presse "entrée" quand on est dans l'input
	//on déclenche l'ajout d'un item
	that.button_add.click(function(){
		that.add_item();
	});

	that.input_add.keydown(function(event){
		if(!event.ctrlKey){
			if(event.which == '13'){
				that.button_add.click();
				return false; //on empêche le refresh de la page par l'event submit
			}

			if(event.which >= '65' && event.which <= '90'){
				if(that.input_add.val().length > 80){
					return false;
				}
			}
		}
		return true;
	});

	//Quand on fait une modification dans le panel de configuration,
	//on rajoute une étoile pour montrer à l'utilisateur qu'une modification doit être validée

	that.txt_title.keypress(function(event){
		if(!event.ctrlKey){
			if(that.tab_settings.text()[that.tab_settings.text().length -1] != "*"){
				that.tab_settings.text(that.tab_settings.text() + " *");
			}
			if(event.which == '13'){
				that.button_save.click();
				return false; //on empêche le refresh de la page par l'event submit
			}

			if(event.which >= '65' && event.which <= '90'){
				if(that.input_add.val().length > 80){
					return false;
				}
			}
		}
		return true;
	});

	that.txt_url.keypress(function(event){
		if(!event.ctrlKey){
			if(that.tab_settings.text()[that.tab_settings.text().length -1] != "*"){
				that.tab_settings.text(that.tab_settings.text() + " *");
			}
			if(event.which == '13'){
				that.button_save.click();
				return false; //on empêche le refresh de la page par l'event submit
			}

			if(event.which >= '65' && event.which <= '90'){
				if(that.input_add.val().length > 80){
					return false;
				}
			}
		}
		return true;
	});

	that.txt_url.keyup(function(event){
		that.span_url.text(that.txt_url.val());
	});

	that.show_item.change(function(){
		if(that.tab_settings.text()[that.tab_settings.text().length -1] != "*"){
			that.tab_settings.text(that.tab_settings.text() + " *");
		}
	});

	that.lst_parents.change(function(){
		if(that.tab_settings.text()[that.tab_settings.text().length -1] != "*"){
			that.tab_settings.text(that.tab_settings.text() + " *");
		}
	});

	that.cancel_config.click(function(){
		that.tab_settings.text("Configurer");
	});

	that.submit_config.click(function(){
		var txt = that.txt_title.val();
		var url = that.txt_url.val()
		if(jq.trim(txt) == ""){
			that.txt_title.val('');
			that.txt_title.focus();
			return;
		}
		if(jq.trim(url) == ""){
			that.txt_url.val('');
			that.txt_url.focus();
			return;
		}
		that.tab_settings.text("Configurer");
		//Puis on valide les modifications

		//On récupère l'id
		var id = that.lst_items_settings.find(":selected").val().replace(that.suff_lst_settings,'');
		//on récupère l'item
		var item = that.menu.get(id);

		//On set les nouvelles valeurs
		item.set_txt(that.txt_title.val());
		item.set_url(that.txt_url.val());
		item.set_visible(that.show_item.checked);

		//On met à jour le nouveau parent
		var id_parent = that.lst_parents.find(":selected").val().replace(that.suff_lst_parents,'');
		var it_parent = that.menu.get(id_parent);

		//Mise à jour de l'arborescence et de la liste de navigation
		if(it_parent != item.get_parent()){
			that.apply_parent_change(item, it_parent);
		}

		jq("#" + id + that.suff_lst).text(item.get_txt());
		jq("#" + id).html("<a href='http://www.virtualsensitive.com/en/"
				+  item.get_url() + "' target='_blank'>" + item.get_txt() + "</a>");

		//On recharge met à jour la liste des settings et on recharge
		that.lst_items_settings.find(":selected").text(item.get_txt());

		that.lst_items_settings.trigger("change");
		
	});

	that.apply_parent_change = function(item, parent){
		var i;

		//Suppression dans l'arborescence
		jq("#" + item.get_key()).remove();
		//Suppression dans la liste d'items avec les enfants correspondants
		jq("#" + item.get_key() + that.suff_lst).remove();
		for(i=0; i<item.get_nb_children(); ++i){
			jq("#" + item.get_at(i).get_key() + that.suff_lst).remove();
		}

		//Réinsertion au bon endroit dans l'arborescence et la liste d'items
		that.insert_partition(parent, item);

		parent.push(item);

	}

	//Insérer un bout du menu à un endroit dans l'arborescence
	//root : l'item qui deviendra parent
	//partition : l'item qui est considéré comme la partition
	that.insert_partition = function(root, partition){
		var i;
		//Si le parent contient déjà des enfants, on rajoute juste  l'item
		//sinon on crée une nouvelle liste
		if(root.get_nb_children() > 0){
			jq("#" + root.get_key() + ">ul").append("<li class = 'item'  id='" + partition.get_key() 
				+ "'><a href='http://www.virtualsensitive.com/en/"
				+  partition.get_url() + "' target='_blank'>" + partition.get_txt() + "</a></li>");
		}
		else{
			jq("#" + root.get_key()).append("<ul><li class = ' item'  id='" + partition.get_key() 
				+ "'><a href='http://www.virtualsensitive.com/en/" 
				+  partition.get_url() + "' target='_blank'>" + partition.get_txt() + "</a></li></ul>");
		}

		jq("#" + root.get_key() + that.suff_lst).after("<option id='" + partition.get_key()
				+ that.suff_lst + "' value='" + partition.get_key() + "'>" 
				+ partition.get_txt() + "</option>");
		
		for(i=0; i<partition.get_nb_children(); ++i){
			that.insert_partition(partition, partition.get_at(i));
		}
	}

	that.lst_items_settings.change(function(){


		//On vide tout
		that.txt_title.val(""); //Titre de l'item ==> input
		that.lst_parents.empty(); //Liste des parents disponibles ==> select
		that.txt_url.val(""); //L'URL de la page ===> input
		that.span_url.text("");
		that.items_children.empty();
		that.item_parent.text("");

		//On récupère l'ID de l'item sélectionné
		var id = jq(this).find(":selected").val();
		var item;
		var i;
		if(id == null){
			that.txt_title.prop('disabled',true); //Titre de l'item ==> input
			that.lst_parents.prop('disabled',true); //Liste des parents disponibles ==> select
			that.submit_config.prop('disabled',true); //Valider la config ==> button
			that.cancel_config.prop('disabled',true); //Reset la config ==> button
			that.show_item.prop('disabled',true); //La page est visible dans le menu ==> checkbox
			that.edit_parent.prop('disabled',true); //Configurer le parent ===> button
			that.txt_url.prop('disabled',true); //L'URL de la page ===> input
		}
		else{

			id = id.replace(that.suff_lst_settings,'');
			item = that.menu.get(id);

			that.txt_title.prop('disabled',false); //Titre de l'item ==> input

			if(item.get_parent() != that.menu){
				that.edit_parent.prop('disabled',false); //Configurer le parent ===> button
			}else{
				that.edit_parent.prop('disabled',true); //Configurer le parent ===> button
			}
			that.submit_config.prop('disabled',false); //Valider la config ==> button
			that.cancel_config.prop('disabled',false); //Reset la config ==> button
			that.show_item.prop('disabled',false); //La page est visible dans le menu ==> checkbox

			that.lst_parents.prop('disabled',false); //Liste des parents disponibles ==> select
			that.txt_url.prop('disabled',false); //L'URL de la page ===> input



			that.txt_title.val(item.get_txt()); //Titre de l'item ==> input

			//Remplir la liste des parents potentiels et sélectionner le parent actuel
			that.lst_parents.append("<option id='" + that.menu.get_key()
				+ that.suff_lst_parents + "' value='" + that.menu.get_key() + "'>/</option>");
			that.fill_lst_items_parents(that.menu, item);

			if(item.get_parent() != that.menu){
				that.item_parent.text(item.get_parent().get_txt()); //Parent à afficher ==> span
			}

			for(i=0; i<item.get_nb_children(); ++i){
				that.items_children.append("<tr><td id=\"" + 
					item.get_at(i).get_key() + that.suff_table_children +"\">" 
					+ item.get_at(i).get_txt() + "</td></tr>");
			}
			
			that.show_item.prop('checked', item.visible); //La page est visible dans le menu ==> checkbox
			that.txt_url.val(item.get_url()); //L'URL de la page ===> input
			that.span_url.text(item.get_url());
		}
	});

	that.fill_lst_items_parents = function(racine, item){
		var i;
		for(i=0; i<racine.get_nb_children(); i++){
			if(racine.get_at(i).get_key() != item.get_key()){
				that.lst_parents.append("<option id='" + racine.get_at(i).get_key()
				+ that.suff_lst_parents + "' value='" + racine.get_at(i).get_key() + "'>" + racine.get_at(i).get_txt() + "</option>");
				that.fill_lst_items_parents(racine.get_at(i), item);
			}
		}
	}

};

