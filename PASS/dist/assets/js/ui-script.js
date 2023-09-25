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

  // common
  var $win = $(window);
  var $doc = $(document);

  // swiperSet
  // https://github.com/nolimits4web/swiper/tree/v6.5.6
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
      var $label = null;
      var hashCode = '';
      var labelID = '';
      var $layers = $('[data-layer]');
      var $ohterElements = $('body').find('*').not('[data-layer], [data-layer] *, script, link, style, base, meta, br, [aria-hidden], [inert], .js-not-inert, .js-not-inert *');

      $layers.parents().each(function () {
        $ohterElements = $ohterElements.not($(this));
      });

      if ($layer.length && !$layer.hasClass('js-layer-opened')) {
        $label = $layer.find('h1, h2, h3, h4, h5, h6, p').eq(0);
        hashCode = (function () {
          var code = $layer.data('uiJSHashCode');
          if (!(typeof code === 'string')) {
            code = uiGetHashCode();
            $layer.data('uiJSHashCode', code);
          }
          return code;
        })();
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
        $layer.trigger('layerBeforeOpened').attr('role', 'dialog').attr('aria-hidden', 'true').css('visibility', 'hidden').attr('hidden', '');
        if ($label.length) {
          labelID = (function () {
            var id = $label.attr('id');
            if (!(typeof id === 'string' && id.length)) {
              id = target + '-' + hashCode;
              $label.attr('id', id);
            }
            return id;
          })();
          $layer.attr('aria-labelledby', labelID);
        }
        $html.addClass('js-html-layer-opened js-html-layer-opened-' + target);

        $ohterElements.attr('aria-hidden', 'true').attr('inert', '').attr('data-ui-js', 'hidden');

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
          .attr('aria-hidden', 'false')
          .css('visibility', 'visible')
          .removeAttr('hidden')
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
      var $ohterElements = $('body').find('[data-ui-js="hidden"]');

      if ($layer.length && $layer.hasClass('js-layer-opened')) {
        $layer
          .trigger('layerBeforeClosed')
          .stop()
          .removeClass('js-layer-opened')
          .addClass('js-layer-closed')
          .css('display', 'block')
          .data('layerIndex', null)
          .attr('aria-hidden', 'true')
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

              $(this).css('display', 'none').css('visibility', 'hidden').attr('hidden', '').removeClass('js-layer-closed');

              $html.removeClass('js-html-layer-closed-animate js-html-layer-opened-' + target);

              if (!$openedLayer.length) {
                $html.removeClass('js-html-layer-opened');
                $ohterElements.removeAttr('aria-hidden').removeAttr('inert').removeAttr('data-ui-js');
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
      var disabledClassName = 'is-disabled';
      var isDisabled = $this.is(':disabled');
      var disabledHasClass = $parent.hasClass(disabledClassName);
      var readonlyClassName = 'is-readonly';
      var isReadonly = $this.is('[readonly]');
      var readonlyHasClass = $parent.hasClass(readonlyClassName);

      if (isDisabled && !disabledHasClass) {
        $parent.addClass(disabledClassName);
      } else if (!isDisabled && disabledHasClass) {
        $parent.removeClass(disabledClassName);
      }

      if (isReadonly && !readonlyHasClass) {
        $parent.addClass(readonlyClassName);
      } else if (!isReadonly && readonlyHasClass) {
        $parent.removeClass(readonlyClassName);
      }
    });
  }

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
              '<stop offset="0%" style="stop-color: rgb(10, 195, 188); stop-opacity: 1" />' +
              '<stop offset="100%" style="stop-color: rgb(43, 211, 198); stop-opacity: 1" />' +
              '</linearGradient>' +
              '</defs>' +
              '</svg>'
          );
      }
      $pieChart.each(function () {
        var $this = $(this);
        var val = $this.data('value');

        $this.uiPieBarChart({
          diameter: 260,
          backgroundStrokeColor: '#f7f7f7',
          strokeColor: 'url(#uiPieChartGradient)',
          strokeLinecap: 'round',
          strokeWidth: 10,
          value: val,
          ratioResize: false,
        });
      });
    },
  };

  // common js
  function uiJSCommon() {
    checkScrollbars();
    checkDisabledClass();
    pieChart.init();

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
    $('.search-input-block__input').each(function () {
      inputedCheck($(this), '.search-input-block');
    });

    // banner
    $('.contents-banner__list').swiperSet({
      pageControl: true,
      loop: true,
    });
  }
  window.uiJSCommon = uiJSCommon;

  // bottom fix
  function bottomFixResize() {
    var $bottomFix = $('.bottom-fix');

    if (!$bottomFix.length) return;

    var bottomFixH = $bottomFix.outerHeight();
    var $fakeBottomFix = (function () {
      var $fake = $('.fake-bottom-fix');
      if (!$fake.length) {
        $('.contents-wrap').append('<div class="fake-bottom-fix"></div>');
        $fake = $('.fake-bottom-fix');
      }
      return $fake;
    })();

    $fakeBottomFix.height(bottomFixH);
  }

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
  areaFocus('.search-input-block');

  // inputed
  function inputedCheck($input, parent) {
    var val = $input.val();
    var $wrap = $input.closest(parent);

    if ($wrap.length) {
      if (typeof val === 'string' && val.length > 0) {
        $wrap.addClass('is-inputed');
      } else {
        $wrap.removeClass('is-inputed');
      }
    }
  }
  $doc.on('focus.inputedCheck blur.inputedCheck keydown.inputedCheck keyup.inputedCheck change.inputedCheck', '.search-input-block__input', function () {
    inputedCheck($(this), '.search-input-block');
  });

  // input delete
  $doc.on('click.inputDelete', '.search-input-block__delete', function () {
    var $this = $(this);
    var $input = $this.closest('.search-input-block').find('.search-input-block__input');

    $input.val('').trigger('focus');
  });

  // dom ready
  $(function () {
    var $html = $('html');
    var $body = $('body');

    scrollbarsWidth.set();
    uiJSCommon();

    // css set
    if (scrollbarsWidth.width > 0) {
      $body.prepend(
        '<style type="text/css">' +
          '.is-scroll-blocking.is-scrollbars-width #wrap {' +
          'margin-right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}\n' +
          '.is-scroll-blocking.is-scrollbars-width .header-wrap {' +
          'right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}\n' +
          '.is-scroll-blocking.is-scrollbars-width .bottom-fix-wrap {' +
          'right: ' +
          scrollbarsWidth.width +
          'px;' +
          '}' +
          '</style>'
      );
    }

    bottomFixResize();
  });

  // win load, scroll, resize
  $win
    .on('load.uiJS', function () {
      bottomFixResize();
    })
    .on('scroll.uiJS', function () {
      //
    })
    .on('resize.uiJS', function () {
      bottomFixResize();
    })
    .on('orientationchange', function () {
      bottomFixResize();
    });
})(jQuery);
