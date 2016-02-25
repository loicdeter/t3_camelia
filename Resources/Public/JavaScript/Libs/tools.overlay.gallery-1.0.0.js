/**
 * Overlay Gallery plugin, version: 1.0.0
 * 
 * Copyright (c) 2009 Tero Piirainen
 * http://flowplayer.org/tools/overlay.html#gallery
 *
 * Dual licensed under MIT and GPL 2+ licenses
 * http://www.opensource.org/licenses
 *
 * Since  : July 2009
 * Date: ${date}
 * Revision: ${revision} 
 */
(function($) { 
		
	// TODO: next(), prev(), getIndex(), onChange event
	
	// version number
	var t = $.tools.overlay; 
	t.plugins = t.plugins || {};
	
	t.plugins.gallery = {
		version: '1.0.1', 
		conf: { 
			imgId: 'img',
			next: '.next',
			prev: '.prev',
			info: '.info',
			play: '.play',
			progress: '.progress',
			disabledClass: 'disabled',
			activeClass: 'active',
			opacity: 0.8,
			speed: 'slow',
			template: '<strong>${title}</strong> <span>Image ${index} of ${total}</span>',  
			autohide: true,
			preload: true,
			api: false,
			relation : ''
		}
	};			
	
	$.fn.gallery = function(opts) {
		
		var conf = $.extend({}, t.plugins.gallery.conf), api;
		$.extend(conf, opts);   	

		// common variables for all gallery images
		api = this.overlay();
		
		var links = this,
			 overlay = api.getOverlay(),
			 target = api.getConf().target,
			 next = overlay.find(conf.next),
			 prev = overlay.find(conf.prev),
			 info = overlay.find(conf.info),
			 play = overlay.find(conf.play),
			 progress = overlay.find(conf.progress),
			 els = prev.add(next).add(info).add(play).css({opacity: conf.opacity}),
			 close = api.getClosers(),
			 index = 0;
			 
		if(conf.relation != '') var links = $("a.lightbox[rel='" + conf.relation + "']");

		function load(el) {
			
			progress.fadeIn();
			els.hide(); close.hide();
			
			var url = el.attr("href");
			
			// download the image 
			var image = new Image();
			
			image.onload = function() {
				
				progress.fadeOut();
				
				// find image inside overlay
				var img = $("#" + conf.imgId, overlay); 
				
				// or append it to the overlay 
				if (!img.length) { 
					img = $("<img/>").attr("id", conf.imgId).css("visibility", "hidden");
					overlay.prepend(img);
				}
				
				// make initially invisible to get it's dimensions
				img.attr("src", url).css("visibility", "hidden");


				// Resizing large images - orginal by Christian Montoya edited by me.
				var pagesize = tb_getPageSize();
				var x = pagesize[0] - 150;
				var y = pagesize[1] - 150;
				var imageWidth = image.width;
				var imageHeight = image.height;
				if (imageWidth > x) {
					imageHeight = imageHeight * (x / imageWidth); 
					imageWidth = x; 
					if (imageHeight > y) { 
						imageWidth = imageWidth * (y / imageHeight); 
						imageHeight = y; 
					}
				} else if (imageHeight > y) { 
					imageWidth = imageWidth * (y / imageHeight); 
					imageHeight = y; 
					if (imageWidth > x) { 
						imageHeight = imageHeight * (x / imageWidth); 
						imageWidth = x;
					}
				}
				// End Resizing

				// animate overlay to fit the image dimensions
				var width = imageWidth;
				var height = imageHeight;
				var left = ($(window).width() - width) / 2;

				// calculate index number
				//index = links.index(links.filter("[href=" + url + "]"));
				
				links.each(function(i){
					if($(this).attr("href") == url) index = i;
				});
				
				/*
				index = links.index(links.filter(
					function (index) {
						if($(this).attr("href") ==  url) return index;
                	}
				));
				*/

				// activate trigger
				links.removeClass(conf.activeClass).eq(index).addClass(conf.activeClass);
				
				// enable/disable next/prev links
				var cls = conf.disabledClass;
				els.removeClass(cls);

				if (index === 0) { prev.addClass(cls); }
				if (index == links.length -1) { next.addClass(cls); }
				
				
				var title = (el.attr("title") || el.data("title"));
				if(title == undefined) title = '';
				if(title != '') title = title.replace("&copy;", '<br />');
				
				// set info text & width
				var text = conf.template
					.replace("${title}", title)
					.replace("${index}", index + 1)
					.replace("${total}", links.length);
					
				var padd = parseInt(info.css("paddingLeft"), 10) +  parseInt(info.css("paddingRight"), 10);
				info.html(text).css({width: width - padd});
				
				img.attr('width', width);
				img.attr('height', height);				
				
				overlay.animate({
					width: width, height: height, left: left}, conf.speed, function() {
						
					// gradually show the image
					img.hide().css("visibility", "visible").fadeIn(function() {						
						if (!conf.autohide) { 
							els.fadeIn(); close.show(); 
						}														
					});								

				}); 
			};
			
			image.onerror = function() {
				overlay.fadeIn().html("Cannot find image " + url); 
			};
			
			
			image.src = url;
			
			if (conf.preload) {
				links.filter(":eq(" +(index-1)+ "), :eq(" +(index+1)+ ")").each(function()  {
					var img = new Image();
					img.src = $(this).attr("href");					
				});
			}
			
		}


		// function to add click handlers to next/prev links	 
		function addClick(el, isNext)  {
			
			el.click(function() {
					
				if (el.hasClass(conf.disabledClass)) {return;}

				// find the triggering link
				if(conf.relation != '')
				{
					var trigger = $("a.lightbox[rel='" + conf.relation + "']").eq(i = index + (isNext ? 1 : -1));
				}
				else
				{
					var trigger = links.eq(i = index + (isNext ? 1 : -1));
				}
					 
				// if found load it's href
				if (trigger.length) { load(trigger); }
				
			});				
		}

		// assign next/prev click handlers
		addClick(next, true);
		addClick(prev);
		
		var interval = '';
		
		play.click(function() {
			self.galleryPlay(index);
		});	

		
		// arrow keys
		$(document).keydown(function(evt) {
				
			if (!overlay.is(":visible") || evt.altKey || evt.ctrlKey) { return; }
			
			if (evt.keyCode == 37 || evt.keyCode == 39)
			{					
				var btn = evt.keyCode == 37 ? prev : next;
				btn.click();
				return evt.preventDefault();
			}
			
			return true;			
		});		
		
		function showEls() {
			if (!overlay.is(":animated")) {
				els.show(); close.show();		
			}	
		}
		
		$.extend(self, {
			
			galleryPlay: function(i) {
			
				if(play.hasClass(conf.disabledClass)) {return;}	
				interval = window.setInterval("self.loop()", 5000);
				play.unbind("click");
				play.html("Stopper le diaporama");
				play.click(self.galleryStop);
				
				return self;	
			},
			
			loop: function(e) {
				
				// find the triggering link
				var i = index + 1;
				var trigger = links.eq(i);
					 
				// if found load it's href
				if(trigger.length == 0)
				{
					self.galleryStop();
				}
				else
				{
					load(trigger);
				}
				
				return self;	
			},
			
			galleryStop: function(e) {
				
				if(play.hasClass(conf.disabledClass)) {return;}	
				
				window.clearInterval(interval);
				
				play.unbind("click");
				play.html("Lancer le diaporama");
				play.click(self.galleryPlay);
				
				return self;	
			}
		});		
		
		// autohide functionality
		if (conf.autohide)
		{ 
			overlay.hover(showEls, function() { els.fadeOut();	close.hide(); }).mousemove(showEls);
		}		
		
		// load a proper gallery image when overlay trigger is clicked
		var ret;
		
		this.each(function() {
				
			var el = $(this), api = $(this).overlay(), ret = api;
			
			api.onBeforeLoad(function() {
				load(el);
			});
			
			api.onClose(function() {
				self.galleryStop();
				links.removeClass(conf.activeClass);	
			});			
		});  		
		
		return conf.api ? ret : this;
		
	};
	
})(jQuery);


function tb_getPageSize(){
	var de = document.documentElement;
	var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
	arrayPageSize = [w,h];
	return arrayPageSize;
}


jQuery(window).load(function(){
	
	if(jQuery("a.lightbox").length > 0)
	{
		
		var html = '<div class="simple_overlay" id="lighbox-photo"><div class="info"></div></div>';
		
		jQuery("body").append(html);
		
		
		var html = '<div class="simple_overlay" id="lighbox-gallery"><a class="prev">Pr&eacute;c&eacute;dent</a><a class="next">Suivant</a><a class="play">Lancer le diaporama</a><div class="info"></div></div>';
		
		jQuery("body").append(html);
		
		//jQuery("a.lightbox[rel!='']").attr('rel', '#lighbox-photo').overlay();
		
		var galleries = [];
		var current = '';
		
		jQuery("a.lightbox").each(function(i){								   
	
			if(this.rel != '')
			{					
				if(current != this.rel)
				{
					galleries.push(this.rel);
					current = this.rel;
				}
			}
			else
			{
				jQuery(this).overlay({target: '#lighbox-photo', expose: '#000000'}).gallery({template : '<strong>${title}</strong>'});
			}
		});
		
		if(galleries.length > 0)
		{
			for(var i = 0; i < galleries.length; i++)
			{
				if(jQuery('#lighbox-gallery').length == 0)
				{
					var html = '<div class="simple_overlay" id="lighbox-gallery"><a class="prev">Pr&eacute;c&eacute;dent</a><a class="next">Suivant</a><a class="play">Lancer le diaporama</a><div class="info"></div></div>';
	
					jQuery("body").append(html);
				}
						
				jQuery("a.lightbox[rel='" + galleries[i] + "']").overlay({target: '#lighbox-gallery', expose: '#000000'}).gallery({speed: 600, template : '<strong>${title}</strong> <span>Image ${index} sur ${total}</span>', relation:galleries[i]});
			}
		}		
	}
});

