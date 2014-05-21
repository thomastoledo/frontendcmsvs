
//////////////////
//PROTOTYPE Item//
//////////////////

function Item(){

	var that = this;

	that.key = jq.now() + Math.random().toString(36).substr(2); //jq.now() + Math.random().toString(36).substr(2)
	that.ordre; //int
	that.parent = null; //Item
	that.children = new Array(); //Array[]
	that.txt; //string
	that.type = "item";
	that.url;
	that.visible = false;
	
	//SETTERS
	that.set_key = function(key){
		that.key = key;
	}

	that.set_ordre = function(ordre){
		that.ordre = ordre;
	}

	that.set_txt = function(txt){
		that.txt = txt;
	}

	that.set_url = function(url){
		that.url = jq.trim(url).replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-');
	}

	that.set_visible = function(visible){
		that.visible = visible
	}


	//GETTERS
	that.get_key = function(){
		return that.key;
	}

	that.get_ordre = function(){
		return that.ordre;
	}

	that.get_parent = function(){
		return that.parent;
	}

	that.get_txt = function(){
		return that.txt;
	}

	that.get_url = function(){
		return that.url;
	}

	that.isVisible = function(){
		return that.visible;
	}

	that.get_nb_children = function(){
		return that.children.length;
	}

	//Actions sur le tableau de children
	that.push = function(item){
		if(!(item instanceof Item) || (that.parent == item))
			return false;

		//On enlève l'item de son ancien parent s'il existe
		if(item.parent != null){
			item.parent.remove_item(item.key);
		}

		that.children.push(item);
		item.parent = that;

		//On met l'ordre de l'item à jour
		item.ordre = that.children.length-1;
		return true;
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

		//Si ce qu'on cherche c'est l'objet lui-même on le retourne
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

	that.last_child = function(){
		return that.children[that.children.length-1];
	}

	//Méthodes diverses

	that.clone = function(){

		var i;
		var it = new Item();

		it.set_txt(that.txt);
		it.parent = that.parent;
		it.set_ordre(that.ordre);
		it.set_key(that.key);

		for(i=0; i<that.children.length; ++i){
			it.children.push(that.children[i]);
		}

		return it;
	}

	that.to_json = function(){
		var i;
		var json = new Object();
		json.key = that.key;
		json.txt = that.txt;
		json.type = that.type;
		json.visible = that.visible;
		json.url = that.url;

		if(that.parent instanceof Item)
			json.parent = that.parent.get_key();
		else
			json.parent = -1;
		json.ordre = that.ordre;
		json.children = [];

		for(i=0; i<that.children.length; ++i){
			json.children.push(that.children[i].to_json());
		}
		return json;
	}

	that.from_json = function(json){
		var it = Item.prototype.create_from_json(json);

		if(it == null){
			return false;
		}

		that.key = it.key;
		that.ordre = it.ordre;
		that.txt = it.txt;
		that.parent = it.parent;
		that.children = it.children;
		that.url = it.url;
		that.visible = it.visible;
	}


	that.empty = function(){
		var i;

		for(i=that.get_nb_children()-1; i>=0; --i){
			that.children[i].empty();
			that.pop();
		}

	}
};

Item.prototype.create_from_json = function(json) {
	var it = new Item();
	var chld;
	var i;

	//TODO : contrôles pour vérifier que l'objet JSON peut bien donner un Item
	if(json == null)
		return null;

	if(json.constructor == String)
		json = JSON.parse(json);
	else{
		if(json.constructor != Object)
			return null;
	}

	it.key = json.key;
	it.ordre = json.ordre;
	it.txt = json.txt;
	it.url = json.url;
	it.visible = json.visible;
	
	if(json.parent == -1)
		it.parent = null;

	for(i=0; i<json.children.length; ++i){
		chld = Item.prototype.create_from_json(json.children[i]);
		if(chld != null){
			it.push(chld);
		}
		else{
			return null;
		}
	}
	return it;
};

