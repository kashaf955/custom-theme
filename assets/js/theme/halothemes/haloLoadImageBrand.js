const fetch = require('node-fetch');

export default function(context, wrapper) {
    const token = context.token,
        product_wrapper = $('#'+wrapper),
        product_class = product_wrapper.find('.card:not(.is-loaded)');
    var  list = [];

    function callProductOption() {
        product_class.each((index, element) => {
            var productId = $(element).data('product-id');

            if(!$(element).find('brand-image').length){
                list.push(productId.toString());
            }
        });

        list = uniqueArray(list);

        if(list.length > 0){
            getBrandImage(list).then(data => {
                renderOption(data);

                $.each(list, (idx, item) => {
                    var productId = list[idx],
                        thisProduct = product_wrapper.find('.card:not(.is-brandLoaded) .card-brand-'+productId+':not(.is-brandLoaded)');

                    if (product_wrapper.find('.slick-cloned').length) {
                        const htmlBrand = thisProduct.html();
                        const cardBrand = product_wrapper.find(`.card[data-product-id='${productId}'] .card-brand`);

                        thisProduct.find('*').remove();
                        cardBrand.html(htmlBrand);
                    }

                    thisProduct
                        .addClass('is-brandLoaded')
                        .closest('.card')
                        .addClass('is-brandLoaded');
                });

            });
        }
    }

    function getBrandImage(list){
        return fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                query: `
                    query SeveralProductsByID {
                        site {
                            products(entityIds: [`+list+`], first: 50) {
                                edges {
                                    node {
                                        entityId
                                        brand {
                                            entityId
                                            name
                                            defaultImage{
                                                urlOriginal
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `
            }),
        }).then(res => res.json()).then(res => res.data);
    }

    function renderOption(data){
        var aFilter = data.site.products.edges;

        $.each(aFilter, (index, element) => {
            var productId = aFilter[index].node.entityId,
                productFieldBrand = product_wrapper.find('.card-brand-'+productId+':not(.is-brandLoaded)'),
                brandID,
                brandName,
                brandImage;
            
            if (aFilter[index].node.brand != null) {
                brandID = aFilter[index].node.brand.entityId
                brandName = aFilter[index].node.brand.name

                if (product_wrapper.find('.brandCarouselByCate').length){
                    setTimeout(function(){
                        if (aFilter[index].node.brand.defaultImage){
                            brandImage = aFilter[index].node.brand.defaultImage.urlOriginal;
                            if(!productFieldBrand.find('[data-brand-id="'+brandID+'"]').length) {
                                productFieldBrand.append('<img class="halo-fadeInRight" data-halo-animate="1" src="'+brandImage+'" alt="'+brandName+'" title="'+brandName+'" data-brand-id="'+brandID+'"></img>');
                            }
                        }  else {
                            product_wrapper.find('.brandCarouselByCate').remove();
                        }
                    }, 10);
                } else {
                    setTimeout(function(){
                        if (aFilter[index].node.brand.defaultImage){
                            brandImage = aFilter[index].node.brand.defaultImage.urlOriginal;
                            productFieldBrand.eq(0).append('<img class="halo-fadeInRight" data-halo-animate="1" src="'+brandImage+'" alt="'+brandName+'" title="'+brandName+'"></img>');
                        } else {
                            productFieldBrand.eq(0).append('<span class="halo-fadeInRight" data-halo-animate="1">'+brandName+'</span>');
                        }
                    }, 10);
                }
            }
        });
    }

    function uniqueArray(list) {
        var result = [];

        $.each(list, (index, element) => {
            if ($.inArray(element, result) == -1) {
                result.push(element);
            }
        });

        return result;
    }

    callProductOption();
}
