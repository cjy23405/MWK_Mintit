(function ($) {
  var userAgent = navigator.userAgent;
  var userAgentCheck = {
    ieMode: document.documentMode,
    isIos: Boolean(userAgent.match(/iPod|iPhone|iPad/)),
    isAndroid: Boolean(userAgent.match(/Android/)),
  };
  if (userAgent.match(/Edge/gi)) {
    userAgentCheck.ieMode = 'edge';
  }
  userAgentCheck.androidVersion = (function () {
    if (userAgentCheck.isAndroid) {
      try {
        var match = userAgent.match(/Android ([0-9]+\.[0-9]+(\.[0-9]+)*)/);
        return match[1];
      } catch (e) {
        console.log(e);
      }
    }
  })();

  // min 포함 max 불포함 랜덤 정수
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // 랜덤 문자열
  var hashCodes = [];
  function uiGetHashCode(length) {
    var string = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    var stringLength = string.length;

    length = typeof length === 'number' && length > 0 ? length : 10;

    function getCode(length) {
      var code = '';
      for (var i = 0; i < length; i++) {
        code += string[getRandomInt(0, stringLength)];
      }
      if (hashCodes.indexOf(code) > -1) {
        code = getCode(length);
      }
      return code;
    }

    result = getCode(length);
    hashCodes.push(result);

    return result;
  }

  // cookie
  uiJSCookie = {
    set: function (cname, cvalue, exdays) {
      /*
        cname : string : 이름(필수)
        cvalue : string : 값(필수)
        exdays : number : 기간(선택) [1 = 1일] - 생략 가능 없으면 사이트를 벗어 날 때 까지만 유지
      */
      var domain = document.domain;
      var expires = '';
      if (exdays) {
        var d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        expires = 'expires=' + d.toUTCString() + ';';
      }
      document.cookie = cname + '=' + cvalue + ';' + expires + 'path=/;domain=' + domain;
    },
    get: function (cname) {
      var name = cname + '=';
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return '';
    },
  };

  // common
  var $win = $(window);
  var $doc = $(document);

  // simplebar
  // https://grsmto.github.io/simplebar/
  // init ex: $(element).simplebar({/* customOptions */});
  // method ex: $(element).data('simplebar').recalculate();
  $.fn.simplebar = function (customOption) {
    var defaultOption = {
      //
    };

    this.each(function () {
      var option = $.extend({}, defaultOption, customOption);
      var $this = $(this);

      if ($this.data('simplebar') || !$.isFunction(window.SimpleBar)) return;

      if ($.isFunction(window.SimpleBar)) {
        if (userAgentCheck.ieMode <= 10) {
          $this.css('overflow', 'auto');
        } else {
          var simplebar = new SimpleBar($this.get(0), option);
          $this.data('simplebar', simplebar);
        }
      }
    });

    return $(this);
  };

  // swiperSet
  // https://github.com/nolimits4web/swiper/blob/Swiper5/API.md
  $.fn.swiperSet = function (customOption) {
    var defaultOption = {
      customClass: null,
      appendController: null,
      pageControl: false,
      nextControl: false,
      prevControl: false,
      scrollbarControl: false,
      playControl: false,
      pauseControl: false,
    };

    this.each(function () {
      var option = $.extend({}, defaultOption, customOption);
      var $this = $(this);

      if ($this.data('swiper') || !$.isFunction(window.Swiper)) return;

      var $items = $this.children();

      if (!$this.parent('.swiper-container').length) {
        $this.wrap('<div class="swiper-object"><div class="swiper-container"></div></div>');
      }
      $this.addClass('swiper-wrapper');
      $items.addClass('swiper-slide').each(function (i) {
        $(this).attr('data-swiper-set-slide-index', i);
      });

      var $container = $this.parent('.swiper-container');
      var $wrap = $container.parent('.swiper-object');
      var $appendController = $wrap;
      var length = $items.length;

      if (typeof option.customClass === 'string') {
        $wrap.addClass(option.customClass);
      }

      option.pagination = option.pagination || {};
      option.navigation = option.navigation || {};
      option.scrollbar = option.scrollbar || {};

      option.autoplay = length > 1 && option.autoplay ? option.autoplay : false;
      option.loop = length > 1 && option.loop ? option.loop : false;

      if (option.appendController) {
        $appendController = $(option.appendController);
      }

      if (length === 1) {
        $wrap.addClass('swiper-object-once');
      } else if (length <= 0) {
        $wrap.addClass('swiper-object-empty');
      }

      if (option.pageControl) {
        $appendController.append('<div class="swiper-pagination"></div>');
        option.pagination.el = $appendController.find('.swiper-pagination').get(0);
      }
      if (option.nextControl) {
        $appendController.append('<button type="button" class="swiper-button-next"><span class="swiper-button-next-text">next</span></button>');
        option.navigation.nextEl = $appendController.find('.swiper-button-next').get(0);
      }
      if (option.prevControl) {
        $appendController.append('<button type="button" class="swiper-button-prev"><span class="swiper-button-prev-text">prev</span></button>');
        option.navigation.prevEl = $appendController.find('.swiper-button-prev').get(0);
      }
      if (option.scrollbarControl) {
        $appendController.append('<div class="swiper-scrollbar"></div>');
        option.scrollbar.el = $appendController.find('.swiper-scrollbar').get(0);
      }
      if (option.playControl) {
        $appendController.append('<button type="button" class="swiper-button-play"><span class="swiper-button-play-text">play</span></button>');
        option.playButton = $appendController.find('.swiper-button-play').get(0);
      }
      if (option.pauseControl) {
        $appendController.append('<button type="button" class="swiper-button-pause"><span class="swiper-button-pause-text">pause</span></button>');
        option.pauseButton = $appendController.find('.swiper-button-pause').get(0);
      }
      if (option.autoplay && option.playControl) {
        $(option.playButton).addClass('active');
      } else if (!option.autoplay && option.pauseControl) {
        $(option.pauseButton).addClass('active');
      }

      if ($.isFunction(window.Swiper)) {
        var swiper = new Swiper($container.get(0), option);
        $this.data('swiper', swiper);

        if (option.playControl) {
          $(option.playButton).on('click.swiperSet', function () {
            swiper.autoplay.start();
          });
        }
        if (option.pauseControl) {
          $(option.pauseButton).on('click.swiperSet', function () {
            swiper.autoplay.stop();
          });
        }
        swiper.on('autoplayStart', function () {
          if (option.playControl) {
            $(option.playButton).addClass('active');
          }
          if (option.pauseControl) {
            $(option.pauseButton).removeClass('active');
          }
        });
        swiper.on('autoplayStop', function () {
          if (option.playControl) {
            $(option.playButton).removeClass('active');
          }
          if (option.pauseControl) {
            $(option.pauseButton).addClass('active');
          }
        });
      }
    });
  };

  // UiAccordion
  var UiAccordion = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      opened: 'js-accordion-opened',
    };
    _.options = option;
    _.wrap = $wrap;
    _.init();
    _.on();
  };
  $.extend(UiAccordion.prototype, {
    init: function () {
      var _ = this;

      _.hashCode = uiGetHashCode();
      _.getElements();

      if (_.layer.length && _.item.length && _.item.filter('[data-initial-open]').length) {
        _.item.each(function () {
          var $this = $(this);
          if ($this.attr('data-initial-open') === 'true') {
            _.open($this, 0);
          }
        });
      }

      _.options.onInit();
    },
    getElements: function () {
      var _ = this;

      if (_.options.opener) {
        if (typeof _.options.opener === 'string') {
          _.opener = _.wrap.find(_.options.opener);
        } else {
          _.opener = _.options.opener;
        }
      }

      if (_.options.layer) {
        if (typeof _.options.layer === 'string') {
          _.layer = _.wrap.find(_.options.layer);
        } else {
          _.layer = _.options.layer;
        }
      }

      if (_.options.item) {
        if (typeof _.options.item === 'string') {
          _.item = _.wrap.find(_.options.item);
        } else {
          _.item = _.options.item;
        }
      }
    },
    on: function () {
      var _ = this;

      if (_.opener.length && _.layer.length) {
        _.opener.on('click.uiAccordion' + _.hashCode, function () {
          _.toggle($(this).closest(_.item));
        });

        $doc
          .on('keydown.uiAccordion' + _.hashCode, function (e) {
            if (e.keyCode === 9 && _.blockTabKey) {
              e.preventDefault();
            }
          })
          .on('focusin.uiAccordion' + _.hashCode, function (e) {
            var $item = ($(e.target).is(_.layer) || $(e.target).closest(_.layer).length) && $(e.target).closest(_.item);

            if ($item) {
              _.open($item, 0);
            }
          });
      }
    },
    off: function () {
      var _ = this;

      if (_.opener.length && _.layer.length) {
        _.opener.off('click.uiAccordion' + _.hashCode);
        $doc.off('keydown.uiAccordion' + _.hashCode).off('focusin.uiAccordion' + _.hashCode);
      }
    },
    toggle: function ($item) {
      var _ = this;

      if ($item.hasClass(_.className.opened)) {
        _.close($item);
      } else {
        _.open($item);
      }
    },
    open: function ($item, speed) {
      var _ = this;
      var $layer = null;
      var beforeH = 0;
      var afterH = 0;
      speed = speed instanceof Number ? Number(speed) : typeof speed === 'number' ? speed : _.options.speed;

      if (!$item.hasClass(_.className.opened)) {
        $layer = $item.find(_.layer);
        $layer.stop().css('display', 'block');
        beforeH = $layer.height();
        $layer.css('height', 'auto');
        $item.addClass(_.className.opened);
        afterH = $layer.height();
        if (beforeH === afterH) {
          speed = 0;
        }
        $layer
          .css('height', beforeH)
          .animate(
            {
              height: afterH,
            },
            speed,
            function () {
              $layer
                .css({
                  height: 'auto',
                })
                .trigger('uiAccordionAfterOpened');
            }
          )
          .trigger('uiAccordionOpened', [beforeH, afterH]);

        if (_.options.once) {
          _.item.not($item).each(function () {
            _.close($(this));
          });
        }
      }
    },
    close: function ($item, speed) {
      var _ = this;
      var $layer = null;
      var beforeH = 0;
      var afterH = 0;
      speed = speed instanceof Number ? Number(speed) : typeof speed === 'number' ? speed : _.options.speed;

      if ($item.hasClass(_.className.opened)) {
        _.blockTabKey = true;
        $layer = $item.find(_.layer);
        $layer.stop().css('display', 'block');
        beforeH = $layer.height();
        $layer.css('height', '');
        $item.removeClass(_.className.opened);
        afterH = $layer.height();
        if (beforeH === afterH) {
          speed = 0;
        }
        $layer
          .css('height', beforeH)
          .animate(
            {
              height: afterH,
            },
            speed,
            function () {
              $layer
                .css({
                  display: '',
                  height: '',
                })
                .trigger('uiAccordionAfterClosed');
              _.blockTabKey = false;
            }
          )
          .trigger('uiAccordionClosed', [beforeH, afterH]);
      }
    },
    allClose: function () {
      var _ = this;

      _.item.each(function () {
        _.close($(this));
      });
    },
    update: function (newOptions) {
      var _ = this;

      _.off();
      $.extend(_.options, newOptions);
      _.getElements();
      _.on();
    },
  });
  $.fn.uiAccordion = function (custom) {
    var defaultOption = {
      item: null,
      opener: null,
      layer: null,
      once: false,
      speed: 500,
      onInit: function () {},
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiAccordion = this.uiAccordion;

      if (typeof custom === 'object' && !uiAccordion) {
        options = $.extend({}, defaultOption, custom);
        this.uiAccordion = new UiAccordion(this, options);
      } else if (typeof custom === 'string' && uiAccordion) {
        switch (custom) {
          case 'allClose':
            uiAccordion.allClose();
            break;
          case 'close':
            uiAccordion.close(other[0], other[1]);
            break;
          case 'open':
            uiAccordion.open(other[0], other[1]);
            break;
          case 'update':
            uiAccordion.update(other[0]);
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // UiDropDown
  var UiDropDown = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      opened: 'js-dropdown-opened',
      top: 'js-dropdown-top',
      bottom: 'js-dropdown-bottom',
    };
    _.css = {
      hide: {
        position: 'absolute',
        top: '',
        left: '',
        bottom: '',
        marginLeft: '',
        display: 'none',
      },
      show: {
        position: 'absolute',
        top: '100%',
        left: '0',
        display: 'block',
      },
    };
    _.options = option;
    _.wrap = $wrap;
    _.init();
    _.on();
  };
  $.extend(UiDropDown.prototype, {
    init: function () {
      var _ = this;

      if (_.options.opener) {
        if (typeof _.options.opener === 'string') {
          _.opener = _.wrap.find(_.options.opener).eq(0);
        } else {
          _.opener = _.options.opener;
        }
      }

      if (_.options.layer) {
        if (typeof _.options.layer === 'string') {
          _.layer = _.wrap.find(_.options.layer).eq(0);
        } else {
          _.layer = _.options.layer;
        }
        _.layer.css(_.css.hide);
      }

      if (_.layer.length) {
        _.wrap.css('position', 'relative');
      }

      _.options.init();
    },
    on: function () {
      var _ = this;

      if (_.layer.length) {
        _.hashCode = uiGetHashCode();

        if (_.opener && _.opener.length && _.options.event === 'click') {
          _.opener.on('click.uiDropDown' + _.hashCode, function () {
            _.toggle();
          });
          $doc.on('click.uiDropDown' + _.hashCode, function (e) {
            var check = $(e.target).is(_.wrap) || $(e.target).closest(_.wrap).length;

            if (!check) {
              _.close();
            }
          });
          $doc.on('focusin.uiDropDown' + _.hashCode, function (e) {
            var check = $(e.target).is(_.layer) || $(e.target).closest(_.layer).length || ($(e.target).is(_.opener) && _.wrap.hasClass(_.className.opened));

            if (check) {
              _.open();
            } else {
              _.close();
            }
          });
        } else if (_.options.event === 'hover') {
          _.wrap
            .on('mouseenter.uiDropDown' + _.hashCode, function () {
              _.open();
            })
            .on('mouseleave.uiDropDown' + _.hashCode, function () {
              _.close();
            });
          $doc.on('focusin.uiDropDown' + _.hashCode, function (e) {
            var check = $(e.target).is(_.wrap) || $(e.target).closest(_.wrap).length || ($(e.target).is(_.opener) && _.wrap.hasClass(_.className.opened));

            if (check) {
              _.open();
            } else {
              _.close();
            }
          });
        }
        $win.on('resize.uiDropDown' + _.hashCode, function () {
          _.update();
        });
      }
    },
    update: function () {
      var _ = this;
      var docW = 0;
      var winH = 0;
      var wrapT = 0;
      var scrollTop = 0;
      var layerT = 0;
      var layerL = 0;
      var layerH = 0;
      var layerW = 0;
      var $overflow = null;
      var overflowT = 0;
      var overflowB = 0;
      var overflowL = 0;
      var overflowR = 0;
      var style = {
        marginTop: _.options.marginTop,
        marginLeft: _.options.marginLeft,
      };

      if (_.wrap.hasClass(_.className.opened)) {
        _.layer.css({
          top: '',
          left: '-999999px',
          right: '',
          bottom: '',
          marginLeft: '',
        });
        _.wrap.removeClass(_.className.top + ' ' + _.className.bottom);

        docW = $doc.width();
        docH = $doc.height();
        winW = $win.width();
        winH = $win.height();
        scrollLeft = $win.scrollLeft();
        scrollTop = $win.scrollTop();

        _.layer.css(_.css.show);

        wrapT = _.wrap.offset().top;
        layerT = _.layer.offset().top;
        layerL = _.layer.offset().left;
        layerH = _.layer.outerHeight() + _.options.marginTop + _.options.marginBottom;
        layerW = _.layer.outerWidth() + _.options.marginLeft + _.options.marginRight;

        _.wrap.parents().each(function () {
          var $this = $(this);
          if ($this.css('overflow').match(/hidden|auto|scroll/) && !$this.is('html')) {
            $overflow = $this;
            return false;
          }
        });

        if ($overflow !== null && $overflow.length) {
          overflowT = $overflow.offset().top;
          overflowB = docH - (overflowT + $overflow.height());
          overflowL = $overflow.offset().left;
          overflowR = docW - (overflowL + $overflow.width());
        }

        if (winH - overflowB < layerT + layerH - scrollTop && wrapT - layerH - scrollTop - overflowT >= 0) {
          _.wrap.addClass(_.className.top);
          _.layer.css({
            top: 'auto',
            bottom: '100%',
          });
          style.marginTop = 0;
          style.marginBottom = _.options.marginBottom;
        } else {
          _.wrap.addClass(_.className.bottom);
        }

        if (docW - overflowR < layerL + layerW && docW - overflowL - overflowR - layerW > 0) {
          style.marginLeft = -Math.ceil(layerL + layerW - (docW - overflowR) - _.options.marginLeft);
        }

        _.layer.css(style);
      }
    },
    toggle: function () {
      var _ = this;

      if (_.wrap.hasClass(_.className.opened)) {
        _.close();
      } else {
        _.open();
      }
    },
    open: function () {
      var _ = this;

      if (!_.wrap.hasClass(_.className.opened)) {
        _.wrap.addClass(_.className.opened).css('z-index', '1200');
        _.layer.css(_.css.show);
        _.update();
        _.layer.trigger('uiDropDownOpened');
      }
    },
    close: function () {
      var _ = this;

      if (_.wrap.hasClass(_.className.opened)) {
        _.wrap.removeClass(_.className.opened + ' ' + _.className.top + ' ' + _.className.bottom).css('z-index', '');
        _.layer.css(_.css.hide).trigger('uiDropDownClosed');
      }
    },
  });
  $.fn.uiDropDown = function (custom) {
    var defaultOption = {
      opener: null,
      layer: null,
      event: 'click',
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      init: function () {},
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiDropDown = this.uiDropDown;

      if (typeof custom === 'object' && !uiDropDown) {
        options = $.extend({}, defaultOption, custom);
        this.uiDropDown = new UiDropDown(this, options);
      } else if (typeof custom === 'string' && uiDropDown) {
        switch (custom) {
          case 'close':
            uiDropDown.close();
            break;
          case 'open':
            uiDropDown.open();
            break;
          case 'update':
            uiDropDown.update();
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // UiPieBarChart
  var UiPieBarChart = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      wrap: 'js-pie-bar-chart',
      chart: 'js-pie-bar-chart__chart',
      backgroundBar: 'js-pie-bar-chart__background',
      activeBar: 'js-pie-bar-chart__bar',
    };
    _.options = option;
    _.wrap = $wrap;
    _.init();
    _.on();
  };
  $.extend(UiPieBarChart.prototype, {
    init: function () {
      var _ = this;

      _.wrap
        .addClass(_.className.wrap)
        .css('position', 'relative')
        .append(
          '<svg class="' +
            _.className.chart +
            '" style="position: absolute; top: 0; left: 0;">' +
            '<circle class="' +
            _.className.backgroundBar +
            '" fill="transparent"></circle>' +
            '<circle class="' +
            _.className.activeBar +
            '" fill="transparent"></circle>' +
            '</svg>'
        );

      _.chart = _.wrap.find('.' + _.className.chart);
      _.backgroundBar = _.wrap.find('.' + _.className.backgroundBar);
      _.activeBar = _.wrap.find('.' + _.className.activeBar);
      _.hashCode = uiGetHashCode();

      _.calculate();
      _.resize();
      _.animate();

      _.options.onInit();
    },
    calculate: function () {
      var _ = this;

      _.radius = _.options.diameter / 2;
      _.innerRadius = _.radius - _.options.strokeWidth / 2;
      _.circumference = _.innerRadius * 2 * Math.PI;
      _.valueCircumference = _.circumference * (1 - _.options.value);
    },
    resize: function () {
      var _ = this;
      _.calculate();
      var wrapW = _.wrap.width();
      var wrapH = _.wrap.height();
      var diameter = _.options.diameter;
      var viewBoxW = diameter;
      var viewBoxH = diameter;
      var x = _.radius;
      var y = _.radius;

      if (!_.options.ratioResize) {
        viewBoxW = wrapW;
        viewBoxH = wrapH;
        x = wrapW / 2;
        y = wrapH / 2;
      }

      _.chart
        .attr('width', wrapW)
        .attr('height', wrapH)
        .attr('viewBox', '0 0 ' + viewBoxW + ' ' + viewBoxH);

      _.backgroundBar.attr('cx', x).attr('cy', y).attr('r', _.innerRadius).attr('stroke', _.options.backgroundStrokeColor).attr('stroke-width', _.options.strokeWidth);

      _.activeBar
        .stop()
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', _.innerRadius)
        .attr('stroke', _.options.strokeColor)
        .attr('stroke-width', _.options.strokeWidth)
        .attr('stroke-linecap', _.options.strokeLinecap)
        .attr('stroke-dasharray', _.circumference)
        .attr('stroke-dashoffset', _.valueCircumference);
    },
    animate: function (duration) {
      var _ = this;
      var duration = (function () {
        if (typeof duration === 'number' || duration instanceof Number) {
          return Number(duration);
        } else {
          return Number(_.options.duration);
        }
      })();

      _.activeBar
        .stop()
        .prop('valueCircumference', _.circumference)
        .animate(
          {
            valueCircumference: _.valueCircumference,
          },
          {
            duration: duration,
            step: function (now) {
              _.activeBar.attr('stroke-dashoffset', now);
            },
          }
        );
    },
    on: function () {
      var _ = this;

      $win.on('resize.uiPieBarChart' + _.hashCode, function () {
        if (_.options.resize) {
          _.resize();
        }
      });
    },
    changeOptions: function (newOptions) {
      var _ = this;

      $.extend(_.options, newOptions);
    },
  });
  $.fn.uiPieBarChart = function (custom) {
    var defaultOption = {
      resize: true,
      diameter: 200,
      backgroundStrokeColor: '#eee',
      strokeColor: '#000',
      strokeLinecap: 'butt',
      strokeWidth: 10,
      value: 0,
      duration: 800,
      ratioResize: true,
      onInit: function () {},
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiPieBarChart = this.uiPieBarChart;

      if (typeof custom === 'object' && !uiPieBarChart) {
        options = $.extend({}, defaultOption, custom);
        this.uiPieBarChart = new UiPieBarChart(this, options);
      } else if (typeof custom === 'string' && uiPieBarChart) {
        switch (custom) {
          case 'resize':
            uiPieBarChart.resize();
            break;
          case 'changeOptions':
            uiPieBarChart.changeOptions(other[0]);
            break;
          case 'animate':
            uiPieBarChart.animate(other[0]);
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // UiTabPanel
  var UiTabPanel = function (target, option) {
    var _ = this;
    var $wrap = $(target).eq(0);

    _.className = {
      active: 'js-tabpanel-active',
      opened: 'js-tabpanel-opened',
    };
    _.options = option;
    _.wrap = $wrap;
    _.crrTarget = '';
    _.init();
    _.on();
  };
  $.extend(UiTabPanel.prototype, {
    init: function () {
      var _ = this;
      var initialOpen = typeof _.options.initialOpen === 'string' && _.options.initialOpen;

      if (_.options.opener) {
        if (typeof _.options.opener === 'string') {
          _.opener = _.wrap.find(_.options.opener);
        } else {
          _.opener = _.options.opener;
        }
      }

      if (_.options.item) {
        if (typeof _.options.item === 'string') {
          _.item = _.wrap.find(_.options.item);
        } else {
          _.item = _.options.item;
        }
      }

      if (_.opener.length && _.item.length) {
        _.hashCode = uiGetHashCode();

        if (!initialOpen) {
          initialOpen = _.opener.eq(0).attr('data-tab-open');
        }

        if (_.options.a11y) {
          _.initA11y();
        }

        _.open(initialOpen, false);
      }
    },
    on: function () {
      var _ = this;
      var openerFocus = false;
      var $focusOpener = null;

      if (_.opener.length && _.item.length) {
        _.opener.on('click.uiTabPanel' + _.hashCode, function (e) {
          var $this = $(this);
          var target = $this.attr('data-tab-open');
          _.open(target);

          if ($this.is('a')) {
            e.preventDefault();
          }
        });
        $doc.on('focusin.uiTabPanel' + _.hashCode, function (e) {
          var $panel = ($(e.target).is(_.item) && $(e.target)) || ($(e.target).closest(_.item).length && $(e.target).closest(_.item));

          if ($panel && !$panel.is(':hidden')) {
            _.open($panel.attr('data-tab'));
          }
        });
        _.opener
          .on('focus.uiTabPanel' + _.hashCode, function () {
            openerFocus = true;
            $focusOpener = $(this);
          })
          .on('blur.uiTabPanel' + _.hashCode, function () {
            openerFocus = false;
            $focusOpener = null;
          });
        $doc
          .on('keydown.uiTabPanel' + _.hashCode, function (e) {
            var keyCode = e.keyCode;
            if (_.options.a11y && openerFocus) {
              if ([13, 32, 35, 36, 37, 38, 39, 40].indexOf(keyCode) > -1) {
                e.preventDefault();
              }
            }
          })
          .on('keyup.uiTabPanel' + _.hashCode, function (e) {
            var keyCode = e.keyCode;
            var target = $focusOpener && $focusOpener.attr('data-tab-open');
            if (_.options.a11y && openerFocus) {
              switch (keyCode) {
                case 35:
                  _.goEnd();
                  break;
                case 36:
                  _.goStart();
                  break;
                case 37:
                  _.prev();
                  break;
                case 38:
                  _.prev();
                  break;
                case 39:
                  _.next();
                  break;
                case 40:
                  _.next();
                  break;
                case 13:
                  _.open(target);
                  break;
                case 32:
                  _.open(target);
                  break;
                default:
                  break;
              }
            }
          });
      }
    },
    open: function (target, focus) {
      var _ = this;
      var $opener = _.opener.filter('[data-tab-open="' + target + '"]');
      var $panel = _.item.filter('[data-tab="' + target + '"]');

      if (!$panel.hasClass(_.className.opened)) {
        if (_.options.a11y) {
          _.setActiveA11y(target, focus);
        }

        _.crrTarget = target;
        _.opener.not($opener).removeClass(_.className.active);
        _.item.not($panel).removeClass(_.className.opened);
        $opener.addClass(_.className.active);
        $panel.addClass(_.className.opened).trigger('uiTabPanelChange');
      }
    },
    indexOpen: function (i) {
      var _ = this;
      var target = _.opener.eq(i).attr('data-tab-open');

      _.open(target);
    },
    next: function () {
      var _ = this;
      var length = _.opener.length;
      var i = _.opener.index(_.opener.filter('[data-tab-open="' + _.crrTarget + '"]')) + 1;
      if (i >= length) {
        i = 0;
      }
      _.indexOpen(i);
    },
    prev: function () {
      var _ = this;
      var length = _.opener.length;
      var i = _.opener.index(_.opener.filter('[data-tab-open="' + _.crrTarget + '"]')) - 1;
      if (i < 0) {
        i = length - 1;
      }
      _.indexOpen(i);
    },
    goStart: function () {
      var _ = this;
      _.indexOpen(0);
    },
    goEnd: function () {
      var _ = this;
      _.indexOpen(_.opener.length - 1);
    },
    initA11y: function () {
      var _ = this;

      _.opener.each(function () {
        var $this = $(this);
        var target = $this.attr('data-tab-open');

        $this
          .attr('role', 'tab')
          .attr('id', 'tabpanel-opener-' + target + '-' + _.hashCode)
          .attr('aria-controls', 'tabpanel-' + target + '-' + _.hashCode);
      });

      _.item.each(function () {
        var $this = $(this);
        var target = $this.attr('data-tab');

        $this
          .attr('role', 'tabpanel')
          .attr('id', 'tabpanel-' + target + '-' + _.hashCode)
          .attr('aria-labelledby', 'tabpanel-opener-' + target + '-' + _.hashCode);
      });

      _.wrap.attr('role', 'tablist');
    },
    setActiveA11y: function (target, focus) {
      var _ = this;

      focus = focus === false ? false : true;

      _.opener.each(function () {
        var $this = $(this);
        var crrTarget = $this.attr('data-tab-open');

        if (crrTarget === target) {
          $this.attr('tabindex', '0').attr('aria-selected', 'true');
          if (focus) {
            $this.focus();
          }
        } else {
          $this.attr('tabindex', '-1').attr('aria-selected', 'false');
        }
      });

      _.item.each(function () {
        var $this = $(this);
        var crrTarget = $this.attr('data-tab');

        if (crrTarget === target) {
          $this.removeAttr('hidden');
        } else {
          $this.attr('hidden', '');
        }
      });
    },
    addA11y: function () {
      var _ = this;

      if (!_.options.a11y) {
        _.options.a11y = true;
        _.initA11y();
        _.setActiveA11y(_.crrTarget);
      }
    },
    clearA11y: function () {
      var _ = this;

      if (_.options.a11y) {
        _.options.a11y = false;
        _.opener.removeAttr('role').removeAttr('id').removeAttr('aria-controls').removeAttr('tabindex').removeAttr('aria-selected');

        _.item.removeAttr('role').removeAttr('id').removeAttr('aria-labelledby').removeAttr('hidden');

        _.wrap.removeAttr('role');
      }
    },
  });
  $.fn.uiTabPanel = function (custom) {
    var defaultOption = {
      item: null,
      opener: null,
      initialOpen: null,
      a11y: false,
    };
    var other = [];

    custom = custom || {};

    $.each(arguments, function (i) {
      if (i > 0) {
        other.push(this);
      }
    });

    this.each(function () {
      var options = {};
      var uiTabPanel = this.uiTabPanel;

      if (typeof custom === 'object' && !uiTabPanel) {
        options = $.extend({}, defaultOption, custom);
        this.uiTabPanel = new UiTabPanel(this, options);
      } else if (typeof custom === 'string' && uiTabPanel) {
        switch (custom) {
          case 'addA11y':
            uiTabPanel.addA11y();
            break;
          case 'clearA11y':
            uiTabPanel.clearA11y();
            break;
          default:
            break;
        }
      }
    });

    return this;
  };

  // check scroll up, down
  var uiJSCheckScrollDirection = {
    preScrollTop: 0,
    direction: null,
    update: function () {
      var _ = uiJSCheckScrollDirection;
      var scrollTop = $win.scrollTop();
      if (_.preScrollTop < scrollTop) {
        _.direction = 'down';
      } else if (_.preScrollTop > scrollTop) {
        _.direction = 'up';
      } else {
        _.direction = null;
      }
      _.preScrollTop = scrollTop;
    },
  };

  // scrollbars width
  var scrollbarsWidth = {
    width: 0,
    set: function () {
      var _ = scrollbarsWidth;
      var $html = $('html');
      var $wrap = $('#wrap');
      $html.css('overflow', 'hidden');
      var beforeW = $wrap.width();
      $html.css('overflow', 'scroll');
      var afterW = $wrap.width();
      $html.css('overflow', '');
      _.width = beforeW - afterW;
    },
  };
  function checkScrollbars() {
    var $html = $('html');
    if (Boolean(scrollbarsWidth.width)) {
      $html.addClass('is-scrollbars-width');
    }
  }

  // scrollBlock
  var scrollBlock = {
    scrollTop: 0,
    scrollLeft: 0,
    className: {
      block: 'is-scroll-blocking',
    },
    block: function () {
      var _ = scrollBlock;
      var $html = $('html');
      var $wrap = $('#wrap');

      scrollBlock.scrollTop = $win.scrollTop();
      scrollBlock.scrollLeft = $win.scrollLeft();

      if (!$html.hasClass(_.className.block)) {
        $html.addClass(_.className.block);
        $win.scrollTop(0);
        $wrap.scrollTop(_.scrollTop);
        $win.scrollLeft(0);
        $wrap.scrollLeft(_.scrollLeft);
      }
    },
    clear: function () {
      var _ = scrollBlock;
      var $html = $('html');
      var $wrap = $('#wrap');

      if ($html.hasClass(_.className.block)) {
        $html.removeClass(_.className.block);
        $wrap.scrollTop(0);
        $win.scrollTop(_.scrollTop);
        $wrap.scrollLeft(0);
        $win.scrollLeft(_.scrollLeft);
      }
    },
  };
  window.uiJSScrollBlock = scrollBlock;

  // layer
  var uiLayer = {
    zIndex: 10000,
    open: function (target, opener, speed) {
      var _ = uiLayer;
      var $html = $('html');
      var $layer = $('[data-layer="' + target + '"]');
      var timer = null;
      var isScrollBlock = true;
      var isFocus = true;
      var speed = typeof speed === 'number' ? speed : 350;

      if ($layer.length && !$layer.hasClass('js-layer-opened')) {
        isScrollBlock = (function () {
          var val = $layer.data('scroll-block');
          if (typeof val === 'boolean' && !val) {
            return false;
          } else {
            return isScrollBlock;
          }
        })();
        isFocus = (function () {
          var val = $layer.data('focus');
          if (typeof val === 'boolean' && !val) {
            return false;
          } else {
            return isFocus;
          }
        })();

        _.zIndex++;
        $layer.trigger('layerBeforeOpened');
        $html.addClass('js-html-layer-opened js-html-layer-opened-' + target);
        $layer
          .stop()
          .removeClass('js-layer-closed')
          .css({
            display: 'block',
            zIndex: _.zIndex,
          })
          .animate(
            {
              opacity: 1,
            },
            speed,
            function () {
              $layer.trigger('layerAfterOpened');
            }
          )
          .attr('tabindex', '0')
          .data('layerIndex', $('.js-layer-opened').length);

        if (isFocus) {
          $layer.focus();
        }

        if (isScrollBlock) {
          scrollBlock.block();
        }

        if (Boolean(opener) && $(opener).length) {
          $layer.data('layerOpener', $(opener));
        }

        timer = setTimeout(function () {
          clearTimeout(timer);
          $layer.addClass('js-layer-opened').trigger('layerOpened');
        }, 0);
      }
    },
    close: function (target, speed) {
      var $html = $('html');
      var $layer = $('[data-layer="' + target + '"]');
      var timer = null;
      var speed = typeof speed === 'number' ? speed : 350;

      if ($layer.length && $layer.hasClass('js-layer-opened')) {
        $layer
          .trigger('layerBeforeClosed')
          .stop()
          .removeClass('js-layer-opened')
          .addClass('js-layer-closed')
          .css('display', 'block')
          .data('layerIndex', null)
          .animate(
            {
              opacity: 0,
            },
            speed,
            function () {
              var $opener = $layer.data('layerOpener');
              var $openedLayer = $('.js-layer-opened');
              var $openedLayerIsScrollBlock = $openedLayer.not(function () {
                var val = $(this).data('scroll-block');
                if (typeof val === 'boolean' && !val) {
                  return true;
                } else {
                  return false;
                }
              });
              var isScrollBlock = $html.hasClass(scrollBlock.className.block);

              $(this).css('display', 'none').removeClass('js-layer-closed');

              $html.removeClass('js-html-layer-closed-animate js-html-layer-opened-' + target);

              if (!$openedLayer.length) {
                $html.removeClass('js-html-layer-opened');
              }

              if (!$openedLayerIsScrollBlock.length && isScrollBlock) {
                scrollBlock.clear();
              }

              if ($opener && $opener.length) {
                $opener.focus();
                $layer.data('layerOpener', null);
              }

              $layer.trigger('layerAfterClosed');
            }
          )
          .trigger('layerClosed');

        timer = setTimeout(function () {
          clearTimeout(timer);
          $html.addClass('js-html-layer-closed-animate');
        }, 0);
      }
    },
    checkFocus: function (e) {
      var $layer = $('[data-layer]')
        .not(':hidden')
        .not(function () {
          var val = $(this).data('scroll-block');
          if (typeof val === 'boolean' && !val) {
            return true;
          } else {
            return false;
          }
        });
      var $target = $(e.target);
      var $closest = $target.closest('[data-layer]');
      var lastIndex = (function () {
        var index = 0;
        $layer.each(function () {
          var crrI = $(this).data('layerIndex');
          if (crrI > index) {
            index = crrI;
          }
        });
        return index;
      })();
      var checkLayer = $layer.length && !($target.is($layer) && $target.data('layerIndex') === lastIndex) && !($closest.length && $closest.is($layer) && $closest.data('layerIndex') === lastIndex);

      if (checkLayer) {
        $layer
          .filter(function () {
            return $(this).data('layerIndex') === lastIndex;
          })
          .focus();
      }
    },
  };
  window.uiJSLayer = uiLayer;

  $doc
    .on('focusin.uiLayer', uiLayer.checkFocus)
    .on('click.uiLayer', '[data-role="layerClose"]', function () {
      var $this = $(this);
      var $layer = $this.closest('[data-layer]');
      if ($layer.length) {
        uiLayer.close($layer.attr('data-layer'));
      }
    })
    .on('click.uiLayer', '[data-layer-open]', function (e) {
      var $this = $(this);
      var layer = $this.attr('data-layer-open');
      var $layer = $('[data-layer="' + layer + '"]');
      if ($layer.length) {
        uiLayer.open(layer);
        $layer.data('layerOpener', $this);
      }
      e.preventDefault();
    })
    .on('layerAfterOpened.uiLayer', '[data-layer-timer-close]', function () {
      var $this = $(this);
      var layer = $this.attr('data-layer');
      var delay = Number($this.attr('data-layer-timer-close'));
      var timer = setTimeout(function () {
        uiLayer.close(layer);
        clearTimeout(timer);
      }, delay);
      $this.data('layer-timer', timer);
    })
    .on('layerBeforeClosed.uiLayer', '[data-layer-timer-close]', function () {
      var $this = $(this);
      var timer = $this.data('layer-timer');
      clearTimeout(timer);
    });

  // input disabled class
  function checkDisabledClass() {
    var $inputs = $('.ui-input, .ui-select');
    $inputs.each(function () {
      var $this = $(this);
      var $parent = $this.parent('.ui-input-block, .ui-select-block');
      var className = 'is-disabled';
      var isDisabled = $this.is(':disabled');
      var hasClass = $parent.hasClass(className);

      if (isDisabled && !hasClass) {
        $parent.addClass(className);
      } else if (!isDisabled && hasClass) {
        $parent.removeClass(className);
      }
    });
  }

  // check for mobile or pc
  var uiViewType = 'pc';
  function checkForMobileOrPC() {
    var $html = $('html');
    var outlineColor = $html.css('outline-color');

    if (outlineColor === 'rgba(0, 0, 0, 0)') {
      uiViewType = 'pc';
    } else if (outlineColor === 'rgba(1, 1, 1, 0)') {
      uiViewType = 'mobile';
    }
    window.uiViewType = uiViewType;
  }
  window.uiViewType = uiViewType;

  // pie chart
  var pieChart = {
    init: function () {
      var $pieChart = $('.ui-pie-chart');
      var $pieChartGradient = $('#uiPieChartGradient');
      if ($pieChart.length && $pieChartGradient.length <= 0) {
        $pieChart
          .eq(0)
          .after(
            '<svg style="width: 0; height: 0; position: absolute; z-index: -1; opacity: 0;">' +
              '<defs>' +
              '<linearGradient id="uiPieChartGradient" x1="100%" y1="50%" x2="0%" y2="50%">' +
              '<stop offset="0%" style="stop-color: rgb(43, 211, 198); stop-opacity: 1" />' +
              '<stop offset="100%" style="stop-color: rgb(10, 195, 188); stop-opacity: 1" />' +
              '</linearGradient>' +
              '</defs>' +
              '</svg>'
          );
      }
      $pieChart.each(function () {
        var $this = $(this);
        var val = $this.data('value');
        var diameterPC = 560;
        var diameterMobile = 260;

        if ($this.hasClass('ui-pie-chart--home')) {
          diameterPC = 380;
        }

        $this.data('type', uiViewType);

        $this.uiPieBarChart({
          diameter: uiViewType === 'pc' ? diameterPC : diameterMobile,
          backgroundStrokeColor: '#f4f4f4',
          strokeColor: 'url(#uiPieChartGradient)',
          strokeLinecap: 'round',
          strokeWidth: uiViewType === 'pc' ? 16 : 10,
          value: val,
          ratioResize: false,
        });
      });
    },
    resize: function () {
      var $pieChart = $('.ui-pie-chart');

      $pieChart.each(function () {
        var $this = $(this);
        var diameterPC = 560;
        var diameterMobile = 260;
        var type = $this.data('type');

        if ($this.hasClass('ui-pie-chart--home')) {
          diameterPC = 380;
        }

        if (uiViewType === 'pc' && !(type === 'pc')) {
          $this
            .data('type', 'pc')
            .uiPieBarChart('changeOptions', {
              diameter: diameterPC,
              strokeWidth: 16,
            })
            .uiPieBarChart('resize');
        } else if (uiViewType === 'mobile' && !(type === 'mobile')) {
          $this
            .data('type', 'mobile')
            .uiPieBarChart('changeOptions', {
              diameter: diameterMobile,
              strokeWidth: 10,
            })
            .uiPieBarChart('resize');
        }
      });
    },
  };

  // product detail
  var productDetail = {
    init: function () {
      var $big = $('.product-detail-photo__big-list');
      var $small = $('.product-detail-photo__small-list');
      var smallSwiper = null;

      if ($big.length && $small.length) {
        $small.swiperSet({
          nextControl: true,
          prevControl: true,
          slidesPerView: 4,
          spaceBetween: 16,
          watchSlidesVisibility: true,
          watchSlidesProgress: true,
        });
        smallSwiper = $small.data('swiper');
        $big.swiperSet({
          scrollbarControl: true,
          thumbs: {
            swiper: smallSwiper,
          },
        });
      }
    },
    resize: function () {
      var $big = $('.product-detail-photo__big-list');
      var $small = $('.product-detail-photo__small-list');

      if ($big.length && $big.data('swiper') && $small.length && $small.data('swiper')) {
        $big.data('swiper').update();
        $small.data('swiper').update();
      }
    },
  };

  // maxlength
  var maxlength = {
    init: function () {
      $('[data-maxlength]').each(function () {
        var $this = $(this);
        maxlength.update($this);
      });
    },
    update: function ($input) {
      var val = $input.val();
      var length = val.length;
      var max = Number($input.data('maxlength'));

      if (length > max) {
        val = val.substring(0, max);
        $input.val(val);
      }
    },
    on: function () {
      $doc.on('keyup.uiJSMaxlength focusin.uiJSMaxlength focusout.uiJSMaxlength', '[data-maxlength]', function () {
        var $this = $(this);
        maxlength.update($this);
      });
    },
  };
  maxlength.on();

  // text count
  var textCount = {
    init: function () {
      $('[data-text-count]').each(function () {
        var $this = $(this);
        textCount.update($this);
      });
    },
    update: function ($input) {
      var val = $input.val();
      var count = val.length;
      var $count = $($input.data('text-count'));

      $count.text(count);
    },
    on: function () {
      $doc.on('keyup.uiJSTextCount focusin.uiJSTextCount focusout.uiJSTextCount', '[data-text-count]', function () {
        var $this = $(this);
        textCount.update($this);
      });
    },
  };
  textCount.on();

  // file watch
  function fileWatchUpdate($input) {
    var name = $input.attr('data-file-watch');
    var $target = $('[data-file-watch-target="' + name + '"]');
    var val = $input.val();
    var match = null;

    if (typeof val === 'string' && val.length) {
      match = val.match(/[^\/\\]+$/);
      if (!(typeof match === null)) {
        val = match[0];
      }
      $input.addClass('is-inputed');
    } else {
      val = '';
      $input.removeClass('is-inputed');
    }

    $target.text(val);
  }
  function fileWatchInit() {
    $('[data-file-watch]').each(function () {
      var $this = $(this);
      var val = $this.val();

      if (typeof val === 'string' && val.length) {
        fileWatchUpdate($this);
      }
    });
  }
  $doc.on('change.fileWatch', '[data-file-watch]', function () {
    fileWatchUpdate($(this));
  });

  // checkbox tab
  function checkboxTabUpdate($input) {
    var name = $input.data('checkbox-tab');
    var $panel = $('[data-checkbox-tab-panel="' + name + '"]');
    var isChecked = $input.is(':checked');

    if (isChecked) {
      $panel.css('display', 'block');
    } else {
      $panel.css('display', 'none');
    }
  }
  function checkboxTabInit() {
    $('[data-checkbox-tab]').each(function () {
      var $this = $(this);
      checkboxTabUpdate($this);
    });
  }
  $doc.on('change.checkboxTab', '[data-checkbox-tab]', function () {
    var $this = $(this);
    var name = $this.attr('name');
    var $siblings = $('[name="' + name + '"]').not($this);

    checkboxTabUpdate($this);
    $siblings.each(function () {
      var $siblingsThis = $(this);
      checkboxTabUpdate($siblingsThis);
    });
  });

  // ui range
  function uiRangeInit() {
    function getAttrNumber($target, name) {
      var attr = $target.attr(name);
      if (typeof attr === 'string' && attr.length) {
        return Number(attr);
      } else {
        return null;
      }
    }
    $('.ui-range').each(function () {
      var $this = $(this);
      var dataMin = getAttrNumber($this, 'data-min');
      var dataMax = getAttrNumber($this, 'data-max');
      var dataValues = $this.attr('data-values');
      var minInput = $this.attr('data-min-input');
      var maxInput = $this.attr('data-max-input');
      var min = typeof dataMin === 'number' || dataMin instanceof Number ? dataMin : 0;
      var max = typeof dataMax === 'number' || dataMax instanceof Number ? dataMax : 100;
      var values = (function () {
        var valuesMin = min;
        var valuesMax = max;
        var split = null;

        if ((typeof dataValues === 'string', dataValues.length)) {
          split = dataValues.replace(/\s/g, '').split(',');
          valuesMin = Number(split[0]);
          valuesMax = Number(split[1]);
        }

        return [valuesMin, valuesMax];
      })();
      var $minInput = null;
      var $maxInput = null;

      var onSlide = function () {};

      if (typeof minInput === 'string' || typeof maxInput === 'string') {
        $minInput = $(minInput);
        $maxInput = $(maxInput);

        onSlide = function (e, ui) {
          if ($minInput.length) {
            $minInput.val(ui.values[0]);
            if (typeof eventBus === 'object') {
              // 개발 요청으로 추가
              eventBus.$emit('setSlider', ['min', ui.values[0]]);
            }
          }
          if ($maxInput.length) {
            $maxInput.val(ui.values[1]);
            if (typeof eventBus === 'object') {
              // 개발 요청으로 추가
              eventBus.$emit('setSlider', ['max', ui.values[1]]);
            }
          }
        };

        if ($minInput.length) {
          $minInput.val(values[0]);
          if (typeof eventBus === 'object') {
            // 개발 요청으로 추가
            eventBus.$emit('setSlider', ['min', values[0]]);
          }
        }
        if ($maxInput.length) {
          $maxInput.val(values[1]);
          if (typeof eventBus === 'object') {
            // 개발 요청으로 추가
            eventBus.$emit('setSlider', ['max', values[1]]);
          }
        }
      }

      $this.slider({
        range: true,
        min: min,
        max: max,
        values: values,
        slide: onSlide,
      });
    });
  }

  // home
  var homeBanner = {
    init: function () {
      var $banner = $('.home-big-banner__list');

      if ($banner.length) {
        $banner.swiperSet({
          pageControl: true,
          playControl: true,
          pauseControl: true,
          loop: true,
          pagination: {
            type: 'fraction',
          },
          autoplay: {
            delay: 8000,
            disableOnInteraction: false,
          },
        });
      }
    },
    resize: function () {
      var $banner = $('.home-big-banner__list');

      if ($banner.length && $banner.data('swiper')) {
        $banner.data('swiper').update();
      }
    },
  };

  // mobile header
  function hideMobileHeader() {
    var $header = $('.mobile-header');
    var $bottomBar = $('.mobile-bottom-bar');
    var hideClass = 'is-hide';
    var scrollTop = $win.scrollTop();
    var direction = uiJSCheckScrollDirection.direction;
    var endScrollTop = $('html').get(0).scrollHeight - $win.height() - 10;

    if (direction === 'down' && scrollTop > 10 && scrollTop < endScrollTop) {
      $header.addClass(hideClass);
      $bottomBar.addClass(hideClass);
    } else if (direction === 'up' || scrollTop <= 10 || scrollTop >= endScrollTop) {
      $header.removeClass(hideClass);
      $bottomBar.removeClass(hideClass);
    }
  }

  // mobile bottom bar
  function mobileBottomBarBubble() {
    var $bubble = $('.mobile-bottom-bar__bubble');
    var cookie = uiJSCookie.get('uiJSMobileBottomBarBubble');

    if (!Boolean(cookie)) {
      $bubble.addClass('is-show');
      setTimeout(function () {
        $bubble.removeClass('is-show');
      }, 3000);
      uiJSCookie.set('uiJSMobileBottomBarBubble', 'true');
    }
  }

  // datepicker range
  function datepickerRange() {
    $('.js-datepicker-range').each(function () {
      var $this = $(this);
      var $min = $this.find('.js-datepicker-range__min');
      var $max = $this.find('.js-datepicker-range__max');
      $min.datetimepicker({
        locale: 'ko',
        format: 'YYYY.MM.DD',
        dayViewHeaderFormat: 'YYYY년 MMMM',
      });
      $max.datetimepicker({
        locale: 'ko',
        format: 'YYYY.MM.DD',
        dayViewHeaderFormat: 'YYYY년 MMMM',
        useCurrent: false,
      });
      $min.off('dp.change.uiJSDatepickerRange').on('dp.change.uiJSDatepickerRange', function (e) {
        $max.data('DateTimePicker').minDate(e.date);
      });
      $max.off('dp.change.uiJSDatepickerRange').on('dp.change.uiJSDatepickerRange', function (e) {
        $min.data('DateTimePicker').maxDate(e.date);
      });
    });
  }

  // example slide
  function exampleSlide() {
    $('.example-slide__list').swiperSet({
      mousewheel: true,
      slideToClickedSlide: true,
    });
  }
  $doc.on('layerOpened.exampleSlide layerAfterOpened.exampleSlide', '.layer-ratings-standards-example', function () {
    var $this = $(this);
    var $slide = $this.find('.example-slide__list');

    if ($slide.length && $slide.data('swiper')) {
      $slide.data('swiper').update();
    }
  });

  // common js
  function uiJSCommon() {
    checkScrollbars();
    checkDisabledClass();
    pieChart.init();
    maxlength.init();
    textCount.init();
    fileWatchInit();
    checkboxTabInit();

    $('.ui-scroller').simplebar({ autoHide: false });
    $('.js-ui-accordion').each(function () {
      var $this = $(this);
      var once = $this.attr('data-once') === 'true';
      var filter = function () {
        var $thisItem = $(this);
        var $wrap = $thisItem.closest('.js-ui-accordion');

        if ($wrap.is($this)) {
          return true;
        } else {
          return false;
        }
      };
      var $items = $this.find('.js-ui-accordion__item').filter(filter);
      var $openers = $this.find('.js-ui-accordion__opener').filter(filter);
      var $layers = $this.find('.js-ui-accordion__layer').filter(filter);

      if ($this.get(0).uiAccordion) {
        $this.uiAccordion('update', {
          item: $items,
          opener: $openers,
          layer: $layers,
        });
      } else {
        $this.uiAccordion({
          item: $items,
          opener: $openers,
          layer: $layers,
          once: once,
        });
      }
    });
    $('.js-ui-dropdown').uiDropDown({
      opener: '.js-ui-dropdown__opener',
      layer: '.js-ui-dropdown__layer',
    });
    $('.js-ui-dropdown-hover').uiDropDown({
      event: 'hover',
      opener: '.js-ui-dropdown-hover__opener',
      layer: '.js-ui-dropdown-hover__layer',
    });
    $('.js-ui-tab-panel').each(function () {
      var $this = $(this);
      var initial = $this.attr('data-initial');
      var filter = function () {
        var $thisItem = $(this);
        var $wrap = $thisItem.closest('.js-ui-tab-panel');

        if ($wrap.is($this)) {
          return true;
        } else {
          return false;
        }
      };
      var $items = $this.find('[data-tab]').filter(filter);
      var $openers = $this.find('[data-tab-open]').filter(filter);

      $this.uiTabPanel({
        a11y: true,
        item: $items,
        opener: $openers,
        initialOpen: initial,
      });
    });

    uiRangeInit();
    productDetail.init();
    homeBanner.init();
    datepickerRange();
    exampleSlide();
  }
  window.uiJSCommon = uiJSCommon;

  // scroll update
  $doc.on('uiAccordionAfterOpened.uiScrollUpdate uiAccordionAfterClosed.uiScrollUpdate', '.js-ui-accordion', function () {
    var $this = $(this);
    var $parentScroller = $this.closest('.ui-scroller');
    var simplebar = $parentScroller.data('simplebar');

    if (simplebar) {
      simplebar.recalculate();
    }
  });

  // mobile by layer
  var mobileByLayer = {
    checkForMobileOrPC: function (layer) {
      var $layer = $(layer);

      if (uiViewType === 'pc') {
        if ($layer.hasClass('is-opened')) {
          $layer.removeClass('is-opened');
          scrollBlock.clear();
        }
      }
    },
    on: function (opener, closer, layer) {
      $doc
        .on('click.uiMobileByLayer', opener, function (e) {
          var $this = $(this);
          var $layer = $(layer);
          $layer.addClass('is-opened');
          scrollBlock.block();
          if ($this.is('a')) {
            e.preventDefault();
          }
        })
        .on('click.uiMobileByLayer', closer, function (e) {
          var $this = $(this);
          var $layer = $(layer);
          $layer.removeClass('is-opened');
          scrollBlock.clear();
          if ($this.is('a')) {
            e.preventDefault();
          }
        });
    },
  };

  // side layer
  var sideLayer = {
    checkForMobileOrPC: function (layer) {
      var $layer = $(layer);

      if (uiViewType === 'pc') {
        if ($layer.hasClass('is-opened')) {
          scrollBlock.clear();
        }
      } else if (uiViewType === 'mobile') {
        if ($layer.hasClass('is-opened')) {
          scrollBlock.block();
        }
      }
    },
    on: function (opener, closer, layer) {
      $doc
        .on('click.uiSideLayer', opener, function (e) {
          var $this = $(this);
          var $layer = $(layer);
          $layer.addClass('is-opened');
          if (uiViewType === 'mobile') {
            scrollBlock.block();
          }
          if ($this.is('a')) {
            e.preventDefault();
          }
        })
        .on('click.uiSideLayer', closer, function (e) {
          var $this = $(this);
          var $layer = $(layer);
          $layer.removeClass('is-opened');
          scrollBlock.clear();
          if ($this.is('a')) {
            e.preventDefault();
          }
        });
    },
  };

  // dropdown
  $doc.on('click.uiJSDropdown', '.js-ui-dropdown__closer', function () {
    var $this = $(this);
    var $wrap = $this.closest('.js-ui-dropdown');

    $wrap.uiDropDown('close');
  });

  // gnb
  function gnbInit() {
    var $gnb = $('.gnb-nav.js-ui-accordion');
    var $activeItem = $('.gnb-nav__item.js-ui-accordion__item.is-active');

    if ($activeItem.length) {
      $gnb.uiAccordion('open', $activeItem, 0);
    }
  }
  mobileByLayer.on('.js-gnb-opener', '.js-gnb-closer', '.gnb');

  // atm map
  mobileByLayer.on('.js-atm-find-opener', '.js-atm-find-closer', '.atm-find');

  // filter layer
  sideLayer.on('.js-filter-layer-opener', '.js-filter-layer-closer', '.filter-layer');

  // push talk
  sideLayer.on('.js-push-talk-opener', '.js-push-talk-closer', '.push-talk');

  // order bar
  var orderBar = {
    resize: function () {
      var $wrap = $('.order-bar');
      var $bar = $('.order-bar__inner');
      var $contentBody = $('.contents-wrap__body');
      var height = 0;
      var width = 0;

      if ($wrap.length) {
        height = $bar.outerHeight();
        width = $contentBody.outerWidth();
        $wrap.css('height', height);
        $bar.css('width', width);
      }
    },
    scroll: function () {
      var $wrap = $('.order-bar');
      var $bar = $('.order-bar__inner');
      var scrollTop = 0;
      var scrollLeft = 0;
      var wrapTop = 0;
      var height = 0;
      var winHeight = 0;
      var breakTop = 0;
      var isBreak = false;
      var left = 0;
      var position = 'fixed';

      if ($wrap.length) {
        scrollTop = $win.scrollTop();
        scrollLeft = $win.scrollLeft();
        wrapTop = $wrap.offset().top;
        height = $bar.outerHeight();
        winHeight = $win.height();
        breakTop = wrapTop + height - winHeight;
        isBreak = scrollTop >= breakTop;
        left = isBreak ? 0 : -scrollLeft;
        position = isBreak ? 'static' : 'fixed';

        $bar.css({
          position: position,
          marginLeft: left,
        });
      }
    },
  };

  // copy clipboard
  $doc.on('click.uiCopyClipboard', '[data-clipboard]', function (e) {
    var $this = $(this);
    var name = $(this).attr('data-clipboard');
    var $target = $('[data-clipboard-target="' + name + '"]');
    var text = (function () {
      var $clone = $target.clone();
      $clone.find('br').replaceWith('{**#&줄바꿈&#**}');
      var result = $clone
        .text()
        .replace(/\s/g, '')
        .replace(/\{\*\*\#&줄바꿈&\#\*\*\}/g, '\n');
      $clone.remove();
      return result;
    })();
    var title = $(this).attr('title');
    var $layer = (function () {
      var $target = $('.js-clipboard-layer');
      if (!$target.length) {
        $('body').append('<div class="js-clipboard-layer"><div class="js-clipboard-layer__text"><span class="js-clipboard-layer__title"></span>copied</div></div>');
        $target = $('.js-clipboard-layer');
      }
      return $target;
    })();
    var $layerTitle = $('.js-clipboard-layer__title');
    var scrollTop = $win.scrollTop();
    var scrollLeft = $win.scrollLeft();
    var layerPosition = {
      top: e.pageY - scrollTop,
      left: e.pageX - scrollLeft,
    };
    var layerTimer = $layer.data('ui-copy-clipboard-timer');

    clearTimeout(layerTimer);
    $layer.stop().css({
      display: 'none',
      opacity: 1,
    });

    if (typeof title === 'string' && title.length) {
      $layerTitle.text(title + ' ');
    } else {
      $layerTitle.text('');
    }

    $this.after('<div data-clipboard-dummy="' + name + '"><textarea>' + text + '</textarea></div>');

    var $dummy = $('[data-clipboard-dummy="' + name + '"]');

    $dummy.find('textarea').get(0).select();
    document.execCommand('copy');

    $layer.css(layerPosition);
    $layer.fadeIn(350, function () {
      var timer = setTimeout(function () {
        clearTimeout(timer);
        $layer.fadeOut(350);
      }, 3000);
      $layer.data('ui-copy-clipboard-timer', timer);
    });

    $dummy.remove();
    $this.focus();
  });

  // textarea form focus
  $doc
    .on('focus.textareaForm', '.textarea-form .ui-input', function () {
      var $this = $(this);
      var $wrap = $this.closest('.textarea-form');
      $wrap.addClass('is-focus');
    })
    .on('blur.textareaForm', '.textarea-form .ui-input', function () {
      var $this = $(this);
      var $wrap = $this.closest('.textarea-form');
      $wrap.removeClass('is-focus');
    });

  // area focus
  function areaFocus(area) {
    $doc
      .on('focus.areaFocus', area, function () {
        var $this = $(this);
        var timer = $this.data('areaFocusTimer');

        clearTimeout(timer);
        $this.addClass('is-focus');
      })
      .on('blur.areaFocus', area, function () {
        var $this = $(this);
        var timer = $this.data('areaFocusTimer');

        clearTimeout(timer);
        $this.data(
          'areaFocusTimer',
          setTimeout(function () {
            $this.removeClass('is-focus');
          }, 100)
        );
      });
  }
  areaFocus('.portal-search__input-block');

  // input delete
  $doc.on('click.inputDelete', '[data-input-delete]', function () {
    var $this = $(this);
    var target = $this.attr('data-input-delete');
    var $target = $(target);

    $target.val('').trigger('focus');
  });

  // portal search
  var portalSearchClass = {
    wrap: 'portal-search',
    input: 'portal-search__input',
    back: 'portal-search__back',
    close: 'portal-search__layer-close',
    opened: 'is-portal-search-opened',
    inputed: 'is-portal-search-inputed',
  };
  function portalSearchUpdate($input) {
    var val = $input.val();
    var $wrap = $input.closest('.' + portalSearchClass.wrap);

    if (typeof val === 'string' && val.length > 0) {
      $wrap.addClass(portalSearchClass.inputed);
    } else {
      $wrap.removeClass(portalSearchClass.inputed);
    }
  }
  $doc
    .on('click.portalSearch', function (e) {
      var check = $(e.target).is('.' + portalSearchClass.wrap) || $(e.target).closest('.' + portalSearchClass.wrap).length;

      if (!check) {
        $('html').removeClass(portalSearchClass.opened);
        $('.' + portalSearchClass.wrap).removeClass(portalSearchClass.opened);
      }
    })
    .on('focus.portalSearch', '.' + portalSearchClass.input, function () {
      var $this = $(this);
      var $wrap = $this.closest('.' + portalSearchClass.wrap);
      var $html = $('html');

      $html.addClass(portalSearchClass.opened);
      $wrap.addClass(portalSearchClass.opened);
      portalSearchUpdate($this);
    })
    .on('click.portalSearch', '.' + portalSearchClass.back + ', .' + portalSearchClass.close, function () {
      var $this = $(this);
      var $wrap = $this.closest('.' + portalSearchClass.wrap);
      var $html = $('html');

      $html.removeClass(portalSearchClass.opened);
      $wrap.removeClass(portalSearchClass.opened);
    })
    .on('blur.portalSearch keydown.portalSearch keyup.portalSearch change.portalSearch', '.' + portalSearchClass.input, function () {
      var $this = $(this);
      portalSearchUpdate($this);
    });

  // view type
  $doc.on('click.viewType', '[data-view-type]', function () {
    var $this = $(this);
    var type = $this.data('view-type');
    var $products = $('.products');
    var $btns = $('[data-view-type]');

    $btns.each(function () {
      var $btnsThis = $(this);
      var type = $btnsThis.data('view-type');
      $btnsThis.removeClass('is-active');
      $products.removeClass('products--' + type);
    });

    $this.addClass('is-active');
    $products.addClass('products--' + type);
  });

  // count animate
  function countAnimate() {
    var scrollTop = $win.scrollTop();
    var winH = $win.height();
    var diffTop = winH * 0.6;

    $('[data-count-animate]').each(function () {
      var $this = $(this);
      var offsetTop = $this.offset().top;
      var active = $this.data('countAnimateActive');
      var count = $this.data('count-animate');

      if (scrollTop >= offsetTop - diffTop && !active) {
        $this
          .data('countAnimateActive', true)
          .stop()
          .prop('count-animate', 0)
          .animate(
            {
              'count-animate': count,
            },
            {
              duration: 1000,
              step: function (now, fx) {
                var val = Math.floor(now)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                $this.text(val);
              },
            }
          );
      }
    });
  }

  // tab refresh
  $doc.on('uiTabPanelChange.tabRefresh', '[data-tab]', function () {
    var $this = $(this);
    var $video = $this.find('video');

    $video.each(function () {
      var $thisVideo = $(this);
      if ($thisVideo.prop('autoplay')) {
        this.currentTime = 0;
        this.play();
      }
    });
  });

  // brand video
  var brandVideo = {
    viewType: 'pc',
    className: {
      list: 'brand-video__list',
      item: 'brand-video__item',
      link: 'brand-video__link',
      close: 'brand-video__close',
      layer: 'brand-video__layer',
      opened: 'is-opened',
    },
    init: function () {
      var className = brandVideo.className;
      var $list = $('.' + className.list);
      var html = '';
      var data = (typeof uiJSBrandVideoData === 'object' && Array.isArray(uiJSBrandVideoData) && uiJSBrandVideoData.reverse()) || [];

      brandVideo.viewType = uiViewType;

      $.each(data, function () {
        html +=
          '<li class="brand-video__item">' +
          '<button type="button" class="ui-button brand-video__link" title="내용 보기">' +
          '<img src="https://i.ytimg.com/vi/' +
          this.id +
          '/maxresdefault.jpg" alt="" class="brand-video__thumb" />' +
          '<span class="brand-video__title">' +
          this.title +
          '</span>' +
          '</button>' +
          '<div class="brand-video__layer">' +
          '<div class="brand-video__contents">' +
          '<div class="brand-video__contents__inner">' +
          '<div class="brand-video__video">' +
          '<iframe src="https://www.youtube.com/embed/' +
          this.id +
          '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
          '</div>' +
          '<h3 class="brand-video__contents-title">' +
          this.title +
          '</h3>' +
          (this.discription.length ? '<div class="brand-video__contents-text">' + this.discription.replace(/\n/g, '<br>') + '</div>' : '') +
          '</div>' +
          '<button type="button" class="ui-button brand-video__close">' +
          '<span class="for-a11y">내용 숨기기</span>' +
          '</button>' +
          '</div>' +
          '</div>' +
          '</li>';
      });

      $list.append(html);
    },
    open: function ($item) {
      var className = brandVideo.className;
      var $layer = $item.find('.' + className.layer);
      var beforeH = 0;
      var afterH = 0;
      var $openItem = $('.' + className.item + '.' + className.opened);

      if (!$item.hasClass(className.opened)) {
        $item.addClass(className.opened);

        if (uiViewType === 'pc' && $openItem.length && Math.floor($openItem.index() / 4) === Math.floor($item.index() / 4)) {
          beforeH = $openItem
            .find('.' + className.layer)
            .stop()
            .height();
        }

        if ($openItem.length) {
          brandVideo.close($openItem);
        }

        $layer.stop().css('height', 'auto');
        afterH = $layer.height();
        $layer.css('height', beforeH).animate(
          {
            height: afterH,
          },
          500,
          function () {
            $layer.css('height', 'auto');
          }
        );
        $item.stop().css('margin-bottom', beforeH).animate(
          {
            marginBottom: afterH,
          },
          500
        );
      }
    },
    close: function ($item) {
      var className = brandVideo.className;
      var $layer = $item.find('.' + className.layer);
      var $iframe = $layer.find('iframe');
      var beforeH = 0;
      var src = '';

      if ($item.hasClass(className.opened)) {
        $item.removeClass(className.opened);
        $layer.stop();
        beforeH = $layer.height();
        $layer.css('height', beforeH).animate(
          {
            height: 0,
          },
          500
        );
        $item.stop().animate(
          {
            marginBottom: 0,
          },
          500
        );
        src = $iframe.attr('src');
        $iframe.attr('src', '').attr('src', src);
      }
    },
    resize: function () {
      var className = brandVideo.className;
      var $openItem = $('.' + className.item + '.' + className.opened);
      var $openLayer = null;
      var height = 0;

      if (!(brandVideo.viewType === uiViewType)) {
        brandVideo.viewType = uiViewType;

        if ($openItem.length) {
          $openLayer = $openItem.find('.' + className.layer);
          $openLayer.stop().css('height', 'auto');
          height = $openLayer.height();
          $openItem.stop().css('margin-bottom', height);
        }
      }
    },
  };
  $doc
    .on('click.brandVideo', '.' + brandVideo.className.link, function () {
      var $this = $(this);
      var $item = $this.closest('.' + brandVideo.className.item);
      brandVideo.open($item);
    })
    .on('click.brandVideo', '.' + brandVideo.className.close, function () {
      var $this = $(this);
      var $item = $this.closest('.' + brandVideo.className.item);
      brandVideo.close($item);
    });

  // top button
  function topButtonScroll() {
    var scrollTop = $win.scrollTop();
    var $topButton = $('.quick-menu__item--top');

    if (scrollTop > 0) {
      $topButton.addClass('is-show');
    } else {
      $topButton.removeClass('is-show');
    }
  }
  $doc.on('click.topButton', '.js-top-button', function () {
    $('html').stop().animate(
      {
        scrollTop: 0,
      },
      500
    );
  });

  // dom ready
  $(function () {
    var $html = $('html');
    var $body = $('body');

    if (userAgentCheck.ieMode) {
      $html.addClass('is-ie ie-' + userAgentCheck.ieMode);
    }

    scrollbarsWidth.set();
    checkForMobileOrPC();
    uiJSCommon();
    hideMobileHeader();
    mobileBottomBarBubble();
    gnbInit();
    orderBar.resize();
    topButtonScroll();

    // css set
    if (scrollbarsWidth.width > 0) {
      $body.prepend(
        '<style type="text/css">' +
          '.is-scroll-blocking.is-scrollbars-width #wrap {' +
          'margin-right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}\n' +
          '.is-scroll-blocking.is-scrollbars-width .mobile-header {' +
          'right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}\n' +
          '.is-scroll-blocking.is-scrollbars-width .mobile-bottom-bar {' +
          'right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}' +
          '</style>'
      );
    }

    // is mobile bottom bar
    if ($('.mobile-bottom-bar').length) {
      $html.addClass('is-mobile-bottom-bar');
    }

    // home
    if ($('.contents--home').length) {
      $html.addClass('is-home-page');
    }

    // atm map
    if ($('.contents--map').length) {
      $html.addClass('is-map-page');
    }

    // 모바일 일 때 푸터 빠지는 화면
    var exceptToMobileFooter = '.contents--order-write, .contents--order-ing, .contents--order-end, .contents--order-fail';
    if ($(exceptToMobileFooter).length) {
      $html.addClass('is-except-to-mobile-footer');
    }

    // atm slide
    $('.atm-slide__list').swiperSet({
      speed: 800,
      effect: 'fade',
      allowTouchMove: false,
      autoplay: {
        delay: 3500,
      },
    });

    // brand video
    brandVideo.init();
  });

  // win load, scroll, resize
  $win
    .on('load.uiJS', function () {
      checkForMobileOrPC();
      orderBar.resize();
      countAnimate();
    })
    .on('scroll.uiJS', function () {
      uiJSCheckScrollDirection.update();
      hideMobileHeader();
      orderBar.scroll();
      countAnimate();
      topButtonScroll();
    })
    .on('resize.uiJS', function () {
      checkForMobileOrPC();
      mobileByLayer.checkForMobileOrPC('.gnb');
      mobileByLayer.checkForMobileOrPC('.atm-find');
      sideLayer.checkForMobileOrPC('.filter-layer');
      pieChart.resize();
      orderBar.resize();
      productDetail.resize();
      homeBanner.resize();
      brandVideo.resize();
      topButtonScroll();
    });
})(jQuery);
