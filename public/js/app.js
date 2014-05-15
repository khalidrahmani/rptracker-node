$(document).ready(function(){	
	$('#copy_script').on('click',function(e) {
	    $("#script_tags").show('')	    
	}); 

	$('.ajax_submit').click(function (e) {
	        e.preventDefault()       
	        el = $(this) 
	        $.get("/sites/activate",{id: $(this).attr("data")},
	        function(data){           
	           if(data.status === "updated") {             
	           	if(data.message === "inactive") {             
	           		el.text("active").removeClass("label-important").addClass("label-info")  
	           	}
	           	else {
	           		el.text("inactive").removeClass("label-info").addClass("label-important")  	
	           	}
	           }      
	        }, 'json')
	        
    })

});