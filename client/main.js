import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session'

import './main.html';
import '../lib/collection.js'

Session.set('imglimit',3);

lastScrollTop = 0
$(window).scroll(function(event){
	if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
		var scrollTop = $(this).scrollTop();
		if (scrollTop > lastScrollTop){
			Session.set('imglimit',Session.get('imglimit') +3);
			console.log("We Have Arrived at the bottom of the page");
		}
		lastScrollTop = scrollTop;
	}
});

Template.mainBody.helpers({
	imagesFound(){
		return imagesDB.find().count();
			},
	imageAge(){		
		var imgCreatedOn = imagesDB.findOne({_id:this._id}).createdOn;		
		//convert to mins
		imgCreatedOn = Math.round((new Date() - imgCreatedOn)/60000);		
		var timeUnit = " mins";
		//greater than 60 mins then convert to hours
		if (imgCreatedOn > 60){
			imgCreatedOn=Math.round(imgCreatedOn/60);
			//hour or hours
			if (imgCreatedOn > 1){
				timeUnit = " hours";
			} else {
				timeUnit = " hour";
			}
		} else if (imgCreatedOn > 1440){
			imgCreatedOn=Math.round(imgCreatedOn/1440);
			if (imgCreatedOn > 1){
				timeUnit = " days";
			} else {
				timeUnit = " day";
			}
		}
		return imgCreatedOn + time
	},

	allImages(){
		var prevTime = new Date() - 15000;
		var newResults = imagesDB.find({"createdOn":{$gte:prevTime}}).count();
		if (newResults > 0) {
			//if new images are found then sort by date first then ratings
			return imagesDB.find({}, {sort:{createdOn:-1, imgrate:-1}, limit:Session.get('imglimit')});
		} else {
			//else sort by ratings then date
			return imagesDB.find({}, {sort:{imgrate:-1, createdOn:-1}, limit:Session.get('imglimit')});
		}

	}
 });


Accounts.ui.config({});

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

 		// console.log(imagepath);

 		$("#imagetitle").val('');
 		$("#imagepath").val('');
 		$("#imagedesc").val('');

 		$("#addImgPreview").attr('src','rrr.png');
 		$("#addimage1").modal("hide");
 		imagesDB.insert({"title":imagetitle, "path":imagepath, "desc":imagedesc, "createdOn":Date()});
 	},
 	'click .js-close'(){
		$("#imagetitle").val('');
		$("#imagepath").val('');
		$("#imagedesc").val('');
		$("#addImgPreview").attr('src','rrr.png');
		$("#addImgModal").modal("hide");

	},

	'input #imagepath'(event){
		var imagepath = $("#imagepath").val();
		$("#addImgPreview").attr('src', imagepath);
	}
});

Template.mainBody.events({
	'click .js-delete'(){
		var imgId = this._id;
		// console.log("you deleted", imgId);
		$('#'+imgId).fadeOut('slow', function(){
			imagesDB.remove({_id:imgId});
		});
	},

	'click .js-editImage'(){
		var imgId = this._id;
		$('#ImgPreview').attr('src',imagesDB.findOne({_id:imgId}).path);
		$("#eimgTitle").val(imagesDB.findOne({_id:imgId}).title);
		$("#eimgPath").val(imagesDB.findOne({_id:imgId}).path);
		$("#eimgDesc").val(imagesDB.findOne({_id:imgId}).desc);
		$('#eId').val(imagesDB.findOne({_id:imgId})._id);
		$('#editImgModal').modal("show");

	},



	'click .js-star'(events){
		var imgId = this.data_id;
		var rating = $(event.currentTarget).data('userrating');
		imagesDB.update({_id:imgId}, {$set:{'imgrate':rating}});
	}

});

Template.editImg.events({
	'click .js-updateImg'(){
		var eId = $('#eId').val();
		var imagetitle= $("#eimgTitle").val();
		var imagepath = $("#eimgPath").val();
		var imagedesc = $("#eimgDesc").val();
		imagesDB.update({_id:eId}, {$set:{"title":imagetitle, "path":imagepath, "desc":imagedesc}});
		$('#editImgModal').modal("hide");
	}
});