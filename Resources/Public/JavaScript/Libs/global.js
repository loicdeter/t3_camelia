/*!
 * Global JavaScript
 * http://www.artifica.fr/
 *
 * Copyright 2011, Artifica
 *
 * Date: Thu Febuary 21 14:20:00 2012 -0400
 */

// decrypt helper function
function decryptCharcode(n,start,end,offset)
{
	n = n + offset;
	if (offset > 0 && n > end)	{
		n = start + (n - end - 1);
	} else if (offset < 0 && n < start)	{
		n = end - (start - n - 1);
	}
	return String.fromCharCode(n);
}


// decrypt string
function decryptString(enc,offset)
{
	var dec = "";
	var len = enc.length;
	for(var i=0; i < len; i++)	{
		var n = enc.charCodeAt(i);
		if (n >= 0x2B && n <= 0x3A)	{
			dec += decryptCharcode(n,0x2B,0x3A,offset);	// 0-9 . , - + / :
		} else if (n >= 0x40 && n <= 0x5A)	{
			dec += decryptCharcode(n,0x40,0x5A,offset);	// A-Z @
		} else if (n >= 0x61 && n <= 0x7A)	{
			dec += decryptCharcode(n,0x61,0x7A,offset);	// a-z
		} else {
			dec += enc.charAt(i);
		}
	}
	return dec;
}


// decrypt spam-protected emails
function linkTo_UnCryptMailto(s)
{
	location.href = decryptString(s,-2);
}


jQuery(window).load(function(){
	
	if(jQuery("a.modalInput, a.modal, a.thickbox").length > 0)
	{	
		var html = '<div id="overlay-modal" class="overlay-modal"></div><div id="fade"></div>';
		
		jQuery("body").append(html);
		
		jQuery("a.modalInput, a.modal, a.thickbox").each(function(i) {
			var temp = jQuery(this).attr('href');
			var pattern = new RegExp('\\?', 'g');
 			var test = pattern.test(temp);
			if(test == false) temp += '?';
			temp += '&modal=true&w=600';
			
			jQuery(this).removeAttr('target');

			jQuery(this).click(function() {
								   
				var popID = jQuery(this).attr('rel'); //Trouver la pop-up correspondante
				var popURL = jQuery(this).attr('href'); //Retrouver la largeur dans le href
			
				//Récupérer les variables depuis le lien
				var popWidth = 600;
				var popHeight = 400;
				
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

			
				//Faire apparaitre la pop-up et ajouter le bouton de fermeture
				jQuery('#overlay-modal').fadeIn().css({
					'width': Number(popWidth)
					, 'height': Number(popHeight)
				})
				.prepend('');
				
				jQuery('#overlay-modal').html('<a href="#" class="close" title="Fermer"></a><iframe src="' + popURL + '" width="100%" height="100%" frameborder="0"></iframe>');
			
				//Récupération du margin, qui permettra de centrer la fenêtre - on ajuste de 80px en conformité avec le CSS
				var popMargTop = (jQuery('#overlay-modal').height() + 80) / 2;
				var popMargLeft = (jQuery('#overlay-modal').width() + 80) / 2;
			
				//On affecte le margin
				jQuery('#overlay-modal').css({
					'margin-top' : -popMargTop,
					'margin-left' : -popMargLeft
				});
			
				//Effet fade-in du fond opaque
				jQuery('body').append(''); //Ajout du fond opaque noir
				//Apparition du fond - .css({'filter' : 'alpha(opacity=80)'}) pour corriger les bogues de IE
				jQuery('#fade').css({'filter' : 'alpha(opacity=80)'}).fadeIn();
				
				jQuery('#overlay-modal').find('.close').click(function(){
					jQuery('#overlay-modal').fadeOut();
					jQuery('#overlay-modal').html('');
					jQuery('#fade').fadeOut();
					return false;
				});
			
				return false;
			});
		});		
	}
});



(function($){

	$.fn.reverseOrder = function() {
		return this.each(function() {
			$(this).prependTo( $(this).parent() );
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Code CNIL

//Cette fonction retourne la date d’expiration du cookie de consentement 
function getCookieExpireDate()
{ 
	var cookieTimeout = 34214400000;// Le nombre de millisecondes que font 13 mois 
	var date = new Date();
	date.setTime(date.getTime() + cookieTimeout);
	var expires = "; expires=" + date.toGMTString();
	return expires;
}

// Cette fonction est appelée pour afficher la demande de consentement
function askConsent(){
    var bodytag = document.getElementsByTagName('body')[0];
    var div = document.createElement('div');
    div.setAttribute('id','cookie-banner');
    // Le code HTML de la demande de consentement
    // Vous pouvez modifier le contenu ainsi que le style
	div.innerHTML = 'En continuant à naviguer, vous acceptez l\’utilisation de cookies pour réaliser des mesures d\'audience sur ce site. Vous pouvez vous y opposer en cliquant <a href="javascript:gaOptout()">ici</a> ou <a href="javascript:gaOptin()">fermer ce message</a>'; 

    bodytag.insertBefore(div,bodytag.firstChild); // Ajoute la bannière juste au début de la page 
    document.getElementsByTagName('body')[0].className += ' cookiebanner';           
}

// Fonction d'effacement des cookies   
function delCookie(name)
{
    path = ";path=" + "/";
    domain = ";domain=" + "." + document.location.hostname;
	var date = new Date();
	date.setTime(1200);  
    document.cookie = name + "=" + path + domain + "; expires=" + date.toGMTString();
}

// Efface tous les types de cookies utilisés par Google Analytics
function deleteAnalyticsCookies()
{
    var cookieNames = ["__utma","__utmb","__utmc","__utmz","_ga"]
    for(var i=0; i < cookieNames.length; i++)
	{
        delCookie(cookieNames[i])
	}
}

function gaOptin()
{
    document.cookie = gaNameCoookie + '=false;'+ getCookieExpireDate() +' ; path=/';       
    var div = document.getElementById('cookie-banner');
    // Ci dessous le code de la bannière affichée une fois que l'utilisateur s'est opposé au dépôt
    // Vous pouvez modifier le contenu et le style
    if(div!= null )
	{
		var parentElem = div.parentNode;
		parentElem.removeChild(div);
	}
    window[gaNameCoookie] = false;
}

// La fonction d'opt-out   
function gaOptout() {
    document.cookie = gaNameCoookie + '=true;'+ getCookieExpireDate() +' ; path=/';       
    var div = document.getElementById('cookie-banner');
    // Ci dessous le code de la bannière affichée une fois que l'utilisateur s'est opposé au dépôt
    // Vous pouvez modifier le contenu et le style
    if (div!= null) div.innerHTML = 'Vous vous êtes opposé \
    au dépôt de cookies de mesures d\'audience dans votre navigateur'
    window[gaNameCoookie] = true;
    deleteAnalyticsCookies();
}