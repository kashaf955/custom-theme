import utils from '@bigcommerce/stencil-utils';
import modalFactory from '../global/modal';
import mobileMenuToggle from '../global/mobile-menu-toggle';
import quickView from '../global/quick-view';
import menu from '../global/menu';
import privacyCookieNotification from '../global/cookieNotification';
import quickSearch from '../global/quick-search';
import haloNewsletterPopup from './haloNewsletterPopup';
import haloRecentlyBoughtPopup from './haloRecentlyBoughtPopup';
import haloRecentlyViewedProduct from './haloRecentlyViewedProduct';
import haloMegaMenuEditor from './haloMegaMenuEditor';
import haloAjaxLoginPopup from './haloAjaxLoginPopup';
import haloLoadImageBrand from './haloLoadImageBrand';
import haloBrands from './haloBrands';
import haloAjaxAddToCart from './haloAjaxAddToCart';
import haloMultiLevelCategoryFilter from './haloMultiLevelCategoryFilter';
import haloAskAnExpertPopup from './haloAskAnExpertPopup';

export default function(context) {
    const $context = context,
          settings = context.themeSettings;

    var $header = $('header.header'),
        height_header = $header.outerHeight(),
        height_top = height_header + $('#hl_topPromotion').outerHeight(); 

    var scroll_position = $(window).scrollTop();

    var checkJS_load = true,
        check_productCountdownTop = true,
        check_loadProductCarousel = true,
        check_loadProductGrid = true;

    if ($('#haloAZBrandsTable').length) {
        haloBrands(context);
    }

    function loadFunction() {
        if (checkJS_load) {
            checkJS_load = false;

            if (context.themeSettings.halo_ask_an_expert && context.themeSettings.halo_ask_an_expert_pagelink) haloAskAnExpertPopup(context);

            haloMegaMenuEditor($context);
            mobileMenuToggle();
            haloRecentlyBoughtPopup($context);
            haloAjaxAddToCart($context);
            quickView($context);
            quickSearch($context);
            menu();
            privacyCookieNotification();
            haloAjaxLoginPopup();
            activeMenuMobile();
            footerMobileToggle();
            checkCookiesPopup();
            blogTags();
            haloNewsletterPopup($context);
            haloMultiLevelCategoryFilter();
            haloVideoPopup()
            countDownProduct('.card-countDown');

            if(settings.halo_recently_viewed_products) {
                haloRecentlyViewedProduct($context);
            }
        }
    }

    function eventLoad() {
        $(document).ready(function() {
            const tScroll = $(this).scrollTop();

            haloLoad();
            haloMultiCategoryFilter();
            searchFormMobile();
            loadDataForProductCarousel(tScroll);
            loadProductGrid(tScroll);
            hoverMenu();
            shopAllCategoriesToggle();
        });

        $(window).on('scroll', (e) => {
            const $target = $(e.currentTarget);
            const tScroll = $target.scrollTop();

            loadFunction();
            haloStickyHeader(tScroll);
            productBlockCountdown(tScroll)
            loadDataForProductCarousel(tScroll);
            loadProductGrid(tScroll);
        });

        $(document).on('keydown mousemove touchstart', (e)=> {
            loadFunction();
        });
        
        //
        // Resize
        // -----------------------------------------------------------------------------
        $(window).on('resize', (e) => {
            checkCookiesPopup();
            activeMenuMobile();
            searchFormMobile();
            haloMultiCategoryFilter();
        });
    }
    eventLoad();

    function Event() {
        //
        // Close
        // -----------------------------------------------------------------------------
        const $btn_close = $('.btn-close');
        const $btn_mobileMenu = $('.mobileMenu-toggle');

        $btn_close.on('click', (e) => {
            e.preventDefault();
            const $target = $(e.currentTarget);

            $target.parents('.halo-side-block').removeClass('is-open');

            $('body').removeClass('is-side-block');
            
            setTimeout(function(){ 
                $sideLogin.hide();
                $sideCart.hide();
                $('#sideBlock_category').hide();
                $('#sideBlock_search').hide();
                $('#sideBlock_brand').hide();
                $('#sideBlock_blog').hide();
            }, 200);

            if ($('body').hasClass('has-activeNavPages')) {
                $btn_mobileMenu.trigger('click');
            }
        });

        // ========================================================================
        // Top Promotion
        // ========================================================================
        $('.promotion-close').on('click', event => {
            event.preventDefault();

            $('#hl_topPromotion').slideToggle();
        });

        //
        // Login Form
        // -----------------------------------------------------------------------------
        if (!$('body').hasClass('page-type-login')) {
            $('[data-login-form]').on('click', event => {
                event.preventDefault();
                
                if($('.halo-auth-sidebar').hasClass('is-open')){
                    $('.halo-auth-sidebar').removeClass('is-open');
                    $('body').removeClass('openAuthSidebar');
                } else{
                    $('.halo-auth-sidebar').addClass('is-open');
                    $('body').addClass('openAuthSidebar');
                }
            });
        } else {
            $('[data-login-form]').on('click', event => {
                event.preventDefault();

                $('html, body').animate({
                    scrollTop: $('.login').offset().top,
                }, 700);
            });
        }

        //
        // Account Form
        // -----------------------------------------------------------------------------
        $('.halo-auth-sidebar .halo-sidebar-header .close').on('click', event =>{
            event.preventDefault();

            $('.halo-auth-sidebar').removeClass('is-open');
            $('body').removeClass('openAuthSidebar');
        });

        $(document).on('click', event => {
            if ($('.halo-auth-sidebar').hasClass('is-open')) {
                if (($(event.target).closest('.halo-auth-sidebar').length === 0) && ($(event.target).closest('[data-login-form]').length === 0)){
                    $('.halo-auth-sidebar').removeClass('is-open');
                    $('body').removeClass('openAuthSidebar');
                }
            }
        });

        //
        // Add To Wish List
        // -----------------------------------------------------------------------------
        $(document).on('click', '.card .wishlist', (e) => {
            e.preventDefault();
            var $this_wl = $(e.currentTarget);
            var url_awl = $this_wl.attr('href');

            if ($('body').hasClass('is-login')) {
                $.post(url_awl).done(function() {
                    window.location.href = url_awl;
                });
            }
            else {
                window.location.href = '/login.php';
            }
        });

        //
        // Show More
        // -----------------------------------------------------------------------------
        const showMorebtn = $('.button-showmore'),
            desc = $('.description-showmore'),
            maxHeight= desc.data('max-height'),
            textShowMore = showMorebtn.data('show-more-text'),
            textShowLess = showMorebtn.data('show-less-text');

        showMorebtn.on('click', event => {
            event.preventDefault();

            if(showMorebtn.hasClass('less')) {
                showMorebtn.removeClass('less').addClass('show');
                showMorebtn.find('.text').text(textShowMore);
                desc.css('max-height',maxHeight);
            } else {
                showMorebtn.removeClass('show').addClass("less");
                desc.css('max-height','unset');
                showMorebtn.find('.text').text(textShowLess);
            }
        });

        //
        // Show More
        // -----------------------------------------------------------------------------
        $('.productCarousel-tabs [data-tab]').on('toggled', function (event, tab) {
            $('.productCarousel[data-slick]').slick('setPosition');
        });

        //
        // Cart Total Price
        // -----------------------------------------------------------------------------
        if (settings.hl_header_layout == 'header_layout_3') {
            utils.api.getPage('/cart.php', 'cart/totals', (err, response) => {
                if (err) return;
    
                const totalPrice = $(response).find('.halo_middleHeader .navUser-total-grandTotal').data('price');
    
                $('.halo_middleHeader .navUser-total-grandTotal').html(totalPrice);
            });
        }

        //
        // Footer Info Heading Toggle
        // -----------------------------------------------------------------------------
        const $footerHeadingToggle = $('.footer-info-heading--toggle');

        $footerHeadingToggle.on('click', (e) => {
            e.preventDefault();
            const wWidth = window.innerWidth;

            if (wWidth < 768) {
                const $target = $(e.currentTarget);
                const $thisFooterInfo = $target.parents('.footer-info-col');
                const $thisFooterInfo_list = $thisFooterInfo.find('.footer-info-list');

                $thisFooterInfo.toggleClass('open-dropdown');

                if ($thisFooterInfo.hasClass('open-dropdown')) {
                    $thisFooterInfo_list.slideDown(400);
                }
                else {
                    $thisFooterInfo_list.slideUp(400);
                }
            }
        });

        //
        // FAQs Page
        // -----------------------------------------------------------------------------
        $(document).on('click','.halo-faqs-content .card .title', event => {
            event.preventDefault();

            var target = $(event.currentTarget);

            $('.halo-faqs-content .card .title').not(target).removeClass('collapsed');

            if(target.hasClass('collapsed')){
                target.removeClass('collapsed');
            } else{
                target.addClass('collapsed');
            }

            $('.halo-faqs-content .card').each((index, element) => {
                if($('.title', element).hasClass('collapsed')){
                    $(element).find('.collapse').slideDown(400);
                } else{
                    $(element).find('.collapse').slideUp(400);
                }
            });
        });

        //
        // Progress Scroll
        // -----------------------------------------------------------------------------
        window.addEventListener('scroll', () => {
            document.body.style.setProperty('--scroll',`${window.pageYOffset / (document.body.offsetHeight - window.innerHeight) * 100}%`);
        }, false);
    }
    Event();

    function hoverMenu(){
        if ($(window).width() > 1024) {
            if ($('.navPages-list:not(.navPages-list--user) > .navPages-item.has-dropdown').length) {
                $('.navPages-list:not(.navPages-list--user) > .navPages-item.has-dropdown').on('mouseover', event => {
                    $('body').addClass('openMenuPC');
                    $(event.currentTarget).addClass('animated');
                })
                .on('mouseleave', event => {
                    $('body').removeClass('openMenuPC');
                    $(event.currentTarget).removeClass('animated');
                });
            }
        }
    }

    function shopAllCategoriesToggle() {
        const $allCate = $('.halo_bottomHeader .halo_allCate');

        if (!$allCate.length || $(window).width() <= 800) {
            return;
        }

        $allCate.off('click.cwtAllCate keydown.cwtAllCate');

        $allCate.on('click.cwtAllCate', '.halo_allCateText', event => {
            event.preventDefault();
            event.stopPropagation();

            const isOpen = $allCate.hasClass('is-open');

            $allCate.toggleClass('is-open', !isOpen);
            $(event.currentTarget).attr('aria-expanded', !isOpen);
        });

        $allCate.on('keydown.cwtAllCate', '.halo_allCateText', event => {
            if (event.key !== 'Enter' && event.key !== ' ') {
                return;
            }

            event.preventDefault();
            $(event.currentTarget).trigger('click');
        });

        $(document).off('click.cwtAllCate').on('click.cwtAllCate', event => {
            if (!$(event.target).closest('.halo_allCate').length) {
                $allCate.removeClass('is-open');
                $allCate.find('.halo_allCateText').attr('aria-expanded', 'false');
            }
        });
    }

    function searchFormMobile() {
        if ($(window).width() < 1025) {
            if ($('.bottomHeader-item #quickSearch').length) {
                $('.bottomHeader-item #quickSearch').appendTo('#halo-search-sidebar .halo-sidebar-search');
            }
        } else {
            if (!$('.item--quicksearch #quickSearch').length) {
                $('#halo-search-sidebar #quickSearch').appendTo('.item--quicksearch');
            }
        }
    }

    function activeMenuMobile() {
        $('.halo-menu-sidebar .halo-sidebar-close').on('click', event => {
            event.preventDefault();

            if ($('body').hasClass('has-activeNavPages')) {
                $('.mobileMenu-toggle').trigger('click');
            }
        });
        $(document).on('click', event => {
            if ($('body').hasClass('has-activeNavPages')) {
                if (($(event.target).closest('.halo-menu-sidebar').length === 0) && ($(event.target).closest('.mobileMenu-toggle').length === 0)){
                    $('.mobileMenu-toggle').trigger('click');
                }
            }
        });

        var $menuPc = $('#menu .navPages-list:not(.navPages-list--user)'),
        // var $menuPc = $('#menu .navPages-item.navPages-item-page'),
            $menuMobile = $('#halo-menu-sidebar .navPages-list:not(.navPages-list--user)');

        if ($(window).width() <= 1024) {
            $('.mobileMenu-toggle').on('click', event => {
                if ($menuPc.length && !$menuMobile.children().length) {
                    let items = $menuPc.children().toArray(); // Convert to array
                    let chunkSize = 10; // Adjust chunk size based on performance
                    let index = 0;

                    function appendChunk() {
                        for (let i = 0; i < chunkSize && index < items.length; i++, index++) {
                            let fragment = $(document.createDocumentFragment());
                            
                            fragment.append(items[index]);
                            setTimeout(function(){
                                $menuMobile.append(fragment);
                            }, 400)
                        }

                        if (index < items.length) {
                            requestAnimationFrame(appendChunk); // Non-blocking batch append
                        }
                    }

                    appendChunk();
                }
            });
        }

    }

    function footerMobileToggle(){
        $('.footer-info-col--mobile .footer-info-heading').on('click', event => {
            $('.footer-info-col--mobile .footer-info-heading').not($(event.currentTarget)).removeClass('is-clicked');

            if($(event.currentTarget).hasClass('is-clicked')){
                $(event.currentTarget).removeClass('is-clicked');
            } else{
                $(event.currentTarget).addClass('is-clicked');
            }

            $('.footer-info-col--mobile').each((index, element) => {
                if($('.footer-info-heading', element).hasClass('is-clicked')){
                    $(element).find('.footer-info-wrapper').slideDown("slow");
                } else{
                    $(element).find('.footer-info-wrapper').slideUp("slow");
                }
            });
        });
    }

    function checkCookiesPopup() {
        if ($('#consent-manager').length) {
            var height = $('#consent-manager').height() + 15;

            $('#recently_bought_list').css('bottom', height);
        }
    }

    function haloStickyHeader(tScroll) {
        if (settings.halo_headerSticky) {

            if (tScroll > height_top && tScroll < scroll_position) {
                if (!$('.header-height').length) {
                    $header.before('<div class="header-height" style="height: '+height_header+'px"></div>');
                }
                $header.addClass('is-sticky');
                $header.css('animation-name','halo-fadeInDown');
            } else {
                if($('.halo-search-main').length) {
                    $('.halo-search-sticky #quickSearch').appendTo('.halo-search-main');
                }
                $header.removeClass('is-sticky');
                $('.header-height').remove();
                
                $header.css('animation-name','');
            }

            scroll_position = tScroll;
        }
    }

    function haloMultiCategoryFilter() {
        const $multi = $('.halo_MultiCategory');
        if (!$multi.length) {
            return;
        }

        const $mobileSlot = $('.cwt-hero__filter-below .category-filter-mobile').first();
        const $desktopSlot = $('.cwt-hero__filter').first();
        const $filter = $('.category-filter').has('.halo_MultiCategory').first();

        if (!$filter.length) {
            return;
        }

        if ($(window).width() <= 1200) {
            if ($mobileSlot.length && !$mobileSlot.find('.halo_MultiCategory').length) {
                $filter.appendTo($mobileSlot);
            }
            $multi.removeClass('layout-2');
        } else if ($desktopSlot.length) {
            if (!$desktopSlot.find('.halo_MultiCategory').length) {
                $filter.appendTo($desktopSlot);
            }
            $multi.addClass('layout-2');
        }
    }

    function productBlockCountdown(tScroll) {
        const $productCountdown = $('.productBlock--countdown');

        if ($productCountdown.length) { 
            const $productCountdownTop = $productCountdown.offset().top - screen.height;

            if (tScroll > $productCountdownTop && check_productCountdownTop) {
                setInterval(() => {
                    let productBlockCountDown = document.querySelectorAll('.productBlock--countdown');
                
                    productBlockCountDown.forEach((elem) => {
                        if (!elem.innerHTML.trim()) {
                            let countDown = elem.getAttribute('data-countdown');
                            let countDownDate = new Date(countDown).getTime();
                            let countDownFunction = setInterval(function () {
                                let now = new Date().getTime(),
                                    distance = countDownDate - now;
                    
                                if (distance < 0) {
                                    clearInterval(countDownFunction);
                                    seft.remove();
                                } else {
                                    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
                                    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                                    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
                                    if (days < 10) {days = "0" + days.toString();}
                                    if (hours < 10) {hours = "0" + hours.toString();}
                                    if (minutes < 10) {minutes = "0" + minutes.toString();}
                                    if (seconds < 10) {seconds = "0" + seconds.toString();}
                                    let block_countdownTitle = settings.halo_prodByCateBlockCDTitle;
                                    let strCountDown = '<span class="text">'+ block_countdownTitle +'</span><span class="number">'+ days +'d, '+ hours +':'+ minutes +':'+ seconds +'</span>';
                                    elem.classList.add('is-active');
                                    elem.innerHTML = strCountDown;
                                }
                            }, 1000);
                        }
                    });
                }, 1000);
            }
        }
    }

    function  loadDataForProductCarousel(tScroll){
        const $loadProductCarousel = $('.productCarousel');

        if ($loadProductCarousel.length) {
            const $loadProductCarouselTop = $loadProductCarousel.offset().top - screen.height;

            if (tScroll > $loadProductCarouselTop && check_loadProductCarousel) {
                check_loadProductCarousel = false;

                if($('.productCarousel').length > 0){
                    $('.productCarousel').each((index, element) => {
                        var $prodWrapId = $(element).attr('id');

                        haloLoadImageBrand($context, $prodWrapId);
                    });
                }
            }
        }
    }

    function loadProductGrid(tScroll){
        const $loadProductGrid = $('.productGrid:not(.productListing)');

        if ($loadProductGrid.length) {
            const $loadProductGridTop = $loadProductGrid.offset().top - screen.height;

            if (tScroll > $loadProductGridTop && check_loadProductGrid) {
                check_loadProductGrid = false;

                if($('.productGrid:not(.productListing)').length > 0){
                    const col = 4,
                          limitProduct = 2*parseInt(col);

                    $('.productGrid:not(.productListing)').each((index, element) => {
                        var $prodWrapId = $(element).attr('id');

                        $(element).find('.product:visible').css('display', 'none');
                        $(element).find('.product:hidden').slice(0,limitProduct).css('display', 'inline-block');

                        if($(element).find('.product').length > limitProduct){
                            $(element).after('<div class="productGrid-showMore"><a class="button button--secondary" href="#" data-href="'+$prodWrapId+'"><span>Show More<span></a></div>');
                        }

                        haloLoadImageBrand($context, $prodWrapId);
                    });

                    $('.productGrid-showMore .button').on('click', event => {
                        event.preventDefault();
                        var target = $(event.currentTarget),
                            targetId = target.data('href');

                        target.blur();

                        $('[data-block='+targetId+']').find('.product:hidden').slice(0,limitProduct).css('display', 'inline-block');

                        if($('[data-block='+targetId+']').find('.product:hidden').length == 0){
                            target.addClass('disable').text('No more items');
                        }
                    });
                }
            }
        }
    }

    function loadProductTabByCategory(block){
        const templates = {
            template: 'products/carousel-2'
        }

        if (block.matches('.ajax-loaded')) return;
        block.classList.add('ajax-loaded');
        
        var $block = $(block),
            blockContent = $block.find('.tab-content.is-active'),
            wrap = blockContent.find('.productTabCarousel'),
            cateUrl = blockContent.data('tab-category-url'),
            blockId = blockContent.attr('id');
        
        blockContent.find('.loadingOverlay').show();
        wrap.addClass('load-carousel');
        loadCategory(cateUrl, templates, wrap, blockId);

        $block.find('[data-tab]').on('toggled', (event, tab) => {
            var blockContent = $block.find('.tab-content.is-active'),
                wrap = blockContent.find('.productTabCarousel'),
                cateUrl = blockContent.data('tab-category-url'),
                blockId = blockContent.attr('id');
            
            blockContent.find('.loadingOverlay').show();
            wrap.addClass('load-carousel');
            if (!$(event.currentTarget).find('.productTabCarousel').hasClass('slick-initialized')) {
                loadCategory(cateUrl, templates, wrap, blockId);
            }
        });
    }

    function loadCategory(url, option, wrap, blockId) {
        utils.api.getPage(url, option, (err, response) => {
            if (err) return;

            if (!wrap.find('.productCarousel-slide').length) {
                wrap.html(response);
                categoryCarousel(wrap);
                wrap.parents('.tab-content').find('.loadingOverlay').remove();
                wrap.parents('.tab-content').addClass('is-load');

                haloLoadImageBrand($context, blockId)
                wrap.find('.productCarousel-slide').addClass('animated');
            }
        }); 
    }

    function categoryCarousel(wrap) {
        wrap.slick({
            dots: true,
            arrows: false,
            infinite: false,
            mobileFirst: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            responsive: [
            {
                breakpoint: 1399,
                settings: {
                    dots: false,
                    arrows: true,
                    slidesToShow: parseInt(context.themeSettings.halo_prodByCateIDCol),
                    slidesToScroll: parseInt(context.themeSettings.halo_prodByCateIDCol)
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    dots: false,
                    arrows: true,
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 320,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }]
        });
    }

    function loadProductByCategory(block) {
        const templates = {
            template: {
                carousel: 'products/carousel-2',
                brand: 'halothemes/product/halo-brandCate'
            }
        }

        if (block.matches('.ajax-loaded')) return;
        block.classList.add('ajax-loaded');
        
        var $block = $(block),
            wrap = $block.find('.productCarouselByCate'),
            col = wrap.data('col'),
            brands = $block.find('.brandCarouselByCate'),
            cateUrl = $block.find('.halo_prodByCate').data('category-url'),
            blockId = $block.attr('id');

        $block.find('.loadingOverlay').show();
        utils.api.getPage(cateUrl, templates, (err, response) => {
            if (err) return;

            wrap.append(response.carousel);
            brands.append(response.brand);
            if ($block.find('.halo-product-by-cate-block-2').length) productByCategoryCarousel(wrap, col);
            $block.find('.loadingOverlay').remove();
            $block.addClass('is-load');
            haloLoadImageBrand($context, blockId)
            wrap.addClass('load-carousel');
            wrap.find('.productCarousel-slide').addClass('animated');
        });
    }

    function productByCategoryCarousel($wrap, $col) {
        if ($col == 1) {
            $wrap.slick({
                dots: true,
                arrows: false,
                infinite: false,
                mobileFirst: true,
                slidesToShow: 2,
                slidesToScroll: 2,
                responsive: [
                {
                    breakpoint: 1399,
                    settings: {
                        dots: true,
                        arrows: true,
                        slidesToShow: $col,
                        slidesToScroll: $col
                    }
                }]
            });
        } else {
            $wrap.slick({
                dots: true,
                arrows: false,
                infinite: false,
                mobileFirst: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                responsive: [
                {
                    breakpoint: 1399,
                    settings: {
                        arrows: true,
                        slidesToShow: $col,
                        slidesToScroll: $col
                    }
                },
                {
                    breakpoint: 1024,
                    settings: {
                        arrows: true,
                        slidesToShow: 4,
                        slidesToScroll: 4
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 320,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                }]
            });
        }
    }

    function blogTags() {
        if ($('body[data-page-type="blog"]').length) {
            let arr = {};

            $('#blog-tags .recentPosts_tags [data-tag]').each(function(i) {
                var txt = $(this).data('tag');

                if (arr[txt]) {
                    $(this).remove();
                } else {
                    arr[txt] = true;
                }                                        
            });

            $('#blog-tags .recentPosts_tags').show();
        }
        else if ($('body[data-page-type="blog_post"]').length) {
            const url_blogTags = '/blog';

            $.get(url_blogTags, function(data) {
                let arr = {};
                const response = $(data).find('#blog-tags .recentPosts_tags').html();

                $('#blog-tags .recentPosts_tags').html(response);

                $('#blog-tags .recentPosts_tags [data-tag]').each(function(i) {
                    var txt = $(this).data('tag');

                    if (arr[txt]) {
                        $(this).remove();
                    } else {
                        arr[txt] = true;
                    }                                        
                });

                $('#blog-tags .recentPosts_tags').show();
            });
        }
    }

    function haloVideoPopup() {
        const modal = modalFactory('#halo-video-popup')[0],
              url = $('[data-reveal-id="halo-video-popup"]').data('url-video');

        $(document).on('click', '[data-reveal-id="halo-video-popup"]', () => {
            const $content = '<div class="modal-body">\
                        <button class="modal-close" type="button" title="Close">\
                        <span class="aria-description--hidden">Close</span>\
                        <span aria-hidden="true">&#215;</span>\
                    </button>\
            <div class="video-popup" data-video-gallery>\
                <div id="video-popup-content">\
                    <div class="video-popup-main">\
                        <iframe\
                            id="player"\
                            type="text/html"\
                            width="100%"\
                            frameborder="0"\
                            webkitAllowFullScreen\
                            mozallowfullscreen\
                            allowFullScreen\
                            src="'+url+'"\
                            data-video-player>\
                        </iframe>\
                        </div>\
                    </div>\
                </div>\
            </div>';
            modal.updateContent($content);
        });
    }

    function countDownProduct(selector) {
        setInterval(() => {
            let listCountDown = document.querySelectorAll(selector);
        
            listCountDown.forEach((elem) => {
                if (!elem.innerHTML.trim()) {
                    let countDown = elem.getAttribute('data-countdown');
                    let countDownDate = new Date(countDown).getTime();
                    let countDownFunction = setInterval(function () {
                        let now = new Date().getTime(),
                        distance = countDownDate - now;
            
                        if (distance < 0) {
                            clearInterval(countDownFunction);
                            seft.remove();
                        } else {
                            let days = Math.floor(distance / (1000 * 60 * 60 * 24));
                            let hours = Math.floor(
                                (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                            );
                            let minutes = Math.floor(
                                (distance % (1000 * 60 * 60)) / (1000 * 60)
                            );
                            let seconds = Math.floor((distance % (1000 * 60)) / 1000);
                            if (days < 10) {
                                days = "0" + days.toString();
                            }
                            if (hours < 10) {
                                hours = "0" + hours.toString();
                            }
                            if (minutes < 10) {
                                minutes = "0" + minutes.toString();
                            }
                            if (seconds < 10) {
                                seconds = "0" + seconds.toString();
                            }
                            let title = 'End in: ',dText,hText,mText,sText;

                            if (settings.hl_skin_3) {
                                dText = '<span class="text">days</span>';
                                hText = '<span class="text">hours</span>';
                                mText = '<span class="text">mins</span>';
                                sText = '<span class="text">secs</span>';
                            } else {
                                dText = 'd :';
                                hText = 'h :';
                                mText = 'm :';
                                sText = 's';
                            }
                            
                            let strCountDown =
                                '<span class="title">'+title+'</span><span class="num">' +
                                days + dText +
                                '</span> <span class="num">' +
                                hours + hText +
                                '</span> <span class="num">' +
                                minutes + mText +
                                '</span> <span class="num">' +
                                seconds + sText +
                                '</span>';
                            elem.classList.add("is-active");
                            elem.innerHTML = strCountDown;
                        }
                    }, 1000);
                }
            });
        }, 1000);
    }

    function globalCarousel(block) {
        if (block.matches('.carousel-loaded')) return;
        block.classList.add('carousel-loaded');

        if (block.matches('.featuredCates--carousel')) {
            const $row = parseInt(block.getAttribute('data-row'));

            featuredCates($(block), $row);
        }
        if (block.matches('.halo_bannerbycategory-carousel')) {
            bannerbycategoryCarousel($(block));
        }
        if (block.matches('.popularBrands--carousel')) {
            popularBrands($(block));
        }
        if (block.matches('.halo-recent-post:not([data-carousel-mobile="true"])')) {
            const $col = parseInt(block.getAttribute('data-col'));

            recentPostCarousel($(block), $col);
        }
        if (block.matches('.topBrands--carousel')) {
            const $col = parseInt(block.getAttribute('data-col')),
                  $row = parseInt(block.getAttribute('data-row'));

            var $dot = block.getAttribute('data-dot');

            if($dot)
                $dot = true;
            else 
                $dot = false;

            topBrandsCarousel($(block), $col, $row, $dot);
        }
        if (block.matches('.footer_service')) {
            footerServiceCarousel($(block));
        }
        if (block.matches('.footer-certificate')) {
            footerCertificate($(block));
        }
        if (block.matches('.categoryCustom-carousel')) {
            categoryCustom($(block));
        }
        if (block.matches('.customerReview--carousel')) {
            customerReviewCarousel($(block));
        }
        if (block.matches('.categoryImage-carousel')) {
            const $col = parseInt(block.getAttribute('data-col'));

            categoryImageCarousel($(block), $col);
        }
        if (block.matches('.halo-description')) {
            const $block = block.querySelector('.description-slider');
            
            var $col = parseInt($block.getAttribute('data-col'));

            if(!$col) $col=3;

            categoryImageCarousel($($block), $col);
        }
    }

    function featuredCates($block, $row) {
        $block.slick({
            arrows: false,
            dots: true,
            rows: $row,
            infinite: false,
            mobileFirst: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            responsive: [
            {
                breakpoint: 1024,
                settings: {
                    dots: false,
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 550,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }]
        });
    }

    function bannerbycategoryCarousel($block) {
        $block.slick({
            arrows: false,
            dots: true,
            infinite: false,
            mobileFirst: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            },
            {
                breakpoint: 550,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 450,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }]
        });
    }

    function popularBrands($block) {
        $block.slick({
            arrows: false,
            dots: true,
            infinite: false,
            mobileFirst: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 550,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }]
        });
    }

    function recentPostCarousel($block, $col) {
        $block.slick({
            dots: true,
            arrows: false,
            fade: false,
            infinite: true,
            mobileFirst: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: $col,
                        slidesToScroll: $col,
                    }
                },
                {
                    breakpoint: 550,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                    }
                }
            ]
        });
    }

    function topBrandsCarousel($block, $col, $row, $dot) {
        $block.slick({
            arrows: false,
            dots: true,
            infinite: true,
            mobileFirst: true,
            rows: $row,
            slidesToShow: 2,
            slidesToScroll: 2,
            responsive: [
            {
                breakpoint: 1399,
                settings: {
                    arrows: true,
                    dots: $dot,
                    slidesToShow: $col,
                    slidesToScroll: $col
                }
            },
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 6
                }
            },
            {
                breakpoint: 550,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            }]
        });
    }

    function footerServiceCarousel($block) {
        $block.slick({
            arrows: false,
            dots: true,
            infinite: false,
            mobileFirst: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            },
            {
                breakpoint: 550,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }]
        });
    }

    function footerCertificate($block) {
        $block.slick({
            arrows: true,
            dots: false,
            infinite: true,
            mobileFirst: true,
            slidesToShow: 1,
            slidesToScroll: 1
        });
    }

    function categoryCustom($block) {
        $block.slick({
            arrows: false,
            dots: true,
            infinite: false,
            mobileFirst: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5
                }
            },
            {
                breakpoint: 550,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 375,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }]
        });
    }

    function customerReviewCarousel($block) {
        $block.slick({
            arrows: false,
            dots: true,
            infinite: true,
            mobileFirst: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            responsive: [
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }]
        });
    }

    function categoryImageCarousel($block, $col) {
        $block.slick({
            arrows: false,
            dots: true,
            infinite: false,
            mobileFirst: true,
            slidesToShow: 2,
            slidesToScroll: 2,
            responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: $col,
                    slidesToScroll: $col
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            }]
        });
    }

    function haloAnimation(block) {
        if (block.matches('.animate-loaded')) return;
        block.classList.add('animate-loaded');

        block.classList.add('animated');
    }

    function haloLoad() {
        const handler = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const $block = entry.target;
                    const type = $block.dataset.haloLoad;

                    switch(type) {
                        case 'init-carousel':
                            globalCarousel($block);
                            break;
                        case 'category-product-tab':
                            loadProductTabByCategory($block);
                            break;
                        case 'category-product':
                            loadProductByCategory($block);
                            break;
                        case 'animation':
                            haloAnimation($block);
                            break;
                    }
                }
            })
        }

        const $section = document.querySelectorAll('[data-halo-load]'),
        options = {
            threshold: .05
        };

        if (!$section) return;
        const observer = new IntersectionObserver(handler, options);
        $section.forEach(element => {
            observer.observe(element);
        });
    }
}
