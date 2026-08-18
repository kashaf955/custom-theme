import utils from '@bigcommerce/stencil-utils';

export default class haloMegaMenu{
    constructor() {}

    menuItem(num) {
        return {
            setMegaMenu(param) {
                param = $.extend({
                    style: '',
                    dropAlign: 'fullWidth',
                    dropWidth: '493px',
                    cateColumns: 1,
                    disabled: false,
                    bottomCates: '',
                    products:'',
                    productId: '',
                    label: '',
                    labelType: '',
                    content: '',
                    contentLeft: '',
                    contentRight: '',
                    images:'',
                    imagesTop: '',
                    imagesCustom: '',
                    imagesLeft: '',
                    imagesRight: ''
                }, param);

                var $scope = $('.cwt-nav-categories .cwt-nav__category-list > li:nth-child('+num+')');

                if (!$scope.length) {
                    $scope = $('.navPages-list-megamenu:not(.cwt-nav__category-list) > li:nth-child('+num+')');
                }

                if (!$scope.length) {
                    $scope = $('.navPages-list:not(.navPages-list--user) > li:nth-child('+num+')');
                }

                if(!$scope.hasClass('navPages-item-toggle')){
                    if (param.disabled === false) {
                        const subMegaMenu = $scope.find('> .navPage-subMenu');

                        if(param.style === 'style 1') {
                            if(!$scope.hasClass('has-megamenu')){
                                $scope.addClass('has-megamenu style-1 fullWidth');

                                if(!subMegaMenu.find('.cateArea').length){
                                    subMegaMenu.find('.container > .navPage-subMenu-list').wrap('<div class="cateArea columns-'+param.cateColumns+'"></div>');
                                }

                                subMegaMenu.find('.imageArea').css({
                                    'width': '100%',
                                    'max-width': param.imageAreaWidth
                                });

                                subMegaMenu.find('.cateArea').css({
                                    'width': '100%',
                                    'max-width': param.cateAreaWidth
                                });

                                if (param.imagesTop.length && (param.imagesTop !== '')) {
                                    function megaImageTop(array) {
                                        var j = 2;
                                        for (var i = 0, l = array.length; i < l; i++) {
                                            j = j + 1;
                                            subMegaMenu.find('.cateArea > ul > li:nth-child(' + j + ') > .navPages-action').after(array[i]);
                                        }
                                    }
                                    megaImageTop(param.imagesTop);
                                }

                                if (!subMegaMenu.find('.bottomMegamenu').length) {
                                    subMegaMenu.append('<div class="bottomMegamenu halo-fadeInLeft" data-halo-animate="0">' + param.bottomMegamenu + '</div>');
                                }

                                subMegaMenu.addClass('haloCustomScrollbar');
                            }
                        }

                        if(param.style === 'style 2') {
                            if(!$scope.hasClass('has-megamenu')){
                                $scope.addClass('has-megamenu style-2 fullWidth');

                                if(!subMegaMenu.find('.cateArea').length){
                                    subMegaMenu.find('.container > .navPage-subMenu-list').wrap('<div class="cateArea columns-'+param.cateColumns+'"></div>');
                                }

                                if(!subMegaMenu.find('.imageArea').length){
                                    subMegaMenu.find('.container').append('<div class="imageArea"><div class="megamenu-right-item halo-fadeInLeft" data-halo-animate="0">'+param.imagesRight+'</div></div>');

                                    if (param.products.length && (param.products !== '')) {
                                        subMegaMenu.find('.imageArea').prepend('<div class="megamenu-left-item megamenu-product-list halo-fadeInLeft" data-halo-animate="0">'+param.products+'</div>');
                                    }
                                }

                                subMegaMenu.find('.imageArea').css({
                                    'width': '100%',
                                    'max-width': param.imageAreaWidth
                                });

                                subMegaMenu.find('.cateArea').css({
                                    'width': '100%',
                                    'max-width': param.cateAreaWidth
                                });

                                if (param.productId.length && (param.productId !== '')) {
                                    var productIDS = param.productId,
                                        featuredProductCarousel = subMegaMenu.find('.megamenu-product-list');
    
                                    if (productIDS !== '') {
                                        var listIDs = JSON.parse("[" + productIDS + "]");
    
                                        if (featuredProductCarousel.length) {
                                            featuredProductCarousel.find('.megamenu-slider').addClass('is-loading');
    
                                            const listIDs_length = listIDs.length;
                                            let n = 0;
    
                                            for (var i = 0; i < listIDs_length; i++) {
                                                var productId = listIDs[i];
    
                                                utils.api.product.getById(productId, { template: 'halothemes/product/halo-productTemp' }, (err, response) => {
                                                    if (err) return;

                                                    var hasProd = $(response);
    
                                                    if(hasProd != undefined && hasProd !== null && hasProd !== ''){
                                                        featuredProductCarousel.find('.megamenu-slider').append(response);
                                                        n++;
                                                        if (n == listIDs_length) {
                                                            productSlider();
                                                        }
                                                    }
                                                });
                                            }
    
                                            featuredProductCarousel.find('.megamenu-slider').removeClass('is-loading');
                                        }
                                    }
    
                                    function productSlider(){
                                        $('.megamenu-slider', subMegaMenu).slick({
                                            infinite: false,
                                            dots: true,
                                            arrows: false,
                                            slidesToShow: 1,
                                            slidesToScroll: 1,
                                            adaptiveHeight: true
                                        });
                                    } 
                                }

                                subMegaMenu.addClass('haloCustomScrollbar');
                            }
                        }

                        if(param.style === 'style 3') {
                            if(!$scope.hasClass('has-megamenu')){
                                $scope.addClass('has-megamenu style-3 fullWidth');

                                if(!subMegaMenu.find('.cateArea').length){
                                    subMegaMenu.find('.container > .navPage-subMenu-list').wrap('<div class="cateArea columns-'+param.cateColumns+'"></div>');
                                }

                                if(!subMegaMenu.find('.imageArea').length){
                                    subMegaMenu.find('.container').append('<div class="imageArea"><div class="megamenu-right-item halo-fadeInLeft" data-halo-animate="0">'+param.imagesRight+'</div></div>');
                                }

                                subMegaMenu.find('.imageArea').css({
                                    'width': '100%',
                                    'max-width': param.imageAreaWidth
                                });

                                subMegaMenu.find('.cateArea').css({
                                    'width': '100%',
                                    'max-width': param.cateAreaWidth
                                });

                                if (!subMegaMenu.find('.bottomMegamenu').length) {
                                    subMegaMenu.append('<div class="bottomMegamenu halo-fadeInLeft" data-halo-animate="0">' + param.bottomMegamenu + '</div>');
                                }

                                subMegaMenu.addClass('haloCustomScrollbar');
                            }
                        }

                        const navPagesAction = $scope.children('.navPages-action');

                        if (param.labelType === 'new') {
                            navPagesAction.find('.text').append('<span class="navPages-label new-label">'+param.label+'</span>');
                        } else if (param.labelType === 'sale') {
                            navPagesAction.find('.text').append('<span class="navPages-label sale-label">'+param.label+'</span>');
                        } else if (param.labelType === 'hot') {
                            navPagesAction.find('.text').append('<span class="navPages-label hot-label">'+param.label+'</span>');
                        }
                    } else{
                        const navPagesAction = $scope.children('.navPages-action');

                        if (param.labelType === 'new') {
                            navPagesAction.find('.text').append('<span class="navPages-label new-label">'+param.label+'</span>');
                        } else if (param.labelType === 'sale') {
                            navPagesAction.find('.text').append('<span class="navPages-label sale-label">'+param.label+'</span>');
                        } else if (param.labelType === 'hot') {
                            navPagesAction.find('.text').append('<span class="navPages-label hot-label">'+param.label+'</span>');
                        }
                    }
                }

                return this;
            }
        }
    }
}
