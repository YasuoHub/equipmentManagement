let vm = new Vue({
    el:'body',
    data:{
        borrowFeedback:[],
        equipmentallFeedback:[],
        equipmentoneFeedback:[],
        equipLastArr:[],
        canBorrowNum:'',
        selected:'',
        flag:true,
        remianNum:'',
        inputNum:''
    },
    methods:{
        getborrowFeedback:function(){
            var This = this;
            $.ajax({
                url: 'getmsg/getBorrowInfo',
                type: 'GET',
                dataType: 'JSON',
            }).done(function(userdetails) {
                This.borrowFeedback = userdetails.returnObj;
            })
        },
        getequimentall:function () {
            var This = this;
            $.ajax({
                url: 'getmsg/getEqupmentall',
                type: 'GET',
                dataType: 'JSON',
            }).done(function(equipmentall) {
                This.equipmentallFeedback = equipmentall.returnObj;
                console.log(This.equipmentallFeedback)
            })
        },
        getEquipNoName:function (selected) {
            var This = this;
            $.ajax({
                url: 'getmsg/getEqupmentone',
                type: 'GET',
                dataType: 'JSON',
                data:{equipNo:selected}
            }).done(function(equipmentone) {
                This.equipmentoneFeedback = equipmentone.returnObj;
                var equiponeArray = This.equipmentoneFeedback;
                console.log(equiponeArray);
                var newArr=[];
                var EquipNameObj={};
                var equipLastArr=[];
               for(let i=0;i<equiponeArray.length;i++) {
                   if (newArr.indexOf(equiponeArray[i].equipName) == '-1') {
                       newArr.push(equiponeArray[i].equipName);
                   }
                   if (i == equiponeArray.length - 1) {
                       let nowNum = 0;
                       for (let k = 0; k < newArr.length; k++) {
                           for (let j = 0; j < equiponeArray.length; j++) {
                               if (equiponeArray[j].equipName ==newArr[k]) {
                                   nowNum++;
                               }
                               if(j==equiponeArray.length-1){
                                   EquipNameObj={nowEquipName:newArr[k],num:nowNum}
                                   equipLastArr.push(EquipNameObj);
                                   nowNum=0;
                               }
                           }

                       }
                   }
               }
               This.equipLastArr = equipLastArr;
                console.log(equipLastArr)
            })
        },
        getCanBorroeNum:function (data) {
            var This = this;
            This.remianNum = data.replace(/[^0-9]/ig,"");
        },
        refermsg:function () {
            var This = this;
            if(This.flag == true){
                This.inputNum = $('#inputNum').val();
                if(This.inputNum>This.remianNum){
                    return;
                }
                var inputDate = $('#inputDate').val();
                $.ajax({
                    url:'/reserveBorrow',
                    type:'POST',
                    dataType:'JSON',
                    data:{
                        selectNo:This.selected,
                        remainNum:This.remianNum,
                        inputNum:This.inputNum,
                        inputDate:inputDate,
                        equipName:This.equipName
                    },
                    complete:function () {
                        $('#returnModal').modal('hide');
                    }
                }).done(function (result) {
                    console.log(result);
                })
            };
            if(This.flag == false){
                var attrArray = [];
                var $input = $('#noteForm2 input:checkbox:checked');
                console.log($input)
                $($input).each(function (index,el) {
                    attrArray.push(el.getAttribute('data-equipId'));
                    if(index == $input.length-1){
                        console.log($('.inputReturnDate'))
                        var inputReturnDate = $('.inputReturnDate').val();
                        $.ajax({
                            url:'/reserveReturn',
                            type:'POST',
                            dataType:'JSON',
                            data:{
                                attrArray:attrArray,
                                inputReturnDate:inputReturnDate,
                            },
                            complete:function () {
                                $('#returnModal').modal('hide');
                            }
                        }).done(function (result) {
                            console.log(result);
                        })
                    }
                })
            }
        },
        borrowApply:function () {
            var This = this;
            $('#noteForm2')[0].reset();
            This.flag = true;
        },
        returnApply:function () {
            var This = this;
            $('#noteForm1')[0].reset();
            This.flag = false;
        },
        checkNum:function () {
            var This = this;
            console.log(This._data);
            let inputNum = $('#inputNum').val();
            if(inputNum>This._data.remianNum){
                $('.inputborrowNum').addClass('alert alert-warning');
                $('.referBtn').attr("disabled","disabled");
            }
            if(inputNum<=This._data.remianNum){
                $('.inputborrowNum').removeClass('alert alert-warning');
                $('.referBtn').removeAttr("disabled","disabled");
            }
        }
    }
})

// 轮播图
jQuery(function($){
    $('.vmcarousel-centered-infitine').vmcarousel({
        centered: true,
        start_item: 1,
        autoplay: true,
        infinite: true
    });
});

//    实验公约模态框
$('.treatyList').on('click','li',function () {
    $('#myModal').modal('show');
})
$(function () {
    $('#id_ad_search').click(function(){
        var name = $('#id_name').val();
        $.ajax({
            url:'/test',
            data:{name:name},
            complete:function () {
                $('#myModal').modal('hide');
            }
        })
    });
});

//    公告模态框
$('.noticeMsg').on('click','li',function () {
    $('#noticeModal').modal('show');
})
$(function () {
    $('#id_ad_search').click(function(){
        var name = $('#id_name').val();
        $.ajax({
            url:'/test',
            data:{name:name},
            complete:function () {
                $('#noticeModal').modal('hide');
            }
        })
    });
});
//   申请反馈模态框
$('.return').click(function () {
    $('#borrowModal').modal('show');
})
$('#borrowModalTitle').click((function () {
    $('.borrowModal').show();
    $('.returnModal').hide();
    $('#borrowModalTitle').addClass('active');
    $('#returnModalTitle').removeClass('active');

}))
$('#returnModalTitle').click((function () {
    $('.borrowModal').hide();
    $('.returnModal').show();
    $('#returnModalTitle').addClass('active');
    $('#borrowModalTitle').removeClass('active');
}))
$(function () {
    $('#id_ad_search').click(function(){
        var name = $('#id_name').val();
        $.ajax({
            url:'/test',
            data:{name:name},
            complete:function () {
                $('#borrowModal').modal('hide');
            }
        })
    });
});

//    我要申请模态框
$('.borrow').click(function () {
    $('#applicationModal').modal('show');
    $('#borrowApplyTitle').addClass('active');
})
$('#borrowApplyTitle').click((function () {
    $('.borrowApply').show();
    $('.returnApply').hide();
    $('#borrowApplyTitle').addClass('active');
    $('#returnApplyTitle').removeClass('active');

}))
$('#returnApplyTitle').click((function () {
    $('.borrowApply').hide();
    $('.returnApply').show();
    $('#returnApplyTitle').addClass('active');
    $('#borrowApplyTitle').removeClass('active');
}))


//    建议反馈模态框
$('.suggest').click(function () {
    $('#suggestModal').modal('show');
})
$(function () {
    $('#id_ad_search').click(function(){
        var name = $('#id_name').val();
        $.ajax({
            url:'/test',
            data:{name:name},
            complete:function () {
                $('#suggestModal').modal('hide');
            }
        })
    });
});
//写建议模态框
$('.writeTreaty').click(function () {
    $('#writeTreatyModal').modal('show');
})
$(function () {
    $('#id_ad_search').click(function(){
        var name = $('#id_name').val();
        $.ajax({
            url:'/test',
            data:{name:name},
            complete:function () {
                $('#writeTreatyModal').modal('hide');
            }
        })
    });
});
$('.reset').click(function () {
    $('#noteForm')[0].reset();
})