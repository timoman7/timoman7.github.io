var currentUser;
setInterval(function(){
	if(currentUser){
		var logoutbtn = $(".Logout");
		logoutbtn.show();
		var loginbtns = $(".Login");
		loginbtns.hide();
	}else{
		var logoutbtn = $(".Logout");
		logoutbtn.hide();
		var loginbtns = $(".Login");
		loginbtns.show();
	}
},100);

firebase.auth().getRedirectResult().then(function(result){
	var user = result.user;
	var credential = result.credential;
	console.log(result);
	if(user === null){
	}else{
		currentUser = firebase.auth().currentUser;
		
		firebase.database().ref('arcade/users/'+currentUser.uid).onDisconnect().update({
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
function signInWithGithub(){
	var provider;
	provider = new firebase.auth.GithubAuthProvider();
	firebase.auth().signInWithRedirect(provider);
}
function signOut(){
	firebase.database().ref('arcade/users/'+currentUser.uid).update({
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
