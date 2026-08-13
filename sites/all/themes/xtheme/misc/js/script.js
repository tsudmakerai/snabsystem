/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

(function ($) {
  Drupal.behaviors.yandex_targets = {
    attach: function() {

      $('#xcono-call-me-form .form-submit').mousedown(function() {
        yaCounterXXXXXX.reachGoal('call_me');

     })

    }
  };
}(jQuery));



/* Content table wrappers */

(function ($) {
  Drupal.behaviors.ContentTableWrapper = {
    attach: function() {

      $('.pp-node-content #description .table').wrap('<div class="table-wrapper"></div>');

    }
  };
}(jQuery));

 /* Get price form disable if one of contacts empty */
(function ($) {
  Drupal.behaviors.GetPriceFormValidate = {
    attach: function() {
      $("#xcono-get-quote-form input[type=submit]").attr("disabled","disabled");

      $("#xcono-get-quote-form").keyup(function() {
        var $submit = $("#xcono-get-quote-form input[type=submit]");

        if (($("#xcono-get-quote-form #edit-phone-number").val().length == 0) && ($("#xcono-get-quote-form #edit-email").val().length == 0)) {
          $submit.attr("disabled","disabled");
          $submit.attr("value","Укажите контакты");
        } else {
          $submit.removeAttr("disabled");
          $submit.attr("value","Отправить запрос");
        }
      });
    }
  };
}(jQuery));

/* Colapsible product table */

(function ($) {
  Drupal.behaviors.CloseButton = {
    attach: function() {
      $('.close').click(
        function () {
          var data_close = $(this).attr('data-close');
          // var data_remove = $(this).attr('data-remove');
          if (data_close != '') {
            $('.' + data_close).fadeOut();
          }

        }
      );
    }
  };
}(jQuery));

(function ($) {
  Drupal.behaviors.ShowButton = {
    attach: function() {
      $('.open').click(
        function () {
          var data_open = $(this).attr('data-open');
          if (data_open != '') {
            $('.' + data_open).fadeIn();
          }
        }
      );
    }
  };
}(jQuery));

(function ($) {
  Drupal.behaviors.AjaxMenuRemoveItem = {
    attach: function() {
      $('.ajax-menu-item .close').click(
        function () {
          $('.ajax-menu-item').addClass('hide');
          $('.pp-menu-ajax-pane .active').removeClass('active');
        }
      );
    }
  };
}(jQuery));

(function ($) {
  Drupal.behaviors.AjaxMenuAutoHeightItem = {
    attach: function() {
      $('.auto-height').autoHeight();
      $(window).resize(function() {
        $('.auto-height').autoHeight();
      });
    }
  };
}(jQuery));

(function($){
   $.fn.autoHeight = function() {
      var donor = this.attr('auto-height');
      var height = $('.' + donor).height();

      if (donor != '' && height != '') {
        this.css('height',height  + 'px');
      }
   };
})( jQuery );


(function ($) {
  Drupal.behaviors.ToggleAdminTabs = {
    attach: function() {
      $('.pp-tabs i').click(function () {
          $('.pp-tabs').toggleClass('hide-tabs');
      });
    }
  };
}(jQuery));


(function ($) {
  Drupal.behaviors.MySnabSystemLink = {
    attach: function() {
      $(window).load(function() {
        $('.pp-menu-ajax-pane').append('<a href="http://my.snabsystem.ru" class="login-link">Личный кабинет</a>');
        $('.view-testimonial-block .view-content').append('<div class="view-footer"><div class="inner"><a href="/testimonials">Все отзывы</a></div></div>');
      });
    }
  };
}(jQuery));

/*
(function ($) {
  Drupal.behaviors.OrderBlockAffix = {
    attach: function() {

	    $(window).ready(function() {



		    $('.affixed').width($('.affixed').parent().width());

			$('.affixed').affix({
			    offset: {
				  top: 334,
				  bottom: 670
				}
			});
		});


		$(window).resize(function () {
          $('.affixed').width($('.affixed').parent().width());
        });

    }
  };
}(jQuery));
*/
(function ($) {
  Drupal.behaviors.OrderBlockAffix = {
    attach: function() {

	  // Affix sidebar
    $('.node-type-product .r-rside .r-rside-inner').addClass('affixed');
		$('.node-type-product .r-rside .affixed').affix({
		  offset: {
		    top: 203,
		    bottom: 670
		  }
		});

    }
  };
}(jQuery));

(function ($) {
  Drupal.behaviors.FrontCarouselStart = {
    attach: function() {
      $(document).ready(function() {
        $('.pp-front-slideshow .carousel').carousel({
          interval: 5000
        })
      });
    }
  };
}(jQuery));


(function ($) {
  Drupal.behaviors.PromoOutOfStock = {
    attach: function() {
      $(window).load(function() {

		$('.out-of-stock').addClass('promo-out-of-stock');
		$('.out-of-stock .message').load('http://snabsystem.ru/sites/all/themes/xtheme/templates/out-of-stock.html', function() {
		  $('.out-of-stock .message').prepend('<h3>' + $('h1').text() + ' нет в наличии. Подобрать аналог?</h3>');
		  $('.out-of-stock a').removeClass('hide');
		});

	    $('.out-of-stock a').click(function (event) {

		  $('html, body').animate({
			scrollTop: $(".tab-analogs").offset().top
		  }, 1000);

		  $('a.tab-analogs').click();

        });

	  });
    }
  };
}(jQuery));

(function ($) {
    Drupal.behaviors.requestsTableFilter = {
        attach: function() {
            var priceList = $( "#price_list" ).find( "tr" );
            $("#priceListSearchInput").on("keyup", function() {
                var value = $(this).val().toLowerCase();
                value == "" ? $("#price_list h3").show() :  $("#price_list h3").hide();
                $("#price_list tr").each(function(index) {
                        $row = $(this);
                        var id = $row.find("td.title").text().toLowerCase();

                        if (id.indexOf(value) < 0) {
                            $row.hide();
                        }
                        else {
                            $row.show();
                        }
                });
            });
        }
    };
}(jQuery));

(function ($) {
    Drupal.behaviors.ToggleMenuTabs = {
        attach: function() {
            $('.pp-menu-ajax-pane .use-ajax').click(function (e) {
                var paneKey = $(this).attr('data-item');
                $(this).find('span').remove();
                $(this).replaceWith('<a class="menu-ajax-link ajax-loaded" href="#" data-item="' + paneKey + '">' + $(this).text() + '<span> ▼</span></a>');
                $('.ajax-menu-item').addClass('hide');
                $('.ajax-menu-item.item-' + paneKey).removeClass('hide');
            });

            $('a.ajax-loaded').on('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                var paneKey = $(this).attr('data-item');

                $('.pp-menu-ajax-pane a').removeClass('active');


                if($('.ajax-menu-item.item-' + paneKey).hasClass('hide')) {
                    $(this).addClass('active');
                    $('.ajax-menu-item').addClass('hide');
                    $('.ajax-menu-item.item-' + paneKey).removeClass('hide');
                }
                else {
                    $('.ajax-menu-item.item-' + paneKey).addClass('hide');
                }

            });
        }
    };
}(jQuery));
