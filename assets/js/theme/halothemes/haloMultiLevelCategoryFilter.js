import utils from '@bigcommerce/stencil-utils';

export default function(){
    window.levelText = new Array();
    window.levelText[1] = $('#halo_select-level-1 option[disabled]').text();
    window.levelText[2] = $('#halo_select-level-2 option[disabled]').text();
    window.levelText[3] = $('#halo_select-level-3 option[disabled]').text();
    window.levelText[4] = $('#halo_select-level-4 option[disabled]').text();

    var num = $('[data-multi-level-order]').data('multi-level-order'); //Numerical order of the parent category item - 0 is the first parent category item
    $(document).ready(function() {

        const url = '/categories.php';
        const multi_level = $('[data-multi-level]').data('multi-level');

        utils.api.getPage(url, {template: 'halothemes/category-filter/halo-all-categories'}, (err, response) => {
            if (err) {
                return '';
            }

            var hierarchy;

            if(multi_level){
                hierarchy = getCategories($(response).children('ul').find(" > li:eq("+num+") >  ul"));
            } else{
                hierarchy = getCategories($(response).children('ul'));
            }

            buildSelect(hierarchy);
        });

        if ($("ul.breadcrumbs li").length>1) {
            var level = 1;
            $("ul.breadcrumbs li").each(function(index) {
                if(index >= 1){
                    var brsc = $(this).text();
                    var idLevel = "#halo_select-level-"+level;
                    $(idLevel + ' option').each(function() {
                        if ($.trim($(this).text()) == $.trim(brsc)) {
                            $(idLevel).val($(this).val()).trigger('change');
                        }
                    });
                    level++;
                }
            });
        }

        //Clear selected
        $('#halo_clear-select').click(function() {
            $('#halo_select-level-1 option').eq(0).prop('selected', true).trigger('change');
        });
    });

    function getCategories(root) {

        var result = new Array();
        root.find(" > li").each(function() {
            var link = $(this).find(">a");
            var node = {'link': link.attr('href'),
                        'title': link.text(),
                        'children': getCategories($(this).find('> ul '))
                    };
            result.push(node);
        });
        return result;
    }

    function removeLevel(selectLevel, name) {
        selectLevel.find("option").remove();
        selectLevel.append("<option selected='' disabled=''>" + name + "</option>");
    }

    function buildSelect(list) {

        //level 1
        var selectLevel1 = $("#halo_select-level-1");
        var selectLevel2 = $("#halo_select-level-2");
        var selectLevel3 = $("#halo_select-level-3");
        var selectLevel4 = $("#halo_select-level-4");

        for (var i=0; i<list.length; i++) {
            selectLevel1.append("<option value='" + i + "'>" + list[i].title + "</option>");
        }
        //level 1 handle
        selectLevel1.change(function() {

            //remove old data
            for (var i=2; i<=4; i++) {
                removeLevel($("#halo_select-level-"+i), window.levelText[i]);
            }

            //drop data to level 2
            var selected = selectLevel1.find("option:selected");
            var level1index = parseInt(selected.val());

            if (level1index>=0 && list[level1index].children) {
                var level1List = list[level1index].children;

                //add new data
                for (var j=0; j<level1List.length; j++) {
                    selectLevel2.append("<option value='" + j + "'>" + level1List[j].title + "</option>");
                }
            }
        });

        //level 2 handle
        selectLevel2.change(function() {
            //remove old data
            for (var i=3; i<=4; i++) {
                removeLevel($("#halo_select-level-"+i), window.levelText[i]);
            }

            //drop data to level 2
            var level1index = parseInt(selectLevel1.find("option:selected").val());
            var level1List = list[level1index].children;
            var selected = selectLevel2.find("option:selected");
            var level2index = parseInt(selected.val());

            if (level2index>=0 && level1List[level2index].children) {
                var level2list = level1List[level2index].children;
                //add new data
                for (var j=0; j<level2list.length; j++) {
                    selectLevel3.append("<option value='" + j + "'>" + level2list[j].title + "</option>");
                }
            }
        });

        //level 3 handle
        selectLevel3.change(function() {
            if (selectLevel3.find("option").length > 1) {
                //remove old data
                removeLevel($("#halo_select-level-4"), window.levelText[4]);

                //drop data to level 3
                var level1index = parseInt(selectLevel1.find("option:selected").val());
                var level1List = list[level1index].children;
                var level2index = parseInt(selectLevel2.find("option:selected").val());
                var level2List = level1List[level2index].children;
                var selected = selectLevel3.find("option:selected");
                var level3index = parseInt(selected.val());

                if (level3index>=0 && level2List[level3index].children) {
                    var level3list = level2List[level3index].children;
                    //add new data
                    for (var j=0; j<level3list.length; j++) {
                        selectLevel4.append("<option value='" + j + "'>" + level3list[j].title + "</option>");
                    }
                }
            }
        });

        //Browse button
        $("#halo_select-browse").click(function(e) {
            var level1selected = selectLevel1.find("option:selected");
            var level1index = parseInt(level1selected.val());
            var level2selected = selectLevel2.find("option:selected");
            var level2index = parseInt(level2selected.val());
            var level3selected = selectLevel3.find("option:selected");
            var level3index = parseInt(level3selected.val());
            var level4selected = selectLevel4.find("option:selected");
            var level4index = parseInt(level4selected.val());

            if (level4index >=0 ) {
                window.location.href = list[level1index].children[level2index].children[level3index].children[level4index].link;
            } else if (level3index >=0 ) {
                window.location.href = list[level1index].children[level2index].children[level3index].link;
            } else if (level2index >=0 ) {
                window.location.href = list[level1index].children[level2index].link;
            } else if (level1index >=0) {
                window.location.href = list[level1index].link;
            }

            e.preventDefault();
        });
    }

}
