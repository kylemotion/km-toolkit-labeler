/**
 * @description An AE script that will change the composition source name to aid in project organization
 * @name km-scriptname
 * @author Kyle Harter <kylenmotion@gmail.com>
 * @version 1.0.0
 * 
 * @license This script is provided "as is," without warranty of any kind, expressed or implied. In
 * no event shall the author be held liable for any damages arising in any way from the use of this
 * script.
 * 
 * 
 * 
 * 
*/


(function(thisObj){
    

    var labelArray = ["Scene", "Build", "Element", "Rig", "Transition"];

    var scriptName = "km-toolkit-labeler";

    createUI(thisObj)

    function createUI(thisObj){
        var win = thisObj instanceof Panel
        ? thisObj
        : new Window("window", scriptName, undefined, {
            resizeable: true
        })

    win.orientation = 'column';
    win.alignChildren = ["left", "top"];

    var mainGroup = win.add("group", undefined, "Main Group");
    mainGroup.orientation = 'column';

    var labelPanel = mainGroup.add("panel", undefined, "Labels");
    labelPanel.orientation = "column";
    labelPanel.alignChildren = ["fill", "fill"];
    var labelDD = labelPanel.add("dropdownList", undefined, labelArray);
    labelDD.alignment = ["fill", "fill"];
    labelDD.selection = 0;

    var buttonGroup = mainGroup.add("group", undefined, "Label Group");
    buttonGroup.orientation = 'row';
    var labelButton = buttonGroup.add("button", undefined, "Label");
    labelButton.preferredSize = [-1,30];
    labelButton.helpTip = "Click: Apply markers to selected layers.\rShift+Click: Apply markers to beginning of a comp."


    labelButton.onClick = function(){
    try {
        app.beginUndoGroup("Item Labeler");

        var labelInput = labelDD.selection.toString().toLowerCase();


        labelComps(labelInput);


      } catch(error) {
        alert("An error occured on line: " + error.line + "\nError message: " + error.message);
      } finally {
        // this always runs no matter what
        app.endUndoGroup()
      }
      
    }

    
    function getCompItems(){
        var proj = app.project;
        var projSelection = proj.selection;
        var selCompItems = [];

        if(proj.selection.length < 1){
            alert("Whoops!\r\rYou don't have any project items selected. Select atleast 1 project item and try again.");
            return;
        }

        var match = false

        for(var i = 0; i<projSelection.length; i++){
            var item = projSelection[i];

            if(item && item instanceof CompItem){
                selCompItems.push(item);
                match = true;
            }
        }

        if(!match){
            alert("Whoops!\r\rYou don't have any comp items selected. Select atleast 1 comp item and try again.");
            return
        }

        return selCompItems

    }


    function labelComps(ddSel){
        var comps = getCompItems();
        for(var i=0; i<comps.length; i++){
            var compName = comps[i].name;
            comps[i].name = ddSel + "-" + compName;
        }

        return
    }


    win.onResizing = win.onResize = function (){
        this.layout.resize();
    };

    if(win instanceof Window){
        win.center();
        win.show();
    } else {
        win.layout.layout(true);
        win.layout.resize();
    }


    }

}(this))
