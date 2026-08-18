import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import utils from '@bigcommerce/stencil-utils';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';
import { createTranslationDictionary } from '../theme/common/utils/translations-utils';
import haloSideAllCategory from './halothemes/haloSideAllCategory';
import haloLoadImageBrand from './halothemes/haloLoadImageBrand';
import haloproductDisplayMode from './halothemes/haloProductDisplayMode';
import haloSidebarToggle from './halothemes/haloSidebarToggle';
import haloStickyToolbar from './halothemes/haloStickyToolbar';

export default class Category extends CatalogPage {
    constructor(context) {
        super(context);
        this.validationDictionary = createTranslationDictionary(context);
    }

    setLiveRegionAttributes($element, roleType, ariaLiveStatus) {
        $element.attr({
            role: roleType,
            'aria-live': ariaLiveStatus,
        });
    }

    makeShopByPriceFilterAccessible() {
        if (!$('[data-shop-by-price]').length) return;

        if ($('.navList-action').hasClass('is-active')) {
            $('a.navList-action.is-active').focus();
        }

        $('a.navList-action').on('click', () => this.setLiveRegionAttributes($('span.price-filter-message'), 'status', 'assertive'));
    }

    onReady() {
        this.arrangeFocusOnSortBy();

        $('[data-button-type="add-cart"]').on('click', (e) => this.setLiveRegionAttributes($(e.currentTarget).next(), 'status', 'polite'));

        this.makeShopByPriceFilterAccessible();

        compareProducts(this.context);

        this.initFacetedSearch();

        if (!$('#facetedSearch').length) {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);

            // Refresh range view when shop-by-price enabled
            const urlParams = new URLSearchParams(window.location.search);

            if (urlParams.has('search_query')) {
                $('.reset-filters').show();
            }

            $('input[name="price_min"]').attr('value', urlParams.get('price_min'));
            $('input[name="price_max"]').attr('value', urlParams.get('price_max'));
        }

        $('a.reset-btn').on('click', () => this.setLiveRegionsAttributes($('span.reset-message'), 'status', 'polite'));

        this.ariaNotifyNoProducts();
        haloSideAllCategory();
        haloproductDisplayMode();
        haloSidebarToggle();
        haloStickyToolbar(this.context);
        this.loadBrandForProductCard(this.context);
        this.showProductsPerPage();
        this.showMoreProducts();
    }

    ariaNotifyNoProducts() {
        const $noProductsMessage = $('[data-no-products-notification]');
        if ($noProductsMessage.length) {
            $noProductsMessage.focus();
        }
    }

    initFacetedSearch() {
        const {
            price_min_evaluation: onMinPriceError,
            price_max_evaluation: onMaxPriceError,
            price_min_not_entered: minPriceNotEntered,
            price_max_not_entered: maxPriceNotEntered,
            price_invalid_value: onInvalidPrice,
        } = this.validationDictionary;
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('body').triggerHandler('compareReset');

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        }, {
            validationErrorMessages: {
                onMinPriceError,
                onMaxPriceError,
                minPriceNotEntered,
                maxPriceNotEntered,
                onInvalidPrice,
            },
        });
    }

    loadBrandForProductCard(context){
        if($('#featured-products .card').length > 0){
            haloLoadImageBrand(context, 'featured-products');
        }

        if($('#product-listing-container .product').length > 0){
            haloLoadImageBrand(context, 'product-listing-container');
        }
    }

    showProductsPerPage(){
        try {
            var url = new URL(window.location.href);
            var c = url.searchParams.get("limit");
            if(c != null){
                var limit = document.querySelectorAll('select#limit option');
                Array.prototype.forEach.call(limit, function(element) {
                    if(element.value == c){
                        element.selected = true;
                    }
                });
            }
        } catch(e) {}
    }

    showMoreProducts() {
        const context = this.context;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: context.categoryProductsPerPage,
                    },
                },
            },
            template: {
                productListing: 'halothemes/category/halo-product-listing',
                sidebar: 'category/sidebar',
                paginator: 'halothemes/category/halo-product-paginator',
            },
            showMore: 'category/show-more',
        };

        const $productListingContainer = $('#product-listing-container .productListing'),
              $paginatorContainer = $('.pagination-list');

        $('#listing-showmoreBtn > a').on('click', (event) => {
            event.preventDefault();

            var nextPage = $('.pagination-item--current').next(),
                link = nextPage.find("a").attr("href");

            if (link == undefined) {
                if (!$('#listing-showmoreBtn > a').hasClass('disable')) {
                    $('#listing-showmoreBtn > a').addClass('disable');
                }
            } else {
                $('#listing-showmoreBtn > a').addClass('loading');

                utils.api.getPage(link.replace("http://", "//"), requestOptions, (err, content) => {
                    if (err) {
                        throw new Error(err);
                    }

                    if (content.productListing != '') {
                        $productListingContainer.append(content.productListing);
                        $paginatorContainer.html($(content.paginator).find('.pagination-list').children());

                        $('#listing-showmoreBtn > a').removeClass('loading').blur();

                        nextPage = $('.pagination-item--current').next();

                        if (nextPage.length === 0) {
                            $('#listing-showmoreBtn > a').addClass('disable').text('No more products');
                            $('.pagination .pagination-info .end').html($(content.paginator).find('.pagination-info .total').text());
                        } else {
                            if (Number($(content.paginator).find('.pagination-info .end').text()) < Number($(content.paginator).find('.pagination-info .total').text())) {
                                $('.pagination .pagination-info .end').html($(content.paginator).find('.pagination-info .end').text());
                            }
                        }

                        haloLoadImageBrand(context, 'product-listing-container');
                    }
                });
            }
        });
    }
}
