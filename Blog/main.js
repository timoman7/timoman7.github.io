/**
	Extending certain DOMElements
**/
HTMLInputElement.prototype.clear = function(){
	switch(this.type){
		case "file":
			this.files=$('<input type="file">')[0].files;
		break;
		default:
		    switch(typeof(this.value)){
			case "number":
				this.value = 0;
			break;
			case "string":
						this.value = "";
			break;
		    }
		break;
 	}
};
HTMLFormElement.prototype.clear = function(){
	var childrenCount = this.children.length;
	for(var childIndex = 0; childIndex < childrenCount; childIndex++){
		var child = this.children[childIndex];
		switch(child.tagName){
            case "INPUT":
				child.clear();
			break;
		}
	}
};
HTMLULListElement.prototype.clear = function(){
	this.innerHTML = '';
};


/**
Checking the user, and login state
**/
var userDB = firebase.database().ref("users");
var currentUser = firebase.auth().currentUser;

setInterval(function(){
	if(currentUser){
		$(".Login").class = "Logout";
		$("#LogButtonIcon").class = "glyphicon glyphicon-log-out";
		$(".LogButton").html(" Log out");
	}else{
		$(".Logout").class = "Login";
		$("#LogButtonIcon").class = "glyphicon glyphicon-log-in";
		$(".LogButton").html(" Sign in with Google");
	}
},100);


/**
	Setting up firebase authentication, database, and storage
**/
firebase.auth().getRedirectResult().then(function(result){
	var user = result.user;
	var credential = result.credential;
	console.log(result);
	if(user === null){
	}else{
		currentUser = firebase.auth().currentUser;
		userDB.once('value').then(function(data){
			if(data.child(currentUser.uid).exists()){
				userDB.child(currentUser.uid).update({
					online: true
				});
			}else{
				var userData = {
					name: currentUser.displayName,
					online: true,
					ranking: 0
				};
				userDB.child(currentUser.uid).set(userData);
			}
		});
		userDB.child(currentUser.uid).onDisconnect().update({
			online: false
		});
	}
},function(error) {
	var email = error.email;
	var credential = error.credential;
});
function signInWithGoogle(){
	var provider;
	provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithRedirect(provider);
}
function signOut(){
	userDB.child(currentUser.uid).update({
		online: false
	});
	firebase.auth().signOut().then(function() {
		location.reload();
	}).catch(function(error) {
	  // An error happened.
		console.log(error);
		alert("Somehow you screwed up logging out.");
	});
}


/**
Firebase storage and database for submitting and previewing blog posts
**/
var _RefFiles = [];
function uploadImages(_FileList){
	var blogPreview = document.getElementById("preview");
	blogPreview.innerHTML="";
	var _FileReaders = [];
	for(var i = 0; i < _FileList.length; i++){
		var _File = _FileList[i];
		_FileReaders[i] = new FileReader;
		var _FileName=i+"."+(_File.type.split('/')[1]);
		_FileReaders[i].type = _File.type;
		_FileReaders[i].FileID = i;
		_FileReaders[i].addEventListener('loadend',function(){
			var __FileName=this.FileID+"."+(this.type.split('/')[1]);
			_RefFiles.push({
				name:__FileName,
				DataURL:this.result
			});
		});
		_FileReaders[i].readAsDataURL(_File);
		var tempImage = document.createElement("img");
		tempImage.src = window.URL.createObjectURL(_File);
		blogPreview.appendChild(tempImage);
	}
	document.getElementById("fileCount").innerHTML = _FileList.length;
}
function submitBlog(){
	var storageRef = firebase.storage().ref("images");
	var _FileReader = new FileReader;
	var fo = arguments[0];
	var _Files = fo.elements.blogFiles.files;
	var _PostText = fo.elements.blogText.value;
	var _PostTitle = fo.elements.blogTitle.value;
	var x = Math.random();
	var rng=x*parseFloat(Math.pow(10,(x.toString().length-2)));
	var postRef = storageRef.child(_PostTitle+"-"+rng);
	for(var i = 0; i < _Files.length; i++){
		var _FileName=i+"."+(_Files[i].type.split('/')[1]);
		var tempRef = postRef.child(_FileName);
		tempRef.put(_Files[i]).then(function(snapshot){
			console.log("Uploaded a blob or file!");
		});
	}
	var textRef = postRef.child('blogText.txt');
	textRef.putString(_PostText).then(function(snapshot){
		console.log("Uploaded post text!");
	});
	var titleRef = postRef.child('blogTitle.txt');
	titleRef.putString(_PostTitle).then(function(snapshot){
		console.log("Uploaded post title!");
	});
	var postDB = firebase.database().ref('Posts');
	var DB_Post = postDB.child(_PostTitle+'-'+rng);
	DB_Post.set({
		titleRef: _PostTitle+'-'+rng,
		title: _PostTitle,
		files: _RefFiles,
		text: _PostText
	}).then(function(snapshot){
		console.log('Updated DB with data');
	});
	fo.clear();
	createPostList();
}

function createPostList(){
	document.getElementById("PostUL").clear();
	console.log("Creating post list");
	var postDB = firebase.database().ref('Posts');
	var Posts;
	postDB.on('value',function(data){
		Posts = data.val();
		for(var post_id in Posts){
			var post = Posts[post_id];
			console.log(post);
			var btn = document.createElement('button');
			btn.name='postId';
			btn.value=post.titleRef;
			var tmpPostTitle = document.createElement('h3');
			if(post.title.length > 125){
				tmpPostTitle.innerHTML = post.title.substring(0,125) + "...";
			}else{
				tmpPostTitle.innerHTML = post.title;
			}
			var tmpPostImage = document.createElement('img');
			tmpPostImage.src = post.files[0].DataURL;
			var tmpPostText = document.createElement('p');
			if(post.text.length > 125){
				tmpPostText.innerHTML = post.text.substring(0,125) + "...";
			}else{
				tmpPostText.innerHTML = post.text;
			}
			btn.style="border: none; background-color: #555555; cursor: pointer; text-align: center; ";
			btn.appendChild(tmpPostTitle);
			btn.appendChild(tmpPostImage);
			btn.appendChild(tmpPostText);
			var postLI = document.createElement('li');
			postLI.id="post-"+post_id;
			postLI.style="text-align: center; list-style-type: none; ";
			postLI.appendChild(btn);
			document.getElementById('PostUL').appendChild(postLI);
		}
	});
}


/**
Misc stuff
**/
document.addEventListener('load',function(){
	createPostList();
	createPostList();
});

$(".Login").on("click",signInWithGoogle);
$(".Logout").on("click",signOut);
