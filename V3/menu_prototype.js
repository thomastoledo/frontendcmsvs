
//////////////////
//PROTOTYPE Menu//
//////////////////

function Menu(){

	var that = this;

	that.key = jq.now() + Math.random().toString(36).substr(2); //jq.now() + Math.random().toString(36).substr(2)
	that.url; //string
	that.release; //string
	that.published = false; //bool
	that.lang; //string
	that.children = new Array(); //Array[]
	that.last_edit; //date
	that.type = "menu"; //le type Menu

	//SETTERS
	that.set_key = function(key){
		that.key = key;
	}

	that.set_url = function(url){
		that.url = url;
	}

	that.set_release = function(release){
		that.release = release;
	}

	that.set_published = function(published){
		that.published = published;
	}

	that.set_lang = function(lang) {
		that.lang = lang;
	}

	that.set_last_edit = function(last_edit){
		that.last_edit = last_edit;
	}

	//GETTERS
	that.get_key = function(){
		return that.key;
	}

	that.get_url = function(){
		return that.url;
	}

	that.get_release = function(){
		return that.release;
	}

	that.get_published = function(){
		return that.published;
	}

	that.get_lang = function(){
		return that.lang;
	}

	that.get_last_edit = function(){
		return that.last_edit;
	}

	that.get_nb_children = function(){
		return that.children.length;
	}

	//Actions sur le tableau de children
	that.push = function(item, parent){

		var par;
		var res = false;
		//Si item n'est pas de type Item
		if(!(item instanceof Item))
			return res;


		//Si le parent est undefined, on considère que c'est le menu
		if(typeof parent == "undefined"){
			parent = that;
		}

		//Si l'item a déjà un parent qui est le même que "parent"
		//on n'a pas besoin d'effectuer d'insertion
		if(item.get_parent() == parent){
			res = true;
			return res;
		}

		//Ensuite il faut le supprimer de son parent courant
		if(item.get_parent() != null){
			item.get_parent().remove_item(item);
		}

		//si le parent est null, l'item est à la racine
		if((parent == null) || (parent == that)){
			that.children.push(item);
			item.parent = that;
			//On met l'ordre de l'item à jour
			item.ordre = that.children.length-1;
			res = true;
		}else{
			//Si le parent n'est pas null, il faut que ce soit une instance d'Item
			if(parent instanceof Item){

				parent.push(item);
				//On met l'ordre de l'item à jour
				item.ordre = that.children.length-1;
				res = true;

			}else{ //Sinon le parent est peut-être une clé
				//on essaye de récupérer l'item
				par = that.get(parent);
				if(par != null){
					par.push(item);
					res = true;
				}
			}
		}

		return res;

	}

	that.remove_item = function(key){
		var i;
		for(i=0; i<that.get_nb_children() && that.get_at(i).key != key; ++i);
		for(;i<that.get_nb_children()-1; ++i){
			that.children[i] = that.children[i+1];
		}
		that.pop();
	}

	that.pop = function(){
		return that.children.pop();
	}

	that.get = function(key){
		var i = 0;
		var k = null;

		if(that.key == key)
			return that;
		
		//Pour tout enfant
		for(; i < that.children.length; i++){

			//Si l'enfant[i] a la clé on le retourne
			if(that.children[i].key == key){
				return that.children[i];
			}
			else{ //Sinon on cherche parmi les petits children
				if( (k = that.children[i].get(key)) != null){
					return k;
				}
			}
		}
		//Si à la fin de la boucle on a rien trouvé, on renvoit null
		return null;
	}

	that.get_at = function(index){
		if(index<0 || index >= that.children.length)
			return null;

		return that.children[index];
	}
	
	that.last_child= function(){
		return that.children[that.children.length-1];
	}

	//Méthodes diverses

	that.clone = function(){

		var i;
		var menu = new menu();

		menu.set_key(that.key);
		menu.set_url(that.url);
		menu.set_release(that.release);
		menu.set_published(that.published);
		menu.set_lang(that.lang);
		for(i=0; i<that.children.length; ++i){
			menu.children.push(that.children[i]);
		}

		return menu;
	}

	that.to_json = function(){
		var i;
		var json = new Object();
		json.key = that.key;
		json.url = that.url;
		json.release = that.release;
		json.published = that.published;
		json.lang = that.lang;
		json.type = that.type;

		json.children = [];

		for(i=0; i<that.children.length; ++i){
			json.children.push(that.children[i].to_json());
		}
		return json;
	}

	that.from_json = function(json){
		var menu = Menu.prototype.create_from_json(json);

		if(menu == null)
			return false;
		that.key = menu.key;	
		that.url = menu.url;
		that.release = menu.release;
		that.published = menu.published;
		that.lang = menu.lang;
		that.children = menu.children;
		return true;
	}


	that.empty = function(){
		var i;
		for(i=that.get_nb_children()-1; i>=0; --i){
			that.children[i].empty();
			that.pop();
		}
	}
};

Menu.prototype.create_from_json = function(json) {
	var menu = new Menu();
	var item;
	var i;

	//TODO : contrôles pour vérifier que l'objet JSON peut bien donner un Menu
	if(json == null)
		return null;

	if(json.constructor == String)
		json = JSON.parse(json);
	else{
		if(json.constructor != Object)
			return null;
	}

	menu.key = json.key;
	menu.url = json.url;
	menu.release = json.release;
	menu.published = json.published;
	menu.lang = json.lang;


	for(i=0; i<json.children.length; ++i){
		item = Item.prototype.create_from_json(json.children[i]);

		if(item == null){
			return null;
		}
		else{
			menu.push(item);
		}
	}
	return menu;
};

