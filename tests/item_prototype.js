
//////////////////
//PROTOTYPE Item//
//////////////////

function Item(){
	this.key = jq.now() + Math.random().toString(36).substr(2); //jq.now() + Math.random().toString(36).substr(2)
	this.ordre; //int
	this.parent = null; //Item
	this.children = new Array(); //Array[]
	this.txt; //string

	//SETTERS
	this.set_key = function(key){
		this.key = key;
	}

	this.set_ordre = function(ordre){
		this.ordre = ordre;
	}

	this.set_txt = function(txt){
		this.txt = txt;
	}




	//GETTERS
	this.get_key = function(){
		return this.key;
	}

	this.get_ordre = function(){
		return this.ordre;
	}

	this.get_parent = function(){
		return this.parent;
	}

	this.get_txt = function(){
		return this.txt;
	}

	this.get_nb_children = function(){
		return this.children.length;
	}

	//Actions sur le tableau de children
	this.push = function(item){
		if(!(item instanceof Item) || (this.parent == item))
			return;
		this.children.push(item);
		item.parent = this;

		//On met l'ordre de l'item à jour
		item.ordre = this.children.length;
	}

	this.pop = function(){
		return this.children.pop();
	}

	this.get = function(key){
		var i = 0;
		var k = null;

		//Pour tout enfant
		for(; i < this.children.length; i++){

			//Si l'enfant[i] a la clé on le retourne
			if(this.children[i].key == key){
				return this.children[i];
			}
			else{ //Sinon on cherche parmi les petits children
				if( (k = this.children[i].get(key)) != null){
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
		var it = new Item();

		it.set_txt(this.txt);
		it.parent = this.parent;
		it.set_ordre(this.ordre);
		it.set_key(this.key);

		for(i=0; i<this.children.length; ++i){
			it.children.push(this.children[i]);
		}

		return it;
	}

	this.to_json = function(){
		var i;
		var json = new Object();
		json.key = this.key;
		json.txt = this.txt;


		if(this.parent != null)
			json.parent = this.parent.get_key();
		else
			json.parent = -1;
		json.ordre = this.ordre;
		json.children = [];

		for(i=0; i<this.children.length; ++i){
			json.children.push(this.children[i].to_json());
		}
		return json;
	}

	this.from_json = function(json){
		var it = Item.prototype.create_from_json(json);
		this.key = it.key;
		this.ordre = it.ordre;
		this.txt = it.txt;
		this.parent = it.parent;
		this.children = it.children;
	}
};

Item.prototype.create_from_json = function(json) {
	var it = new Item();
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

	if(json.parent == -1)
		it.parent = null;

	for(i=0; i<json.children.length; ++i){
		it.push(Item.prototype.create_from_json(json.children[i]));
	}
	return it;
};

