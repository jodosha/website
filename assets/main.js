$(window).scroll(function(){$(window).scrollTop()+$(window).height();$(window).scrollTop()>100?$("body").addClass("nav-hidden"):$("body").removeClass("nav-hidden")}),$(".full img").click(function(){$(".full img").toggleClass("zoom")});