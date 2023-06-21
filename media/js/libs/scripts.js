function savetofile(ElementId, FileFormat) {
    // This variable stores all the data.
    let data = $('#'+ElementId).text();
    // Convert the text to BLOB.
    const textToBLOB = new Blob([data], {type: 'text/plain;', endings: 'native'});
    const sFileName = 'formData.'+FileFormat; // The file
    let newLink = document.createElement("a");
    
    newLink.download = sFileName;
    if (window.webkitURL != null) {
        newLink.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
        newLink.href = window.URL.createObjectURL(textToBLOB);
        newLink.style.display = "none";
        document.body.appendChild(newLink);
    }
    newLink.click();
}

function readURL(input) {
    var reader = new FileReader();
    reader.readAsDataURL(input);
    reader.onload = function(e) {
        $("#id_doc_generalmap").attr("value",e.target.result);
    }
}

$('.plus').click(function() {
    var currentZoom = Number($("article").attr('zoom'));
    var nextZoom = Number($("article").attr('zoom'))+1;
    if (currentZoom < 5) {
        $("article").attr("zoom",nextZoom).trigger('change');
        $("#generalMap").attr("zoom",nextZoom);
		$(".zoomval").html(nextZoom+'00%');
    }
});

$('.minus').click(function() {
    var currentZoom = Number($("article").attr('zoom'));
    var nextZoom = Number($("article").attr('zoom'))-1;
    if (currentZoom > 1) {
        $("article").attr("zoom",nextZoom).trigger('change');
        $("#generalMap").attr("zoom",nextZoom);
		$(".zoomval").html(nextZoom+'00%');
    }
});

$('#copyCRC').click(function() {
    const textarea = document.createElement('textarea');
    textarea.id = 'temp_element';
    textarea.style.height = 0;
    document.body.appendChild(textarea);
    textarea.value = $('#id_models_crc').text();
    const selector = document.querySelector('#temp_element');
    selector.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
});

$('#id_doc_generalmap_reset').click(function() {
    var input = $('#id_doc_generalmap');
    input.replaceWith(input.val('').clone(true));
});

$('article').mousemove(function(e) {
	var zoom = $('article').attr('zoom');
    $('.statusBar').html('X: '+Math.round(e.offsetX/zoom)+' Y: '+Math.round(e.offsetY/zoom));
});

$("#id_grid").change(function(e){
    let grid = $("#id_grid").is(":checked");
	var gridDivider = 1;
	if (grid) {
		gridDivider = 5;
	} 
});