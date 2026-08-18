import _ from 'lodash';
import utils from '@bigcommerce/stencil-utils';
import StencilDropDown from './stencil-dropdown';
import haloQuickSearch from '../halothemes/haloSearchCategories';

export default function () {
    const TOP_STYLING = 'top: 55px;';
    const $quickSearchResults = $('.quickSearchResults');
    const $quickSearchForms = $('[data-quick-search-form]');
    const $quickSearchExpand = $('#quick-search-expand');
    const $searchQuery = $quickSearchForms.find('[data-search-quick]');
    const stencilDropDownExtendables = {
        hide: () => {
            $quickSearchExpand.attr('aria-expanded', false);
            $searchQuery.trigger('blur');
        },
        show: (event) => {
            $quickSearchExpand.attr('aria-expanded', true);
            $searchQuery.trigger('focus');
            event.stopPropagation();
        },
    };
    const stencilDropDown = new StencilDropDown(stencilDropDownExtendables);
    stencilDropDown.bind($('[data-search="quickSearch"]'), $('#quickSearch'), TOP_STYLING);

    stencilDropDownExtendables.onBodyClick = (e, $container) => {
        // If the target element has this data tag or one of it's parents, do not close the search results
        // We have to specify `.modal-background` because of limitations around Foundation Reveal not allowing
        // any modification to the background element.
        if ($(e.target).closest('#quickSearch, .modal-background').length === 0) {
            stencilDropDown.hide($container);
            $quickSearchResults.empty();
            $('body').removeClass('openQuickSearch');
        }
    };

    // stagger searching for 1200ms after last input
    const debounceWaitTime = 1200;
    const doSearch = _.debounce((searchQuery, category) => {

        var quickSearch = new haloQuickSearch;

        quickSearch.search(searchQuery, category, { template: 'search/quick-results' }, (err, response) => {
            if (err) {
                return false;
            }

            $('body').addClass('openQuickSearch');

            $quickSearchResults.html(response);
            const $quickSearchResultsCurrent = $quickSearchResults.filter(':visible');

            const $noResultsMessage = $quickSearchResultsCurrent.find('.quickSearchMessage');
            if ($noResultsMessage.length) {
                $noResultsMessage.attr({
                    role: 'status',
                    'aria-live': 'polite',
                });
            } else {
                const $quickSearchAriaMessage = $quickSearchResultsCurrent.next();
                $quickSearchAriaMessage.addClass('u-hidden');

                const predefinedText = $quickSearchAriaMessage.data('search-aria-message-predefined-text');
                const itemsFoundCount = $quickSearchResultsCurrent.find('.product').length;

                $quickSearchAriaMessage.text(`${itemsFoundCount} ${predefinedText} ${searchQuery}`);

                setTimeout(() => {
                    $quickSearchAriaMessage.removeClass('u-hidden');
                }, 100);
            }
        });
    }, debounceWaitTime);

    utils.hooks.on('search-quick', (event) => {
        const searchQuery = $(event.target).val();
        const category = $(event.target).parents('form').find('select[name="category"]').val();

        $('body').addClass('openQuickSearch');

        // server will only perform search with at least 3 characters
        if (searchQuery.length < 3) {
            return;
        }

        doSearch(searchQuery, category);
    });

    // Catch the submission of the quick-search forms
    $quickSearchForms.on('submit', event => {
        const $target = $(event.currentTarget);
        const searchQuery = $target.find('input').val();

        if (searchQuery.length === 0) {
            return event.preventDefault();
        }

        return true;
    });

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    function searchCategory() {
        var category = getUrlParameter('category');

        $('#search_category').val(category).trigger('change');
        $('select[name="category"]').val(category).trigger('change');

        $(document).on('mouseover', '#search_category .select_category', function() {
            if($(this).children().length > 1){
            } else{
                if($('body').hasClass('page-type-default')){
                    const url = '/categories.php';
                    const $options = {
                        template: 'halothemes/category-search/halo-all-categories'
                    };

                    utils.api.getPage(url, $options, (err, response) => {
                        if (err) {
                            return '';
                        }

                        $('#search_category .select_category').append(response);
                    });
                }
            }
        });

        $('[data-search="quickSearch"]').on('click', event => {
            if($('#search_category .select_category').children().length > 1){
            } else{
                if($('body').hasClass('page-type-default')){
                    const url = '/categories.php';
                    const $options = {
                        template: 'halothemes/category-search/halo-all-categories'
                    };

                    utils.api.getPage(url, $options, (err, response) => {
                        if (err) {
                            return '';
                        }

                        $('#search_category .select_category').append(response);
                    });
                }
            }
        });

        $('form[action="/search.php"]').on('submit', (event) => {
            if($(event.currentTarget).find('select[name="category"]').val() === ''){
                $(event.currentTarget).find('select').attr('name','');
            }
        });
    }
    searchCategory();

    $(document).ready(function(){
        var category = getUrlParameter('category');

        if($('body').hasClass('page-type-search')){
            $('#search_category .select_category').trigger('click');
        } else{
            $('#search_category').val(category).trigger('change');
            $('select[name="category"]').val(category).trigger('change');
        }
    });
}
