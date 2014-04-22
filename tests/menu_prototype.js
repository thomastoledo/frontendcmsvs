
//////////////////
//PROTOTYPE Menu//
//////////////////

function Menu(){
	this.key = jq.now() + Math.random().toString(36).substr(2); //jq.now() + Math.random().toString(36).substr(2)
	this.url; //string
	this.release; //string
	this.published = false; //bool
	this.language; //string
	this.items = new Array(); //Array[]
	this.last_edit; //date

	//SETTERS
	this.set_key = function(key){
		this.key = key;
	}

	this.set_url = function(url){
		this.url = url;
	}

	this.set_release = function(release){
		this.release = release;
	}

	this.set_published = function(published){
		this.published = published;
	}

	this.set_language = function(language) {
		this.language = language;
	}

	this.set_last_edit = function(last_edit){
		this.last_edit = last_edit;
	}

	//GETTERS
	this.get_key = function(){
		return this.key;
	}

	this.get_url = function(){
		return this.url;
	}

	this.get_release = function(){
		return this.release;
	}

	this.get_published = function(){
		return this.published;
	}

	this.get_language = function(){
		return this.language;
	}

	this.get_last_edit = function(){
		return this.last_edit;
	}

	this.get_nb_items = function(){
		return this.items.length;
	}

	//Actions sur le tableau de children
	this.push = function(item, parent){

		//Si item n'est pas de type Item
		if(!(item instanceof Item))
			return;

		//si le parent est null, l'item est à la racine
		if(parent == null){
			this.items.push(item);
			item.parent = null;
			//On met l'ordre de l'item à jour
			item.ordre = this.items.length-1;
		}else{
			//Si le parent n'est pas null, il faut que ce soit une instance d'Item
			if(parent instanceof Item){
				parent.push(item);
				//On met l'ordre de l'item à jour
				item.ordre = this.items.length-1;
			}else{ //Sinon on sort de la fonction, le push ne réussit pas
				return;
			}
		}


	}

	this.pop = function(){
		return this.items.pop();
	}

	this.get = function(key){
		var i = 0;
		var k = null;

		//Pour tout enfant
		for(; i < this.items.length; i++){

			//Si l'enfant[i] a la clé on le retourne
			if(this.items[i].key == key){
				return this.items[i];
			}
			else{ //Sinon on cherche parmi les petits children
				if( (k = this.items[i].get(key)) != null){
					return k;
				}
			}
		}
		//Si à la fin de la boucle on a rien trouvé, on renvoit null
		return null;
	}


	//Méthodes diverses

	this.clone = function(){

		var i;
		var menu = new menu();

		menu.set_key(this.key);
		menu.set_url(this.url);
		menu.set_release(this.release);
		menu.set_published(this.published);
		menu.set_language(this.language);
		for(i=0; i<this.items.length; ++i){
			menu.items.push(this.items[i]);
		}

		return menu;
	}

	this.to_json = function(){
		var i;
		var json = new Object();
		json.key = this.key;
		json.url = this.url;
		json.release = this.release;
		json.published = this.published;
		json.language = this.language;

		json.items = [];

		for(i=0; i<this.items.length; ++i){
			json.items.push(this.items[i].to_json());
		}
		return json;
	}

	this.from_json = function(json){
		var menu = Menu.prototype.create_from_json(json);
		this.key = menu.key;
		this.url = menu.url;
		this.release = menu.release;
		this.published = menu.published;
		this.language = menu.language;
		this.items = menu.items;
	}
};

Menu.prototype.create_from_json = function(json) {
	var menu = new Menu();
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
	menu.language = json.language;


	for(i=0; i<json.items.length; ++i){
		menu.push(Item.prototype.create_from_json(json.items[i]));
	}
	return menu;
};

