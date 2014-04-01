//Éviter les conflits entre browsers
var jq = jQuery.noConflict();

jq("#btn_create_menu").click(function(){
	//ajout du menu au tableau
	//TODO vérification du cdamp
	var text = jq("#txt_menus").val();
	jq("#tbl_menus  tbody").prepend("<tr><td>#</td><td>Version</td><td>Langue</td><td>Publié</td><td>Action</td></tr>");
});
