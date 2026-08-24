import 'focus-within-polyfill';

import './global/jquery-migrate';
import './common/select-option-plugin';
import PageManager from './page-manager';
import currencySelector from './global/currency-selector';
import foundation from './global/foundation';
import cartPreview from './global/cart-preview';
import privacyCookieNotification from './global/cookieNotification';
import carousel from './common/carousel';
import svgInjector from './global/svg-injector';
import utils from '@bigcommerce/stencil-utils'
import haloGlobal from './halothemes/haloGlobal';

function getPorductsFromCategoy() {
    $('[data-categoryUrl]').each((index, el) => {
        const $this = $(el);
        const $categoryUrl = $this.attr('data-categoryUrl');

        utils.api.getPage($categoryUrl, { template: 'category/custom-product-listing' }, (err, response) => {
            if (response) {
                // Append the new HTML content
                $this.html(response);

                // Show the loader or any preceding hidden elements
                $this.prev().removeClass("hide");

                // Ensure all products and their articles are visible
                $(response).find(".product").each(function () {
                    // $(".halo-fadeInUp",this).css("opacity", 1);
                    if (!$(this).is(":visible")) {
                        $(this).show();
                        $(this).find("article").show();
                    }
                });

                // Check if Slick is initialized; reinitialize after loading
                if ($this.hasClass('slick-initialized')) {
                    $this.slick('unslick'); // Destroy existing instance
                }

                // Reinitialize Slick — 2-up on mobile to match live product sections
                $this.slick({
                    rows: 1,
                    dots: false,
                    arrows: true,
                    mobileFirst: true,
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: false,
                    responsive: [
                        {
                            breakpoint: 1399,
                            settings: {
                                dots: false,
                                arrows: true,
                                slidesToShow: 5,
                                slidesToScroll: 5
                            }
                        },
                        {
                            breakpoint: 1025,
                            settings: {
                                slidesToScroll: 4,
                                slidesToShow: 4,
                                dots: false,
                                arrows: true,
                            },
                        },
                        {
                            breakpoint: 767,
                            settings: {
                                slidesToScroll: 3,
                                slidesToShow: 3,
                                dots: false,
                                arrows: true,
                            },
                        },
                        {
                            // Keep 2-up through phone + large-phone widths
                            breakpoint: 551,
                            settings: {
                                slidesToScroll: 2,
                                slidesToShow: 2,
                                dots: false,
                                arrows: true,
                            },
                        },
                    ],
                });
            }
        });
    });
}

export default class Global extends PageManager {
    onReady() {
        const { cartId, secureBaseUrl } = this.context;
        if (!$('body').hasClass('page-type-cart')) {
            cartPreview(secureBaseUrl, cartId, this.context);
        }
        currencySelector(cartId);
        foundation($(document));
        carousel(this.context);
        privacyCookieNotification();
        svgInjector();
        haloGlobal(this.context);
        getPorductsFromCategoy();
    }
}
