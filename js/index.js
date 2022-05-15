$(function() {
    selectChainA();
    selectChainB();
    approval();
});

// chainA 下拉选择框
function selectChainA() {
    // _selected保存选择内容
    var _selected;
    _selected = $('#selectChainABtn').text();
    $('#selectChainA').on('click', '.chainA', function() {
        $(this).parent().siblings('button').text($(this).text());
        _selected = $(this).parent().siblings('button').text();
        console.log(_selected);
    });
}

// chainB 下拉选择框
function selectChainB() {
    // _selected保存选择内容
    var _selected;
    _selected = $('#selectChainBBtn').text();
    $('#selectChainB').on('click', '.chainB', function() {
        $(this).parent().siblings('button').text($(this).text());
        _selected = $(this).parent().siblings('button').text();
        console.log(_selected);
    });
}

//approval 按钮
function approval() {
    $('#approval').on('click', function() {
        alert('approval');
    });
}