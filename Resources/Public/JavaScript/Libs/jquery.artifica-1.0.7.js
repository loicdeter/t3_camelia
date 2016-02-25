var carouselInterval = 0;

(function($) {

	$.fn.artifica = function(argType, argOptions){

		var artifica = this;
		var element = $(this);
		var settings = jQuery.extend({
			width: 100,
			height: 100,
			slider: 'slider',
			elemBySlide: 1,
			clearEvery: 0,
			direction : 'horizontal',
			moveSlide : 0,
			controls : true
		}, argOptions||{});
		
		var container = '';
		var numli = 0;
		var posSlider = 0;
		var pos = 0;
		var width = settings.width;
		var widthMax = 0;
		var nbNext = 0;
		
		var timeout = 0;
		var timeoutCount = 0;
		
		$.extend(this, {
			empty: function(){
				var temp = element.attr('value');
				element.focus(function(){
					if($(this).attr('value') == temp) $(this).attr('value', '');
				});
				element.blur(function(){
					if($(this).attr('value') == '') $(this).attr('value', temp);
				});
			},
			scrolls: function(){

				container = element.find('.' + settings.slider);
				var moving = container.find('ul');

				numli = moving.find('li').length;
				
				if(numli)
				{
					moving.hide();
					moving.wrap('<div class="slider-wrap"></div>');
					moving.show();
				
					if(settings.elemBySlide > 1)
					{
						moving.addClass('old-moving');
						moving.after('<div class="slider-moving"></div>');

						count = 0;
						moving.find('li').each(function(i){
							if(count == settings.elemBySlide) count = 0;
							if(count == 0) container.find('.slider-moving').append('<ul></ul>');
							
							if(settings.clearEvery > 0 && count == settings.clearEvery) $(this).css({'clear':'left'});
							
							container.find('.slider-moving').find('ul:last-child').append($(this));
							count++;
						});
						
						moving = container.find('.slider-moving');
						container.find('.old-moving').remove();
						moving.find('ul').css({'float':'left', 'width':width + 'px'}); 
					}
					
					widthMax = (Math.ceil(numli/settings.elemBySlide)*width);
					moving.css('width', widthMax + 'px');
				
					container.find('.slider-wrap').css('overflow', 'hidden');
					container.find('.slider-wrap').css('width', (width + 'px'));
					moving.css('position', 'relative');
					
					element.find('a.next').click(function() {
						
						if(settings.moveSlide)
						{
							posSlider -= settings.moveSlide;
						}
						else
						{
							posSlider -= width;
						}
						
						nbNext++;

						moving.animate({'left': posSlider}, 200);
						
						if(posSlider < 0) element.find('a.previous').css('visibility', 'visible');
						if((widthMax - width) == (nbNext*width)) $(this).css('visibility', 'hidden');
				
					}).attr('href', 'javascript:void(0);');	
					
					element.find('a.previous').click(function() {
						
						if(settings.moveSlide)
						{
							posSlider += settings.moveSlide;
						}
						else
						{
							posSlider += width;
						}
						
						if(nbNext > 0) nbNext--;
						
						moving.animate({'left': posSlider}, 200);

						if(posSlider >= 0) $(this).css('visibility', 'hidden');
						if((nbNext*width) < widthMax) element.find('a.next').css('visibility', 'visible');
				
					}).attr('href', 'javascript:void(0);').css('visibility', 'hidden');
					
					if(numli <= settings.elemBySlide)
					{
						element.find('a.next').css('visibility', 'hidden');
					}
				}
			},
			carousel: function(){
			
				element.find('li').hide();
				
				if(element.find('.controls').length == 0)
				{
					element.find('ul').after('<div class="controls"></div>');	
				}
				
				if(element.find('.controls').length > 0)
				{
					if(element.find('ul li .control-item').length > 0)
					{
						element.find('li').each(function(i) {
							$(this).attr('index', i);
							//$(this).find('.control-item a').attr('href', '#');
							$(this).find('.control-item a').attr('href', 'javascript:void(0);');
							$(this).find('.control-item a').attr('index', i);
							if(settings.controls) element.find('.controls').append($(this).find('.control-item').html());
							$(this).find('.control-item').remove();
							
											
						});
					}
					else
					{				
						element.find('li').each(function(i) {
							$(this).attr('index', i);
							if(settings.controls) element.find('.controls').append('<a href="#" index=' + i + '>' + (i + 1) + '</a>');
						});
					}

					element.find('.controls a[class!="next"][class!="previous"][class!="prev"][class!="pause"]').click(function() {
						var index = $(this).attr('index');
						clearInterval(carouselInterval);
						artifica.carouselSwitch(index);
						carouselInterval = setInterval(function(){
							artifica.carouselSwitch();	
						}, 8000);
					}).attr('href', 'javascript:void(0);');
					
					element.find('a.previous').click(function() {
						clearInterval(carouselInterval);
						artifica.carouselSwitch('-1');
					}).attr('href', 'javascript:void(0);');
						
					element.find('a.next').click(function() {
						clearInterval(carouselInterval);
						artifica.carouselSwitch();
					}).attr('href', 'javascript:void(0);');
					
					element.find('a.pause').click(function() {
						if($(this).hasClass("on"))
						{
							artifica.carouselSwitch();
							carouselInterval = setInterval(function(){
								artifica.carouselSwitch();
							}, 8000);
							$(this).removeClass('on');
						}
						else
						{
							clearInterval(carouselInterval);
							$(this).addClass('on');
						}
					}).attr('href', 'javascript:void(0);');					
					
				}
				
				artifica.carouselSwitch(0);
				
				carouselInterval = setInterval(function(){
					artifica.carouselSwitch();
				}, 8000);

			},
			carouselSwitch: function(argIndex){	

				var active = element.find('.active');
				
				if(argIndex == '-1')
				{
					var next =  active.prev();
					if(next.length == 0) next = element.find('li:last');
				}
				else if(parseInt(argIndex) || argIndex == 0)
				{
					next = element.find('li[index='+ argIndex + ']');
				}
				else
				{
					var next =  active.next();
				}
				
				if(next.length == 0) next = element.find('li:first');			

				//var index = element.find('li').index(next.attr('index'));
				var index = next.attr('index');

				element.find('li').css('display', 'none');
				
				if(argIndex != undefined)
				{
					active.removeClass('active');
					element.find('.controls a').removeClass('on');
					
					var next = element.find('li[index='+ index + ']');
					next.addClass('active');
					element.find('.controls a[index='+ index + ']').addClass('on');
					
					next.stop(true, true).fadeIn('slow', function(){
						active.removeClass('active');
						next.addClass('active');
					});
				}
				else
				{
					element.find('.controls a').removeClass('on');
					element.find('.controls a[index='+ index + ']').addClass('on');
					
					next.stop(true, true).fadeIn('slow', function(){
						active.removeClass('active');
						next.addClass('active');
					});
				}
			},
			tabs: function(){
				
				settings = jQuery.extend({
					header: '.tab-header',
					content: '.tab-content'
				}, argOptions||{});					
				
				element.find(settings.header).each(function(i) {
					artifica.switchTabs('init', i);
					$(this).find('a').click(function() {
						artifica.switchTabs('load', i);
					}).attr('href', 'javascript:void(0);');
				});
			},
			slider : function(){

				element.find('ul').addClass('slider-content');
				
				element.find('ul').after('<div class="controls"><a class="next" href="#" title="Suivant">&gt;</a><a class="previous" href="#" title="Pr&eacute;c&eacute;dent">&lt;</a><ul></ul></div>');

				element.find('ul').find('li').each(function(i) {
					
					$(this).attr('index', i);
					
					var htmlCode = $(this).find('.thumbmask').html();
					
					$(this).find('.thumbmask').remove();
					
					element.find('.controls ul').append('<li index="' + i + '"><a href="#">' + htmlCode + '</a></li>');
					
					element.find('.controls ul').find('li:last-child a').click(function() {
						var index = $(this).parents('li').attr('index');
						artifica.carouselSwitch(index);
					}).attr('href', 'javascript:void(0);');
					
				});
				
				settings.slider = 'controls';
				element.find('ul').show();

				this.scrolls();
				artifica.carouselSwitch(0);
			},
			switchTabs: function(argAction, argIndex){
				
				if(argAction == 'init')
				{		
					element.find(settings.header).eq(argIndex).addClass('off');
					element.find(settings.content).eq(argIndex).hide();
					if(argIndex == 0) argAction = 'load';
				}
				
				if(argAction == 'load')
				{
					element.find('.actif').hide();
					element.find('.actif').removeClass('actif');
					
					element.find('.on').addClass('off');
					element.find('.on').removeClass('on');
					
					element.find(settings.header).eq(argIndex).removeClass('off');
					element.find(settings.header).eq(argIndex).addClass('on');
					
					element.find(settings.content).eq(argIndex).addClass('actif');
					element.find(settings.content).eq(argIndex).show();
				}
				
				return false;
			}
		});
		
		
		switch(argType)
		{
			case 'empty' :
			
				this.empty();
			
				break;		
			
			case 'scrolls' :
			
				this.scrolls();
			
				break;
				
			case 'carousel' :
			
				this.carousel();
			
				break;
				
			case 'tabs' :
			
				this.tabs();
			
				break;
				
			case 'slider' :
			
				this.slider();
			
				break;
		}
	}

})(jQuery);


function getPageSize(){
	var de = document.documentElement;
	var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
	var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
	arrayPageSize = [w,h];
	return arrayPageSize;
}


function showOverlay(popWidth, popHeight)
{
	// Resizing large images - orginal by Christian Montoya edited by me.
	var pagesize = getPageSize();
	var x = pagesize[0] - 150;
	var y = pagesize[1] - 150;
	var imageWidth = popWidth;
	var imageHeight = popHeight;
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
	var left = (jQuery(window).width() - width) / 2;
	var top = (jQuery(window).height() - height) / 2;

	//Recuperation du margin, qui permettra de centrer la fenetre - on ajuste de 80px en conformite avec le CSS
	var popMargTop = jQuery('#overlay-modal').height() / 2;
	var popMargLeft = jQuery('#overlay-modal').width() / 2;

	//On affecte le margin
	jQuery('#overlay-modal').animate({'width': imageWidth, 'height': imageHeight, 'left':left, 'top': top}, 800, function() {
					
	});
	
	return {'width': imageWidth, 'height': imageHeight};
}



(function($){

	$.fn.reverseOrder = function() {
		return this.each(function() {
			$(this).prependTo( $(this).parent() );
		});
	};
	
	
	$.fn.artificaModal = function(vars) {

		var artificaModal = this;
		var element = $(this);
		
		var interval = '';
		var index = 0;
		var links = this;
		
		if(element.length > 0)
		{	
			var html = '<div id="overlay-modal" class="overlay-modal simple_overlay"></div><div id="fade"></div>';
			
			jQuery("body").append(html);
			

			
			var play = jQuery('#overlay-modal').find('.play');
			
			element.each(function(i) {
	
				var temp = jQuery(this).attr('href');
				var pattern = new RegExp('\\?', 'g');
				var test = pattern.test(temp);
				if(test == false) temp += '?';
				temp += '&modal=true&w=600';
				
				jQuery(this).removeAttr('target');
	
				jQuery(this).click(function() {
	   
					var type = 'url';
					var popID = jQuery(this).attr('rel'); //Trouver la pop-up correspondante
					var popURL = jQuery(this).attr('href'); //Retrouver la largeur dans le href
					
					//RÃ©cupÃ©rer les variables depuis le lien
					var popWidth = 600;
					var popHeight = 400;
					var type = '';
									
					var patternFormatImage = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
					
					var temp = jQuery(this).attr('href');
					if(temp.indexOf("?") !== -1)
					{
						temp = temp.substr(0, temp.indexOf("?"));
					}
					
					type = temp.toLowerCase().match(patternFormatImage);
					
					var codeHtml = '<a href="#" class="close" title="Fermer"></a>';

					if(type == '.jpg' || type == '.jpeg' || type == '.png' || type == '.gif' || type == '.bmp')
					{					
						var rel =  jQuery(this).attr('rel');
						var type = 'image';
		
						codeHtml += '<div class="overlay-modal-img">';
						
						if(jQuery('[rel="' + rel + '"]').length) codeHtml += '<a class="prev">Pr&eacute;c&eacute;dent</a><a class="next">Suivant</a><a class="play">Lancer le diaporama</a>';
						
						codeHtml += '<div class="info"><span></span></div><img src="/clear.gif" width="10" height="10" class="image" rel="' + rel + '" />';
						
						codeHtml += '</div>';
					}
					else
					{
						var pattern = new RegExp('\\?', 'g');
						var test = pattern.test(popURL);
						if(test == false) popURL += '?';
						
						var tempArray = popURL.split('?');
						var queryArray = tempArray[1].split('&');
						
						for(i = 0; i < queryArray.length; i++)
						{
							if(queryArray[i].substr(0,6).toLowerCase() == 'width=')
							{
								popWidth = queryArray[i].substring(6);
							}
		
							if(queryArray[i].substr(0,7).toLowerCase() == 'height=')
							{
								popHeight = queryArray[i].substring(7);
							}				
						}
						
						popURL += '&modal=true&w=' + popWidth + '&h=' + popHeight;
	
						
						codeHtml += '<iframe src="' + popURL + '" width="100%" height="100%" frameborder="0" style="background-color:#ffffff;"></iframe>';
					}
					
					jQuery('#overlay-modal').html(codeHtml);
					
					if(type == 'image')
					{
						jQuery('#overlay-modal .close').hide();	
						jQuery('#overlay-modal .overlay-modal-img .image').css({'height':10, 'height':10});	
						jQuery('#overlay-modal .overlay-modal-img .image').hide();
						jQuery('#overlay-modal .overlay-modal-img .info').hide();
					}
					//jQuery('#overlay-modal').find('.overlay-modal-img').hide();
					
					//Faire apparaitre la pop-up et ajouter le bouton de fermeture
					
					var left = (jQuery(window).width() - popWidth) / 2;
					var top = (jQuery(window).height() - popHeight) / 2;
					
					jQuery('#overlay-modal').fadeIn(400, function(){
						if(type == 'image')
						{				
							jQuery(this).find('.overlay-modal-img a.prev').click(function() {
								self.galleryPrevNext(-1);
							});
							
							jQuery(this).find('.overlay-modal-img a.next').click(function() {
								self.galleryPrevNext(1);
							});
						}						
					}).css({
						'width': Number(popWidth)
						, 'height': Number(popHeight)
						, 'left':left
						, 'top':top
					}).prepend('');
					
				
					//Effet fade-in du fond opaque
					jQuery('body').append(''); //Ajout du fond opaque noir
					//Apparition du fond - .css({'filter' : 'alpha(opacity=80)'}) pour corriger les bogues de IE
					jQuery('#fade').css({'filter' : 'alpha(opacity=80)'}).fadeIn();
					
					
					jQuery('#overlay-modal').find('.close').click(function(){
						self.pClose();
						return false;
					});
					
					jQuery('#overlay-modal').find('.play').click(function(e) {
						self.galleryPlay();
					}).attr('href', 'javascript:void(0);');
					
					if(jQuery('#overlay-modal').find('.overlay-modal-img').length > 0)
					{
						jQuery('#fade').click(function(){
							self.pClose();
							return false;
						});
					}

					if(type == 'image') 
					{
						self.loadImage(jQuery(this));
					}
					else
					{
						jQuery('#overlay-modal .close').show();
						showOverlay(popWidth, popHeight);
					}
				
					return false;
				});
			});		
		}
		
		$.extend(self, {
			pClose: function(){
				jQuery('#overlay-modal').fadeOut();
				jQuery('#overlay-modal').html('');
				jQuery('#fade').fadeOut();
			},
			loadImage: function(argElement, argIndex){

				//jQuery('#overlay-modal .close').hide();
				
				jQuery('#overlay-modal .overlay-modal-img .image').hide();
				jQuery('#overlay-modal .overlay-modal-img .info').hide();
				
				jQuery('#overlay-modal .overlay-modal-img .image').css({'height':10, 'height':10});
			
				imgPreloader = new Image();
				imgPreloader.src = argElement.attr('href');

				var title =  argElement.attr('title');
				var rel =  argElement.attr('rel');
				var index = 0;
				
				var parent = argElement.parents('li');
				if(parent.find('.legend').length > 0)
				{
					title = parent.find('.legend').html();	
				}	
				
				var count = 0;
				element.filter('[rel="' + rel + '"]').each(function(i) {
					if(jQuery(this).attr('href') == argElement.attr('href'))
					{
						index = i;
					}
					count++;
				});	

				imgPreloader.onload = function() {
					popWidth = imgPreloader.width;
					popHeight = imgPreloader.height;
					
					jQuery('#overlay-modal').find('.overlay-modal-img .info span').html(title);
					
					jQuery('.overlay-modal-img').find('a.prev').show();
					jQuery('.overlay-modal-img').find('a.next').show();

					if(index <= 0)
					{
						jQuery('.overlay-modal-img').find('a.prev').hide();
					}	
					
					if(index == (count - 1))
					{
						jQuery('.overlay-modal-img').find('a.next').hide();
					}		
					
					var valueArray = showOverlay(popWidth, popHeight);
					jQuery('#overlay-modal').find('.overlay-modal-img .image').delay(400).attr('src', argElement.attr('href'));
					

					jQuery('#overlay-modal .overlay-modal-img .image').css({'width':valueArray.width, 'height':valueArray.height});
					jQuery('#overlay-modal .overlay-modal-img').css({'width':valueArray.width, 'height':valueArray.height});
					
					jQuery('#overlay-modal .overlay-modal-img .image').fadeIn(700, function(){
						
						jQuery('#overlay-modal .overlay-modal-img').hover(
							function() {
								if(title) jQuery('#overlay-modal .overlay-modal-img .info').show();
								jQuery('#overlay-modal .close').show();
							},
							function() {
								if(title) jQuery('#overlay-modal .overlay-modal-img .info').hide();
								jQuery('#overlay-modal .close').hide();
								jQuery('#overlay-modal .close').hover(function(){
										jQuery('#overlay-modal .close').show();
									},function(){
										jQuery('#overlay-modal .close').hide();
									}
								);
							}
						);
						
					});
				};

			},
			galleryPrevNext: function(argAction){
								
				var src = jQuery('.overlay-modal-img').find('img').attr('src');
				var rel = jQuery('.overlay-modal-img').find('img').attr('rel');
				
				var count = 0;
				
				element.filter('[rel="' + rel + '"]').each(function(i) {
					if(jQuery(this).attr('href') == src)
					{
						index = i;
					}
					
					count++;
				});
				
				if(argAction == 1) index++;
				if(argAction == -1) index--;

				self.loadImage(element.filter('[rel="' + rel + '"]').eq(index), index);
				// && jQuery(this).attr('href') == src
				//alert(element.find('*[rel="' + rel + '"]').length);
				
				if(index == (count-1)) self.galleryStop();
				
				return self;
			},
			galleryPlay: function(i) {
			
				//if(jQuery('#overlay-modal').find('.play').hasClass(conf.disabledClass)) {return;}	
				interval = window.setInterval("self.galleryLoop()", 5000);
				jQuery('#overlay-modal').find('.play').unbind("click");
				jQuery('#overlay-modal').find('.play').html("Stopper le diaporama");
				jQuery('#overlay-modal').find('.play').click(self.galleryStop);
				
				return self;	
			},
			galleryLoop: function(e) {
				
				// find the triggering link
				//var i = index + 1;
				//var trigger = links.eq(i);
					 
				// if found load it's href
				//if(index == (count - 1))
				//{
					//self.galleryStop();
				//}
				//else
				//{
					self.galleryPrevNext(1);
					//self.loadImage(trigger);
				//}
				
				return self;	
			},
			galleryStop: function(e) {
				
				//if(play.hasClass(conf.disabledClass)) {return;}	
				
				window.clearInterval(interval);
				
				jQuery('#overlay-modal').find('.play').unbind("click");
				jQuery('#overlay-modal').find('.play').html("Lancer le diaporama");
				jQuery('#overlay-modal').find('.play').click(self.galleryPlay);
				
				return self;	
			}
		});	
	};
	
	
	$.fn.artificaToolsbox = function(vars) { 
	
		var ver = 'jquery.artifica.toolsbox-1.0.3';
		var element = $(this);
		var sizes = (vars.sizes != undefined) ? vars.sizes : '';
		var defaultSize = (vars.defaultSize != undefined) ? vars.defaultSize : '';
		var contrast = (vars.contrast != undefined) ? vars.contrast : '';
		var listSizes = sizes.split(',');
		
		var start = function() {
			loadStylesheets(listSizes);
			loadButtons();
		};
		
		var loadButtons = function() {
			
			//element.css('display', 'block');

			if(element.find('#print').length > 0)
			{				
				$('#print').bind('click', function(){window.print(); return false;}).attr('href', 'javascript:void(0);');
			}
			
			if(element.find('#btnTypoMore').length > 0 && sizes != '')
			{
				$('#btnTypoMore').bind('click', function(){return setTypoSize('more', listSizes, defaultSize)}).attr('href', 'javascript:void(0);');
			}
			
			if(element.find('#btnTypoLess').length > 0 && sizes != '')
			{
				$('#btnTypoLess').bind('click', function(){return setTypoSize('less', listSizes, defaultSize)}).attr('href', 'javascript:void(0);');
			}
			
			if(element.find('#typoconstrast').length > 0)
			{
				
				$('#btnTypoContrast').bind('click', function(){return setTypoContrast(contrast)}).attr('href', 'javascript:void(0);');
			}

		};
		
		var loadStylesheets = function() {
			
			// COOKIES
			var current = $.cookie('typo_size');			
			if(current != null && !$('body').hasClass(current)) $('body').addClass(current);
			
			if(contrast != '') getTypoContrast(contrast);
		};
		
		start();
	}
	
	function setTypoSize(argType, argSizeArray, argDefault)
	{
		// COOKIES
		var currentOld = $.cookie('typo_size');
		var newi = argDefault;
	
		var current = currentOld;
		var list = argSizeArray;
	
		if(list.length > 0)
		{
			if(currentOld == null) currentOld = list[0];
			
			for(var i = 0; i < list.length; i++)
			{		
				if(current == list[i]) newi = i;
			}	
		
			switch(argType)
			{
				case 'less' :
				
					newi--;
					if(newi > -1) current = list[newi];
					break;
					
				case 'more' :
				
					newi++;
					if(newi < list.length) current = list[newi];
					break;	
			}
			
			$('body').removeClass(currentOld);
			$('body').addClass(current);
			$.cookie('typo_size', current, {path:'/'});		
		}
			
		return false;
	}	
	
	
	function getTypoContrast(argClass)
	{
		var current = $.cookie('typo_contrast');			
		if(current != null && !$('body').hasClass(current) && current == '1') $('body').addClass(argClass);
	}
	
	function setTypoContrast(argClass)
	{
		var current = $.cookie('typo_contrast');
		
		if(current == null) current = '0';
		
		//!$('body').hasClass(contrast)
		switch(current)
		{
			case '0' :
			
				current = '1';
				$('body').addClass(argClass);
				break;
			
			case '1' :
			
				current = '0';
				$('body').removeClass(argClass);
				break;			
		}
		
		$.cookie('typo_contrast', current, {path:'/'});
		
		return false;
	}
	
	$.fn.artificaToolsbox.ver = function() { return ver; };
	
})(jQuery);


jQuery(window).load(function(){
	jQuery("a.modalInput, a.modal, a.thickbox, a.lightbox").artificaModal();
});