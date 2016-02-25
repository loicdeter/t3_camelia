//jquery.artifica.gallery.js

(function($) {

	$.fn.artificaGallery = function(options){

		var artificaGallery = this;
		var currentIndex = -1;
		var imageArray = [];

		var settings = jQuery.extend({
			delay: 3000,
			autoStart: false,
			numThumbs: 6,
			loop:false,
			container:'thumbs',
			changeClickLink:true
		},options||{});
		
		
		var container = this.find('.' + settings.container);
		
		
		container.find('li').each(function (index) {
			var thumb = $(this).find('img');
			var url = $(this).find('a').attr('href');
			var caption = $(this).find('.caption').html();
			
			var imageData = {thumb:thumb, href:url, caption:caption};
			
			imageArray.push(imageData);
			
			//$(this).addClass('invisible');

			$(this).find('.caption').hide();
			
			if(settings.changeClickLink)
			{
				$(this).find('a').click(function(e) {
					artificaGallery.stop();
					if(settings.loop) artificaGallery.loop('current', index);
					artificaGallery.load(index);
				}).attr('href', 'javascript:void(0);');
			}
			
			$(this).attr('index', index);
			
			if(index < settings.numThumbs) $(this).removeClass('invisible');
		});
		
		$.extend(this, {
			slideshowInterval: undefined,
			load: function(index){

				container.find('li[index=' + currentIndex + ']').removeClass('current');
			
				currentIndex = index;
				
				if(currentIndex >= 0 && currentIndex < imageArray.length)
				{
					var caption = imageArray[currentIndex]['caption'];

					container.find('li[index=' + index + ']').addClass('current');
					
					// Effects - begin
					//this.find('.slideshow').find('.content1').fadeOut("slow");
					
					this.find('.slideshow').find('.content1').hide();
					this.find('.slideshow').find('.content1').html('<img src="' + imageArray[currentIndex]['href'] + '" />');
					this.find('.slideshow').find('.content1').fadeIn("slow");
					
					artificaGallery.diplayCounter();
					if(!settings.loop) artificaGallery.displayThumb(index);

					this.find('.caption').html(caption);

					if(!settings.loop)
					{
						$(this).find('.previous').css('visibility', 'hidden');
						$(this).find('.next').css('visibility', 'visible');
						if(index == (imageArray.length - 1))
						{
							$(this).find('.next').css('visibility', 'hidden');
							artificaGallery.stop();
						}

						if(index > 0) $(this).find('.previous').css('visibility', 'visible');
					}
					
					// Preload
					if((currentIndex + 1) < imageArray.length) this.find('.slideshow').find('.content2').html('<img src="' + imageArray[(currentIndex + 1)]['href'] + '" />');
				}
			},
			play: function(){
				$(this).find('.play').hide();
				$(this).find('.pause').show();
				this.slideshowInterval = setTimeout(function() { artificaGallery.next(); }, settings.delay);
			},
			stop: function(){
				$(this).find('.pause').hide();
				$(this).find('.play').show();
				clearTimeout(this.slideshowInterval);
				this.slideshowInterval = undefined;
			},
			next: function(argClick){
				var val = currentIndex + 1;
				if(argClick == 'undefined') argClick = false;
				
				if(settings.loop)
				{
					if(val == imageArray.length) val = 0;
					artificaGallery.loop('next', val);
				}
				artificaGallery.load(val);
				
				if(argClick) artificaGallery.stop();
				
				if(this.slideshowInterval) this.slideshowInterval = setTimeout(function() { artificaGallery.next();}, settings.delay);
			},
			previous: function(argClick){
				var val = currentIndex - 1;
				if(argClick == 'undefined') argClick = false;
				if(settings.loop)
				{
					if(val == -1) val = (imageArray.length - 1);
					artificaGallery.loop('previous', val);
				}
				artificaGallery.load(val);
				
				if(argClick) artificaGallery.stop();
			},
			diplayCounter: function(){
				$(this).find('.counter').html((currentIndex + 1) + '/' + imageArray.length);
			},
			displayThumb: function(index){
				container.find('li').addClass('invisible');
				
				for(var i = index; i < (settings.numThumbs + index); i++)
				{
				   container.find('li[index=' + i + ']').removeClass('invisible');
				}
			},
			loop: function(mode, index){

				
				if(imageArray.length <= settings.numThumbs) return false;
				
				var limit = Math.floor(settings.numThumbs / 2);
				
				container.find('li').addClass('invisible');

				var start = index - limit;
				var end = index + limit;

				if(index >= 0 && index < limit) start = (imageArray.length - limit) + index;
				if(end >= imageArray.length) end = (end - imageArray.length);

				switch(mode)
				{
					case 'current' :

						// refresh list	- begin
						var flag = false;
						container.find('li').each(function(index) {
							if($(this).attr('index') == 0) flag = true;
							if(!flag) $(this).parent().append($(this));
						});
						// refresh list	- end

						if(index > (imageArray.length - limit - 1) || (index >= 0 && index < limit))
						{
							last = (imageArray.length - index) + limit;

							for(var i = 0; i < last; i++)
							{
								container.find('ul').prepend(container.find('ul').find('li:last-child'));
							}
						}

						break;

					case 'next' :

						container.find('ul').append(container.find('li:first-child'));

						break;

					case 'previous' :

						container.find('ul').prepend(container.find('li:last-child'));
						
						break;
				}

				//$(this).find('.debug').html(start + ' - ' + end);
				
				//alert(start + ' - ' + end);

				var flag = false;
				container.find('li').each(function(i) {
					if($(this).attr('index') == start) flag = true;
					if(flag) $(this).removeClass('invisible');
					if($(this).attr('index') == end) flag = false;
				});

			}
		});
		
		if(imageArray.length > 0)
		{
			var limit = Math.floor(settings.numThumbs / 2);

			this.find('.play').click(function(e) {
				artificaGallery.play();
			}).attr('href', 'javascript:void(0);');
			
			this.find('.pause').click(function(e) {
				artificaGallery.stop();
			}).attr('href', 'javascript:void(0);').hide();

			this.find('.next').click(function(e) {						  
				artificaGallery.next(true);
			}).attr('href', 'javascript:void(0);');

			this.find('.previous').click(function(e) {
				artificaGallery.previous(true);
			}).attr('href', 'javascript:void(0);');

			if(settings.loop) this.loop('current', 0);

			this.find('.slideshow').append('<div class="content1"></div>');
			this.find('.slideshow').append('<div class="content2"></div>');

			this.find('.slideshow').find('.content1').hide();
			this.find('.slideshow').find('.content2').hide();


			if(settings.autoStart)
			{
				this.next();
				this.play();
			}
			else
			{
				this.load(0);
			}
		}
		
		return false;
	};
	
})(jQuery);