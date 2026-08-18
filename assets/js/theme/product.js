/*
 Import all product specific js
 */
import utils from '@bigcommerce/stencil-utils';
import PageManager from './page-manager';
import Review from './product/reviews';
import collapsibleFactory from './common/collapsible';
import ProductDetails from './common/product-details';
import videoGallery from './product/video-gallery';
import { classifyForm } from './common/utils/form-utils';
import modalFactory from './global/modal';
import haloLoadImageBrand from './halothemes/haloLoadImageBrand';
import haloBundleProducts from './halothemes/haloBundleProducts';
import haloSideAllCategory from './halothemes/haloSideAllCategory';
import haloSidebarToggle from './halothemes/haloSidebarToggle';
import haloStickyAddToCart from './halothemes/haloStickyAddToCart';

export default class Product extends PageManager {
    constructor(context) {
        super(context);
        this.url = window.location.href;
        this.$reviewLink = $('[data-reveal-id="modal-review-form"]');
        this.$bulkPricingLink = $('[data-reveal-id="modal-bulk-pricing"]');
        this.reviewModal = modalFactory('#modal-review-form')[0];
    }

    onReady() {
        // Listen for foundation modal close events to sanitize URL after review.
        $(document).on('close.fndtn.reveal', () => {
            if (this.url.indexOf('#write_review') !== -1 && typeof window.history.replaceState === 'function') {
                window.history.replaceState(null, document.title, window.location.pathname);
            }
        });

        let validator;

        // Init collapsible
        collapsibleFactory();
        haloLoadImageBrand(this.context, 'productView');
        haloBundleProducts($('.halo-productView'), this.context);
        haloSideAllCategory();
        haloSidebarToggle();

        this.productDetails = new ProductDetails($('.productView'), this.context, window.BCData.product_attributes);
        this.productDetails.setProductVariant();

        videoGallery();

        this.bulkPricingHandler();

        this.soldProduct($('.productView-soldProduct'));
        this.countDownProduct($('.productView-countDown'));
        this.productShippingTab();
        this.productCustomTab();
        this.productFAQTab();
        this.checkProduct();
        this.videoPopup();

        haloStickyAddToCart($('.halo-productView'), this.context);

        const $reviewForm = classifyForm('.writeReview-form');

        if ($reviewForm.length === 0) return;

        const review = new Review({ $reviewForm });

        $('body').on('click', '[data-reveal-id="modal-review-form"]', () => {
            validator = review.registerValidation(this.context);
            this.ariaDescribeReviewInputs($reviewForm);
        });

        $reviewForm.on('submit', () => {
            if (validator) {
                validator.performCheck();
                return validator.areAll('valid');
            }

            return false;
        });

        this.productReviewHandler();
    }

    ariaDescribeReviewInputs($form) {
        $form.find('[data-input]').each((_, input) => {
            const $input = $(input);
            const msgSpanId = `${$input.attr('name')}-msg`;

            $input.siblings('span').attr('id', msgSpanId);
            $input.attr('aria-describedby', msgSpanId);
        });
    }

    productReviewHandler() {
        if (this.url.indexOf('#write_review') !== -1) {
            this.$reviewLink.trigger('click');
        }
    }

    bulkPricingHandler() {
        if (this.url.indexOf('#bulk_pricing') !== -1) {
            this.$bulkPricingLink.trigger('click');
        }
    }

    soldProduct($wrapper) {
        if($wrapper.length > 0) {
            var numbersProduct_text = this.context.themeSettings.product_soldProduct_products,
                numbersHours_text = this.context.themeSettings.product_soldProduct_hours,
                soldProductText = this.context.themeSettings.product_soldProduct_text,
                soldProductText2 = this.context.themeSettings.product_soldProduct_hours_text;

            var numbersProductList =  JSON.parse("[" + numbersProduct_text + "]"), 
                numbersProductItem = (Math.floor(Math.random()*numbersProductList.length)),
                numbersHoursList =  JSON.parse("[" + numbersHours_text + "]"),
                numbersHoursItem = (Math.floor(Math.random()*numbersHoursList.length));
         
            $wrapper.html('<svg class="icon"><use xlink:href="#icon-fire"/></svg><span class="text">' + numbersProductList[numbersProductItem] + " " + soldProductText + " " + numbersHoursList[numbersHoursItem] + " " + soldProductText2 + '</span>');
            $wrapper.show();
        }
    }

    countDownProduct($wrapper) {
        if($wrapper.length > 0) {
            var countDown = $wrapper.data('countdown'),
                countDownDate = new Date(countDown).getTime(),
                seft = $wrapper;

            var countdownfunction = setInterval(function() {
                var now = new Date().getTime(),
                    distance = countDownDate - now;

                if (distance < 0) {
                    clearInterval(countdownfunction);
                    seft.remove();
                } else {
                    var days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                        seconds = Math.floor((distance % (1000 * 60)) / 1000),
                        strCountDown = '<div class="item"><span class="num">'+days+'</span><span class="text">days</span></div>\
                                        <div class="item"><span class="num">'+hours+'</span><span class="text">hours</span></div>\
                                        <div class="item"><span class="num">'+minutes+'</span><span class="text">mins</span></div>\
                                        <div class="item"><span class="num">'+seconds+'</span><span class="text">secs</span></div>';

                    seft.html(strCountDown);
                }
            }, 1000);
        }
    }

    productShippingTab(){
        if(this.context.themeSettings.show_product_details_tabs == true){
            if(this.context.themeSettings.show_shipping_tab == true){
                if(this.context.themeSettings.show_shipping_tab_type == "all"){
                    const url = this.context.themeSettings.show_shipping_tab_link;

                    const option = {
                        template: 'halothemes/page/halo-page-template'
                    };

                    utils.api.getPage(url, option, (err, response) => {
                        $(response).appendTo('#tab-shipping-mobile');

                        if ($('.productView-tab #tab-shipping-mobile').text().trim() == '') {
                            $('.productView-tab #tab-shipping').hide();
                        }
                    });

                    $('#tab-description').find('[data-shipping-tab]').remove();

                } else if(this.context.themeSettings.show_shipping_tab_type == "custom"){
                    $('#tab-description').find('[data-shipping-tab]').appendTo('#tab-shipping-mobile');
                }
            }
        } else {
            $('.productView-description').find('[data-shipping-tab]').remove();
        }
    }

    productCustomTab(){
        if(this.context.themeSettings.show_product_details_tabs == true){
            if(this.context.themeSettings.show_custom_tab == true){
                if(this.context.themeSettings.show_custom_tab_type == "all"){
                    const url = this.context.themeSettings.show_custom_tab_link;

                    const option = {
                        template: 'halothemes/page/halo-page-template'
                    };

                    utils.api.getPage(url, option, (err, response) => {
                        $(response).appendTo('#tab-custom-mobile');

                        if ($('.productView-tab #tab-custom-mobile').text().trim() == '') {
                            $('.productView-tab #tab-custom').hide();
                        }
                    });

                    $('#tab-description').find('[data-custom-tab]').remove();

                } else if(this.context.themeSettings.show_custom_tab_type == "custom"){
                    $('#tab-description').find('[data-custom-tab]').appendTo('#tab-custom-mobile');
                }
            }
        } else {
            $('.productView-description').find('[data-custom-tab]').remove();
        }
    }

    productFAQTab(){
        if(this.context.themeSettings.show_product_details_tabs == true){
            if(this.context.themeSettings.show_faq_tab == true){
                if(this.context.themeSettings.show_faq_tab_type == "all"){
                    const url = this.context.themeSettings.show_faq_tab_link;

                    const option = {
                        template: 'halothemes/page/halo-page-template'
                    };

                    utils.api.getPage(url, option, (err, response) => {
                        $(response).appendTo('#tab-faq-mobile');

                        if ($('.productView-tab #tab-faq-mobile').text().trim() == '') {
                            $('.productView-tab #tab-faq').hide();
                        }
                    });

                    $('#tab-description').find('[data-faq-tab]').remove();

                } else if(this.context.themeSettings.show_faq_tab_type == "custom"){
                    $('#tab-description').find('[data-faq-tab]').appendTo('#tab-faq-mobile');
                }
            }
        } else {
            $('.productView-description').find('[data-faq-tab]').remove();
        }
    }

    checkProduct(){
        const relatedProducts = $('#halo-related-products'),
            similarProducts = $('#halo-similar-products');

        if(relatedProducts.length) {
            if(!relatedProducts.find('.slick-track').html().length && relatedProducts.length) {
                relatedProducts.hide()
            }
        }
        if(similarProducts.length) {
            if(!similarProducts.find('.slick-track').html().length && similarProducts.length) {
                similarProducts.hide()
            }
        }
    }

    videoPopup() {
        if ($('.video-link').length > 0) {
            $(document).on('click', '.video-link', function(e) {
                e.preventDefault();

                $('.videoGallery-list .videoGallery-item:first-child >a').trigger('click');
            });
        }
    }
}
