// Return string width in pt
// getCharWidth("bold 14pt PTMono")
function getCharWidth(font) {
    var canvas = getCharWidth.canvas || (getCharWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText("c");
    return metrics.width;
}