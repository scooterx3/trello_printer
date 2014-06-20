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
	//newbutton.href = 'http://trello.com/prettyprint';
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

			}
		}

	}
	var items_to_print = document.createElement('div');
	for (var i in tp_lists){
		var listdiv = document.createElement('div');
		
		var list_title = document.createElement('span');
		list_title.setAttribute('class','list_titles');
		list_title.innerHTML = tp_lists[i].name;
		listdiv.appendChild(list_title);

		
		var current_card = tp_lists[i].cards;
		for (var j in current_card){
			var card_to_add = document.createElement('div');
			

			var card_title = document.createElement('div');
			card_title.setAttribute('class','card_titles');
			
			for (var k in current_card[j].labels){
				if (k == 0) {
					var card_labels = document.createElement('span');
					card_labels.setAttribute('class','card_labels');
					card_labels.innerHTML = '[';
					// card_title.innerHTML = '[';
					
				}
				else {
					card_labels.innerHTML += ', ';
					// card_title.innerHTML += ', ';
				}
				// card_title.innerHTML += current_card[j].labels[k];
				card_labels.innerHTML += current_card[j].labels[k];
				if (k == current_card[j].labels.length - 1){
					card_labels.innerHTML += ']';
					// card_title.innerHTML += ']';
				}
				card_title.appendChild(card_labels);
			}
			

			var card_title_text = document.createElement('span');
			card_title_text.setAttribute('class','card_title_text');
			card_title_text.innerHTML = current_card[j].name;
			card_title.appendChild(card_title_text);
						
			for (var k in current_card[j].members){
				if (k == 0) {
					var card_members = document.createElement('span');
					card_members.setAttribute('class','card_members');
					card_members.innerHTML = '(';
					// card_title.innerHTML = '[';
					
				}
				else {
					card_labels.innerHTML += ', ';
					// card_title.innerHTML += ', ';
				}
				// card_title.innerHTML += current_card[j].labels[k];
				card_members.innerHTML += current_card[j].members[k];
				if (k == current_card[j].members.length - 1){
					card_members.innerHTML += ')';
					// card_title.innerHTML += ']';
				}
				card_title.appendChild(card_members);
			}


			card_to_add.appendChild(card_title);

			var card_description = document.createElement('span');
			card_description.setAttribute('class','descriptions');
			card_description.innerHTML = current_card[j].desc;
			card_to_add.appendChild(card_description);


			var card_checklists = document.createElement('div');
			card_checklists.setAttribute('class','checklists');
			for (var k in current_card[j].checklists){
				var current_checklist = current_card[j].checklists[k];

				var checklist_title = document.createElement('span')
				checklist_title.setAttribute('class','checklist_titles');
				checklist_title.innerHTML = current_checklist.name;

				var my_checklist = document.createElement('ul');
				my_checklist.setAttribute('class','checklists');

				
				for (var l in current_checklist.items){
					
					var my_checklist_item = document.createElement('li');
					my_checklist_item.setAttribute('class','checklist_items');

					my_checklist_item.innerHTML = (current_checklist.items[l].state=='incomplete'?'[ &nbsp; ] ':'[&#x2713;] ');
					
					my_checklist_item.innerHTML += current_checklist.items[l].name
				
					my_checklist.appendChild(my_checklist_item);
				}
				card_checklists.appendChild(checklist_title);
				card_checklists.appendChild(my_checklist);

			}
			card_to_add.appendChild(card_checklists);



			listdiv.appendChild(card_to_add);
		}


		items_to_print.appendChild(listdiv);
	}

	var newwindow = window.open('','','height=800 width=800');

	
	var css = document.createElement('link');
	css.setAttribute('rel','stylesheet');
	css.setAttribute('type','text/css');
	css.setAttribute('href','https://raw.githubusercontent.com/scooterx3/trello_printer/master/printed_page.css');

	newwindow.document.head.appendChild(css);

	newwindow.document.body.appendChild(items_to_print);

}

isReady();