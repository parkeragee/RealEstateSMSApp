if(window.location.pathname != '/') {
	$('body').addClass('app');
}

function setNavHeight() {
	var windowHeight = $(window).height();
	$('.app-main .nav').height(windowHeight);
}
setNavHeight();
$(window).resize(function() {
	setNavHeight();
});

$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });

  var number = $('#phone-number').text();
  if(number == 'undefined') {
  	console.log(true);
  	$('#phone-number').text('Unavailable');
  }

  /*
   *
   *  VALIDATION
   *
   *
   */

  // $('#signup-form').validate({
	 //   rules: {
	 //     email: {
	 //       required: true,
	 //       email: true
	 //     },
	 //     encryptedPassword: 'required',
	 //     ccNumber: {
	 //       required: true,
	 //       minlength: 16
	 //     },
	 //     cvc: {
	 //       required: true,
	 //       minlength: 3
	 //     }
	 //   },
	 //   messages: {
	 //     email: 'Please enter your correct email',
	 //     encryptedPassword: 'Please enter a password',
	 //     ccNumber: 'Please enter your credit card number',
	 //     cvc: 'Please enter your CVC number'
	 //   },
	 //   errorClass: "invalid",
	 //   submitHandler: function(form) {
	 //     form.submit();
	 //   }
	 // });

  /*
   *
   *  END VALIDATION
   *
   *
   */

});

var property = $('tr[data-model="property"]');
if(property.length === '0') {
	$('#noProperties').show();
}

var leads = $('#monthlyLeads').text();
var orig = leads * .99;
var price = Math.round(orig*100)/100;
$('#monthlyCost').text(price);


////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
/////////// - DELETE PROPERTY - ////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////

$('.delete').each(function(){
	$(this).click(function(e){
		e.preventDefault();
		var href = $(this).parent().attr('action');
		var host = window.location.host;
		if(confirm('Are you sure you want to delete?')) {
			window.location = href;
		}
		return false
	});
});
var text = $('.description').text();
if(text === 'undefined') {
	$('.no-description').show();
	$('.description').hide();
}
if(text !== 'undefined') {
	$('.description').show();
	$('.no-description').hide();
}

if($('textarea[name="description"]').val() === 'undefined') {
	$('textarea[name="description"]').val('');
}

////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////
/////////// - DELETE PROPERTY - ////////////
////////////////////////////////////////////
////////////////////////////////////////////
////////////////////////////////////////////

// function handleRes(res,req,err) {
// 	$.$.ajax({
// 		url: '/path/to/file',
// 		type: 'default GET (Other values: POST)',
// 		dataType: 'default: Intelligent Guess (Other values: xml, json, script, or html)',
// 		data: {param1: 'value1'},
// 	})
// 	.done(function() {
// 		console.log("success");
// 	})
// 	.fail(function() {
// 		console.log("error");
// 	})
// 	.always(function() {
// 		console.log("complete");
// 	});
	
// }
$("#fileForm input[type='submit']").on('click', function(event) {
	event.preventDefault();
    $.ajax({
        url: "/photo/sign",
        success: function(res) {
        		$("#AWSAccessKeyId").val(res.awskey);
				$("#policy").val(res.policy);
				$("#signature").val(res.signature);
				console.log('Submit now');
				$('#fileForm').submit();
        },
        error: function(res, status, error) {
            console.log(error)
        }
    });
});


// var requestCredentials = function(e) { 
    
	// var form = document.getElementById('#myForm');
	// var formData = new FormData(form);
	// $.ajax({
	// 	url: '/photo/send',
	// 	type: 'GET',
	// 	success: function(res){
	// 		var xhr = new XMLHttpRequest();
	// 		// Add any event handlers here...
	// 		xhr.open('PUT', res.url, true);
	// 		xhr.send(formData);
	// 	}
	// })
	

 //    $.ajax({
	//   url: presignedUrl, // the presigned URL
	//   type: 'PUT',
	//   data: 'data to upload into URL',
	//   success: function() { console.log('Uploaded data successfully.'); }
	// });
// }


//////////////////////////////////////////
//////////////////////////////////////////
//////// - CANCEL MEMBERSHIP - ///////////
//////////////////////////////////////////
//////////////////////////////////////////

$('#cancel').on('click', function() {
	var data = $('input#id').val();
	$.ajax({
		type: 'post',
		url: '/user/cancel-membership',
		data: {id: data}
	});
});

//////////////////////////////////////////
//////////////////////////////////////////
//////// - CANCEL MEMBERSHIP - ///////////
//////////////////////////////////////////
//////////////////////////////////////////

var time = $('.createdAt');
for (var i = time.length - 1; i >= 0; i--) {
	var a = time[i].attributes.datetime.value;
	var c = moment(a).fromNow();
	time[i].innerHTML = c;
};


//////////////////////////////////////////
//////////////////////////////////////////
/////////// - MORE INFO - ////////////////
//////////////////////////////////////////
//////////////////////////////////////////

var form = $('form#more-info');
var thankYou = $('#thank-you');
form.on('submit', function(e) {
	var email = $('#info-email').val();
	var message = $('#info-message').val();
	e.preventDefault();
	$.ajax({
		url: '/main/email',
		type: 'POST',
		data: {email: email, message: message},
		success: function(email) {
			console.log('Message sent');
		},
		error: function(e) {
			console.log("error");
		}
	});
	$('#more-info').hide();
	$('#thank-you').show();
});

//////////////////////////////////////////
//////////////////////////////////////////
/////////// - MORE INFO - ////////////////
//////////////////////////////////////////
//////////////////////////////////////////