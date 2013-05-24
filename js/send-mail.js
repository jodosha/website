
(function ($) {

	$(function() {
		
		var contactForm = $( '#contact-form' );
		var loader = contactForm.find('.ajax-loader');
		
		contactForm.submit(function()
		{
			if (contactForm.valid())
			{
				loader.css('display', 'block');
				var formValues = $(this).serialize();
				
				$.post($(this).attr('action'), formValues, function(data)
				{
					if ( data == 'success' )
					{
						contactForm.clearForm();
						contactForm.prepend('<div class="alert success"><strong>SUCCESS:</strong> Your message has been sent.</div>');
					}
					else
					{
						contactForm.prepend('<div class="alert error"><strong>ERROR:</strong> Something went wrong.</div>');
					}
					loader.hide();
					contactForm.find('.alert').slideDown();
				});
			}
			
			return false
		});
	
	});


	$.fn.clearForm = function() {
	  return this.each(function() {
	    var type = this.type, tag = this.tagName.toLowerCase();
	    if (tag == 'form')
	      return $(':input',this).clearForm();
	    if (type == 'text' || type == 'password' || tag == 'textarea')
	      this.value = '';
	    else if (type == 'checkbox' || type == 'radio')
	      this.checked = false;
	    else if (tag == 'select')
	      this.selectedIndex = -1;
	  });
	};

})(jQuery);