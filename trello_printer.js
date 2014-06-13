function isReady() {
	//console.log("isReady()");
	if (document.getElementById('surface')) gobabygo();
	else setTimeout(isReady,200);
}

function gobabygo() {
	//console.log('gobabygo()');

	console.log('url: '+document.URL);
	var path_array = window.location.pathname.split( '/' );
	var json_url = window.location.protocol+'//'+window.location.host+'/'+path_array[1]+'/'+path_array[2]+'.json';
	console.log('json_url: '+json_url);

	document.getElementById("surface").addEventListener('DOMNodeInserted', function (evt) {
  		if (evt.target.getAttribute){
    		var thomasvariable = evt.target.getAttribute('class')
    		if (thomasvariable && thomasvariable.indexOf('board-wrapper') == 0){
	    		console.log(evt.target,"changed");
	    		add_button(json_url);
    		}
  		}
  	});
	add_button(json_url);
	

	// console.log('url: '+document.URL);
	// var path_array = window.location.pathname.split( '/' );
	// var json_url = window.location.protocol+'//'+window.location.host+'/'+path_array[1]+'/'+path_array[2]+'.json';
	// console.log('json_url: '+json_url);
	// board_call(json_url,board_callback);
}

function add_button(json_url){
	console.log('add_button json_url:',json_url);
	var buttons = document.getElementsByClassName('header-user')[0];
	var newbutton = document.createElement('a');
	newbutton.setAttribute('class','header-btn');
	//newbutton.setAttribute('onclick','board_call('+json_url+')');
	newbutton.innerHTML = 'PrettyPrint';
	buttons.appendChild(newbutton);
	newbutton.addEventListener("click",function () {board_call(json_url,board_callback)});
}


function board_call(url,c){
	console.log('making call...');

	var xhr = new XMLHttpRequest();
	xhr.onload = function(e) {
		if (xhr.readyState == 4){ 
			//console.log('readyState',xhr.readyState);
			if (xhr.status == 200) {
				console.log('200 status');
				//run some function
				board_object = JSON.parse(xhr.responseText);
				c(board_object);
				
			}
		}
	}
	xhr.open("GET",url);
	xhr.send(null);
}

function get_members(id_array) {
	//needs to return an array of members. Names only? Initials? 
	var members = [];
	
	for (var i in id_array){
		for (var j in board_object.members){
			if (id_array[i] == board_object.members[j].id){
				//Still can't decide if I want initials, whole name, first name, first name & last initial, first initial & last name ... 
				members.push(board_object.members[j].initials);
			}
		}
	}
	return members;
}

function get_checklists(id_array){
	// needs to return an array of checklists.
	var checklists = [];
	for (var i in id_array){
	
		for (var j in board_object.checklists){

			 if (id_array[i] == board_object.checklists[j].id){
			 	var checklist = {};

			 	checklist.name = board_object.checklists[j].name
			 	checklist.items = [];
			 	for (var k in board_object.checklists[j].checkItems){
			 		var item = {};
			 		item.name = board_object.checklists[j].checkItems[k].name;
			 		item.state = board_object.checklists[j].checkItems[k].state;
			 		checklist.items.push(item);
			 	}

			 	checklists.push(checklist);
			 }
		}
	}
	return checklists;
}

function get_labels(labels_array){
	var labels = [];
	for (var i in labels_array){
		labels.push(labels_array[i].name);
	}
	return labels;
}


function board_callback(board_object) {

	var tp_title = board_object.name;

	tp_lists = [];

	for (var i in board_object.lists ) {
		var tp_list = {};
		tp_list.cards = [];
		if (board_object.lists[i].closed == true) continue;
		tp_list.name = board_object.lists[i].name;
		tp_lists.push(tp_list);
		for (var j in board_object.cards) {
			if (board_object.cards[j].idList == board_object.lists[i].id) {

				if (board_object.cards[j].closed == true) continue;

				var temp = {};
				temp.name = board_object.cards[j].name;
				temp.desc = board_object.cards[j].desc;
				temp.due = board_object.cards[j].due;

				temp.members = get_members(board_object.cards[j].idMembers);

				temp.checklists = get_checklists(board_object.cards[j].idChecklists);

				temp.labels = get_labels(board_object.cards[j].labels);
				tp_list.cards.push(temp);

				// tp_list.cards[j] = {};
				// tp_list.cards[j].name = board_object.cards[j].name;
				// tp_list.cards[j].desc = board_object.cards[j].desc;
				// tp_list.cards[j].due = board_object.cards[j].due;

				// tp_list.cards[j].members = get_members(board_object.cards[j].idMembers);

				// tp_list.cards[j].checklists = get_checklists(board_object.cards[j].idChecklists);

				// tp_list.cards[j].labels = get_labels(board_object.cards[j].labels);

			}
		}

	}

}


isReady();