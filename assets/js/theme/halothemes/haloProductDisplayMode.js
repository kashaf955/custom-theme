export default function() {
    const $grid = $('#grid-view'),
        $list = $('#list-view'),
        $gridMobile = $('#grid-view-mobile'),
        $listMobile = $('#list-view-mobile');

    $list.on('click', event => {
        event.preventDefault();
        const $productListing = $('#product-listing-container .productListing');

        if (!$list.hasClass('current-view')) {
            setTimeout(function(){ 
                $list.addClass('current-view');
                $listMobile.addClass('current-view');
                $grid.removeClass('current-view');
                $gridMobile.removeClass('current-view');
                $productListing.removeClass('productGrid').addClass('productList');
            }, 300);
        }
   });

    $grid.on('click', event => {
        event.preventDefault();
        const $productListing = $('#product-listing-container .productListing');
        
        if (!$grid.hasClass('current-view')) {
            setTimeout(function(){ 
                $grid.addClass('current-view');
                $gridMobile.addClass('current-view');
                $list.removeClass('current-view');
                $listMobile.removeClass('current-view');
                $productListing.removeClass('productList').addClass('productGrid');
            }, 300);
        }
    });

    $listMobile.on('click', event => {
        event.preventDefault();
        const $productListing = $('#product-listing-container .productListing');
        
        if (!$listMobile.hasClass('current-view')) {
            setTimeout(function(){ 
                $list.addClass('current-view');
                $listMobile.addClass('current-view');
                $grid.removeClass('current-view');
                $gridMobile.removeClass('current-view');
                $productListing.removeClass('productGrid').addClass('productList');
            }, 300);
        }
    });

    $gridMobile.on('click', event => {
        event.preventDefault();
        const $productListing = $('#product-listing-container .productListing');
        
        if (!$gridMobile.hasClass('current-view')) {
            setTimeout(function(){ 
                $grid.addClass('current-view');
                $gridMobile.addClass('current-view');
                $list.removeClass('current-view');
                $listMobile.removeClass('current-view');
                $productListing.removeClass('productList').addClass('productGrid');
            }, 100);
        }
    });
}
