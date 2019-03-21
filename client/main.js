import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import '../lib/collection.js';

Template.myJumbo.events({
	'click .js-addimage'(event){
		$('#addimage1').modal("show");

	}
	
});

 Template.addimage.events({
 	'click .js-saveimage'(event){
 		var imagetitle = $("#imagetitle").val();
 		var imagepath = $("#imagepath").val();
 		var imagedesc = $("#imagedesc").val();
 		console.log("save",imagepath,imagetitle,imagedesc);
 		$("#addimage1").modal("hide");
 	},
 	'change #addimagepreview'(event){
 		var imagepath = $("#imagepath").val();
 		
 	}
 });