var userDB = firebase.database().ref("users");
var currentUser;
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
function uploadImages(_FileList){
	var blogPreview = document.getElementById("preview");
	blogPreview.innerHTML="";
	for(var i = 0; i < _FileList.length; i++){
		var _File = _FileList[i];
		var tempImage = document.createElement("img");
		tempImage.src = window.URL.createObjectURL(_File);
		blogPreview.appendChild(tempImage);
	}
	document.getElementById("fileCount").innerHTML = _FileList.length;
}
function submitBlog(){
	console.log(arguments);
}
$(".Login").on("click",signInWithGoogle);
$(".Logout").on("click",signOut);
