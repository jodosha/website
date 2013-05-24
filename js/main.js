/*
	Name: Read
	Description: Responsive HTML5 Template
	Version: 1.0
	Author: pixelwars
*/


(function ($) {

	/* DOCUMENT LOAD */
	$(function() {
		
		
			
		//**********************************
		//NAV MENU
		$('.main-navigation li').hover(function() {
			var subMenu = $(this).find('ul:first');
			$(this).siblings().find('a').removeClass("selected");
			//if has sub menu
			if(subMenu.length) {
				$(this).find('a').eq(0).addClass("selected");
				subMenu.show();
			}
		}, function(e) {  //hover out
			var subMenu = $(this).find('ul:first');
			subMenu.hide();
			$(this).find('a').eq(0).removeClass("selected");
		});
		//NAV MENU
		//**********************************
		
		
		//**********************************
		// prepeare mobile search form 
		var searchForm = $('.main-navigation li:last').clone();
		searchForm.find('form').attr('id','search-form-mobile');
		searchForm.find('#search').attr('id','search-mobile-input').attr('placeholder',searchForm.find('label').text());
		searchForm.find('#search-submit').attr('id','search-mobile-submit');
		searchForm.find('label').remove();
		$('body').prepend('<div class="search-mobile">'+ searchForm.html() + '</div>');
		//**********************************
		
		
		// MOBIL NAV MENU - SELECT LIST
		//**********************************
		/* Clone our navigation */
		var mainNavigation = $('.main-navigation > ul').clone();
		
		/* Replace unordered list with a "select" element to be populated with options, and create a variable to select our new empty option menu */
		$('.main-navigation').prepend('<select class="menu"></select>');
		var selectMenu = $('select.menu');
		$(selectMenu).append('<option value="null">'+"MENU"+'</option>');
		
		/* Navigate our nav clone for information needed to populate options */
		$(mainNavigation).children('li').each(function() {
		
			 /* menu - LEVEL 1 */
			 $(selectMenu).append(generateSelectLink($(this), ''));
			
			 /* menu - LEVEL 2 */
			 if ($(this).children('ul').length > 0) {
					$(this).children('ul').children('li').each(function() {
			
					/* Append this option to our "select" */
					$(selectMenu).append(generateSelectLink($(this), ' » '));
				   
				   /* menu - LEVEL 3 */
				   if ($(this).children('ul').length > 0) {
						$(this).children('ul').children('li').each(function() {
					
						   /* Append this option to our "select" */
						   $(selectMenu).append(generateSelectLink($(this), ' »» '));
						   
						   
						   /* menu - LEVEL 4 */
						   if ($(this).children('ul').length > 0) {
								$(this).children('ul').children('li').each(function() {
							
								   /* Append this option to our "select" */
								   $(selectMenu).append(generateSelectLink($(this), ' »»» '));
								   
								});
							 }
						   
						});
					 }
				   
				});
			 }
		});
		
		function generateSelectLink(li, prefix) {
			var navLink = li.children('a'); 
			if(navLink.length) {
				return '<option value="' + navLink.attr('href') + '"> ' + prefix + navLink.text() + '</option>';
			}
			var sForm = li.children('form');
			if(sForm.length) {
				return '<option value="search"> ' + sForm.find('label').text() + '</option>';
			}
		}
		
		/* When our select menu is changed, change the window location to match the value of the selected option. */
		$(selectMenu).change(function() {
			
				var url = this.options[this.selectedIndex].value;
				if(url == 'search') {
					$('.search-mobile').slideDown().find('#search-mobile-input').focus();
				} else if (url != "null") {
					location = this.options[this.selectedIndex].value; 
				}
		});
		//**********************************
		
		
		//**********************************
		// mobile search focus out
		$('#search-mobile-input').focusout(function() {
			$('.search-mobile').slideUp();
			$("select.menu").val('null').trigger('click');
		});
		//**********************************
		
		
		
		//**********************************
		// SEARCH BOX
		$("#search-form #search").focus(function () {
			 $(this).stop().animate({ width:140 }).siblings('label').stop(true,true).fadeOut(400);
		}).blur(function() {
		  $(this).stop().animate({ width:50 });
		  if($(this).val() == "") {
			$(this).siblings('label').stop(true,true).fadeIn(400);
		  }
		});
		//**********************************
		
		
		//**********************************
		// WP FIX - searchbox
		$("#searchform #s").attr('placeholder','Enter keyword...');
		
		//button with icons
		$('input[type=submit], input[type=button], button, a.button').each(function(index, element) {
			if($(this).find('i').length) {
				$(this).addClass('icon-button');	
			}
		});
		//**********************************
		
		
		//**********************************
		// CODE PRETTIFY
		if($('.prettyprint').length) {
			window.prettyPrint && prettyPrint();
		}
		//**********************************
		
		
		
		
		//**********************************
		// UNIFORM
		$("select:not([multiple]), input:checkbox, input:radio, input:file").uniform();
		var ua = navigator.userAgent.toLowerCase();
		var isAndroid = ua.indexOf("android") > -1;
		if(isAndroid) {
			$('html').addClass('android');
		}
		//**********************************
		
		
		
		
		//**********************************
		// TABS
		$('.tabs').each(function() {
			if(!$(this).find('.tab-titles li a.active').length) {
				$(this).find('.tab-titles li:first-child a').addClass('active');
				$(this).find('.tab-content > div:first-child').show();
			} else {
				$(this).find('.tab-content > div').eq($(this).find('.tab-titles li a.active').parent().index()).show();	
			}
		});
		
		$('.tabs .tab-titles li a').click(function() {
			if($(this).hasClass('active')) { return; }
			$(this).parent().siblings().find('a').removeClass('active');
			$(this).addClass('active');
			$(this).parents('.tabs').find('.tab-content > div').hide().eq($(this).parent().index()).show();
			return false;
			});
		//**********************************
		
		
		//**********************************
		// TOGGLES
		var toggleSpeed = 300;
		$('.toggle h4.active + .toggle-content').show();
	
		$('.toggle h4').click(function() {
			if($(this).hasClass('active')) { 
				$(this).removeClass('active');
				$(this).next('.toggle-content').stop(true,true).slideUp(toggleSpeed);
			} else {
				
				$(this).addClass('active');
				$(this).next('.toggle-content').stop(true,true).slideDown(toggleSpeed);
				
				//accordion
				if($(this).parents('.toggle-group').hasClass('accordion')) {
					$(this).parent().siblings().find('h4').removeClass('active');
					$(this).parent().siblings().find('.toggle-content').stop(true,true).slideUp(toggleSpeed);
				}
				
			}
			return false;
			});
		//**********************************
		
		
		
		
		//**********************************
		// RESPONSIVE VIDEOS
		$(".media-wrap").fitVids();
		//**********************************
		
		
		
		//**********************************
		// PREVIEW ONLY - BUTTONS
		$('.show-buttons a.button').click(function() { return false; });
		//**********************************
		
		
		
	
	
		//**********************************
		// PORTFOLIO FILTERING - ISOTOPE
		// cache container
		var $container = $('.portfolio-items');
		if($container.length) {
			
			var page = 0,
				itemPerPage = parseInt($container.attr('data-itemPerPage')),
				result,
				moreLink = $( '#loadmore' );
			var url = moreLink.attr('href');
			
			$container.imagesLoaded(function() {
				
				setMasonry();
				$(window).resize(function() {
					setMasonry();
				});
				
				// initialize isotope
				$container.isotope({
				  itemSelector : '.hentry',
				  layoutMode : 'masonry'
				});
				
				// fix v1.1
				setTimeout(function() { setMasonry(); $container.isotope({ filter: "*" }); }, 0);
				
				// filter items when filter link is clicked
				$('#filters a').click(function(){
				  var selector = $(this).attr('data-filter');
				  setMasonry();
				  $container.isotope({ filter: selector });
				  $(this).parent().addClass('current').siblings().removeClass('current');
				  return false;
				});
				
			});
			
			
			// Get All Images via Ajax
			if(!$container.find('.hentry').length) {
	
				$.get(url, function(data) {
				  result = data;
				  
				  addItems();
				  
				  ++page;
				  handleMoreLink();
				  
				},'html');
			} 
			
			// Show more images
			moreLink.on( 'click', function() {
				
				moreLink.addClass('loading');
				addItems();
				++page;
				handleMoreLink();
				
				// fix v1.1
				setTimeout(function() { setMasonry();  }, 0);
				
				return false;
			} );
			
			// Hide more link if there is no image left to show
			function handleMoreLink() {
				if(getNewItems().length == 0) {
					moreLink.hide();	
				}	
			}
			
			// Get New Images
			function getNewItems() {
				var iMin = page * itemPerPage;
				var iMax = iMin + itemPerPage;
				
				return iMin == 0 ? $(result).find('.portfolio-items .hentry:lt('+ itemPerPage +')') 
									: $(result).find('.portfolio-items .hentry:gt(' + (iMin-1) +'):lt('+ itemPerPage +')');
			}
			
			function addItems() {
				var newItems = getNewItems();
				  newItems.imagesLoaded(function() { 
					$container.removeClass('loading').isotope( 'insert', newItems );
					setupLigtbox();
					setMasonry();
					setTimeout( function() { moreLink.removeClass('loading'); }, 1000);
				  });	
			}
			
		} // if($container.length)
		
		
		// change the number of masonry columns based on the current container's width
		function setMasonry() {
			
			var containerW = $container.width();
			var items = $container.children('.hentry');
			var columns, columnWidth;
			var viewports = [ {
					width : 1200,
					columns : 5
				}, {
					width : 900,
					columns : 4
				}, {
					width : 500,
					columns : 3
				}, { 
					width : 320,
					columns : 2
				}, { 
					width : 0,
					columns : 2
				} ];
	
			for( var i = 0, len = viewports.length; i < len; ++i ) {
	
				var viewport = viewports[i];
	
				if( containerW > viewport.width ) {
	
					columns = viewport.columns;
					break;
	
				}
			}
	
			// set the widths (%) for each of item
			items.each(function(index, element) {
				var multiplier = $(this).hasClass('x2') ? 2 : 1;
				var itemWidth = (Math.floor( containerW / columns ) * 100 / containerW) * multiplier ;
				$(this).css( 'width', itemWidth + '%' );
			});
			if($container.isotope()) {
					columnWidth = Math.floor( containerW / columns );
					$container.isotope( 'reLayout' ).isotope( 'option', { masonry: { columnWidth: columnWidth } } );
				}
	
		} // setMasonry
		
		//**********************************
		
		
		
		
		
		
		//**********************************
		/* Gamma Gallery */
		var gammaGallery = $('.gamma-gallery');
		if(gammaGallery.length) {
			
			var g_page = 0,
				g_itemPerPage = parseInt(gammaGallery.attr('data-itemPerPage')),
				g_result,
				g_moreLink = $( '#loadmore' );
			var g_url = g_moreLink.attr('href');
			
			var GammaSettings = {
				interval : parseInt(gammaGallery.attr('data-slideshowInterval')),
				circular : gammaGallery.attr('data-circular') != "false",
				nextOnClickImage : gammaGallery.attr('data-nextOnClickImage') != "false",
				// order is important!
				viewport : [ {
					width : 1200,
					columns : 5
				}, {
					width : 900,
					columns : 4
				}, {
					width : 500,
					columns : 3
				}, { 
					width : 320,
					columns : 2
				}, { 
					width : 0,
					columns : 2
				} ]
			};
			
			
			// Get All Images via Ajax
			if(!gammaGallery.find('li').length) {
				
				$.get(g_url, function(data) {
				  g_result = data;
				  
				  gammaGallery.html(getNewImages());
				  ++g_page;
				  g_handleMoreLink();
				  Gamma.init( GammaSettings );
				},'html');
			} else {
				Gamma.init( GammaSettings ); 
			}
			
			
			// Show more images
			g_moreLink.on( 'click', function() {
				g_moreLink.addClass('loading');
				Gamma.add( getNewImages(), function() {
					setTimeout( function() { g_moreLink.removeClass('loading'); }, 1000);
					} );
				g_page++;
				g_handleMoreLink();
				return false;
			} );
			
			// Hide more link if there is no image left to show
			function g_handleMoreLink() {
				if(getNewImages().length == 0) {
					g_moreLink.hide();	
				}	
			}
			
			// Get New Images
			function getNewImages() {
				var iMin = g_page * g_itemPerPage;
				var iMax = iMin + g_itemPerPage;
				return iMin == 0 ? $(g_result).find('.gamma-gallery li:lt('+ g_itemPerPage +')') 
									: $(g_result).find('.gamma-gallery li:gt(' + (iMin-1) +'):lt('+ g_itemPerPage +')');
			}
		
		}//if .gamma-gallery.length
		//**********************************
		
		
		
		
		// LIGHTBOX
		//**********************************
		setupLigtbox();
		//**********************************
		
		
		// SHARE LINKS
		//**********************************
		$('.share-links').hover(function() {
			$(this).find('.share-wrap').show();
			});
				
		$('body, body *').click(function (e) {
			  if ($(e.target).is('.share-links *')) return;
			  $('.share-links').find('.share-wrap').hide();
		});	
		//**********************************
		
		
		
		
		
		//**********************************
		// BLOG MASONRY
		// cache container
		var $containerBlog = $('.blog-masonry');
		if($containerBlog.length) {
			
			$containerBlog.imagesLoaded(function() {
				
				setMasonryBlog();
				$(window).resize(function() {
					setMasonryBlog();
				});
				
				// initialize isotope
				$containerBlog.isotope({
				  itemSelector : '.hentry',
				  layoutMode : 'masonry'
				});
				
				setTimeout(function() { setMasonryBlog(); }, 1000);
			
			});
			
		} // if($container.length)
		
		
		// change the number of masonry columns based on the current container's width
		function setMasonryBlog() {
			
			var containerW = $containerBlog.width();
			var items = $containerBlog.children('.hentry');
			var columns, columnWidth;
			var viewports = [ {
					width : 1900,
					columns : 5
				}, {
					width : 1200,
					columns : 4
				}, {
					width : 768,
					columns : 3
				}, { 
					width : 480,
					columns : 2
				}, { 
					width : 0,
					columns : 1
				} ];
	
			for( var i = 0, len = viewports.length; i < len; ++i ) {
	
				var viewport = viewports[i];
	
				if( containerW > viewport.width ) {
	
					columns = viewport.columns;
					break;
	
				}
			}
	
			// set the widths (%) for each of item
			items.each(function(index, element) {
				var multiplier = $(this).hasClass('x2') ? 2 : 1;
				var itemWidth = (Math.floor( containerW / columns ) * 100 / containerW) * multiplier ;
				$(this).css( 'width', itemWidth + '%' );
			});
			if($containerBlog.isotope()) {
					columnWidth = Math.floor( containerW / columns );
					$containerBlog.isotope( 'reLayout' ).isotope( 'option', { masonry: { columnWidth: columnWidth } } );
				}
	
		} // setMasonry
		
		//**********************************
		
		
		
		
		
		//**********************************
		/* FLEX SLIDER */
		// cache container
		var $flexslider = $('.flexslider');
		if($flexslider.length) {
			
			$flexslider.each(function() {
			
				//wait for images
				$(this).imagesLoaded(function() {
					
					//remove loading
					$(this).find('.loading').remove();
					
					//setup slider
					$(this).flexslider({ 
						smoothHeight: true,
						slideshow: $(this).attr('data-autoplay') != "false",
						slideshowSpeed: $(this).attr('data-interval'), 
						animationSpeed : $(this).attr('data-animationSpeed'),
						animation: $(this).attr('data-animation'), 
						direction : $(this).attr('data-direction'),
						directionNav : $(this).attr('data-directionNav') != "false",
						controlNav : $(this).attr('data-controlNav') != "false",
						randomize : $(this).attr('data-randomize') == "true",
						startAt : $(this).attr('data-startAt') != null ? parseInt($(this).attr('data-startAt')) : 0,
						animationLoop : $(this).attr('data-animationLoop') != "false",
						pauseOnHover : $(this).attr('data-pauseOnHover') != "false",
						reverse : $(this).attr('data-reverse') == "true",
						prevText: "",
						nextText: ""
						});
					
				});
			
			});
		}
		//**********************************
		
		
		
		//**********************************
		/* MEDIAELEMENT.JS - self hosted html5 video and audio player */
		if($('video,audio').length) {
			$('video,audio').mediaelementplayer({});	
		}
		//**********************************
		
		
		
		
		//*************************************
		// FORM VALIDATION - v1.1
		
		// comment form validation fix
		$('#commentform').addClass('validate-form');
		$('#commentform').find('input,textarea').each(function(index, element) {
            if($(this).attr('aria-required') == "true") {
				$(this).addClass('required');
			}
			if($(this).attr('name') == "email") {
				$(this).addClass('email');
			}
		});
		
		// validate form
		if($('.validate-form').length) {
			$('.validate-form').each(function() {
					$(this).validate();
				});
		}
		//*************************************
		
		
		//*************************************
		// DETECT BLOG WITH SIDEBAR
		if($('#secondary').length) {
			$('#main > .row-fluid').addClass('blog-with-sidebar');	
		}
		//*************************************
		
		
	});
	/* DOCUMENT LOAD */
	
	
	
	
	// ------------------------------
	// LIGHTBOX
	function setupLigtbox() {
		
		//html5 validate fix
		$('.lightbox').each(function(index, element) {
			$(this).attr('rel', $(this).attr('data-lightbox-gallery'));
		});
		
		if($("a[rel^='fancybox']").length) {
			$("a[rel^='fancybox']").fancybox({
				centerOnScroll : true,
				padding : 0,
				margin : 44,
				width : 640,
				height : 360,
				transitionOut : 'none',
				overlayColor : '#000',
				overlayOpacity : '.9',
				onComplete : function() {
					if ($(this).attr('href').indexOf("soundcloud.com") >= 0) {
						$('#fancybox-content').height(166);
					}
				}
			});
		}	
	}
	// ------------------------------	
	
	
})(jQuery);	