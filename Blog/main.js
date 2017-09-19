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
}

function createPostList(){
	var postDB = firebase.database().ref('Posts');
	var Posts;
	postDB.on('value',function(data){
		Posts = data.val();
	});
	for(var post in Posts){
		var btn = document.createElement('button');
		btn.name='postId';
		btn.value=post.titleRef;
		var tmpPostTitle = document.createElement('h3');
		tmpPostTitle.innerHTML = (function(){
			if(post.title.length > 125){
				return post.title.substring(0,125) + "...";
			}else{
				return post.title;
			}
		})();
		var tmpPostImage = document.createElement('img');
		tmpPostImage.src = post.files[0].DataURL;
		var tmpPostText = document.createElement('p');
		tmpPostText.innerHTML = (function(){
			if(post.text.length > 125){
				return post.text.substring(0,125) + "...";
			}else{
				return post.text;
			}
		})();
		btn.appendChild(tmpPostTitle);
		btn.appendChild(tmpPostImage);
		btn.appendChild(tmpPostText);
		document.getElementById('PostList').appendChild(btn);
	}
}

window.addEventListener('load',createPostList);

$(".Login").on("click",signInWithGoogle);
$(".Logout").on("click",signOut);
