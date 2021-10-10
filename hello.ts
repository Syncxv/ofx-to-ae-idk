/*
	Adobe-script-runner './hello.js'
	Executes file between quotes rather than the one in the active viewer.
*/
//@include "./utils/map.js"
(function (thisObj) {
  var location = "C:\\Users\\USER\\Documents\\OFX Presets";
  var OFX = new Folder(location);
  var dropdown;
  var applyBtn;
  function getNames(xmlData) {
    var test = xmlData.match(/name="\S.*"><.*/gm);
    var bruh = [];
    for (var g = 0; g < test.length; ++g) {
      var item = test[g];
      var name = item.match(/"\S.*"/gm)[0].replace(/"/g, "");
      //<\/|OfxParamValue>
      var value = item
        .match(/<OfxParamValue>.*<\/OfxParamValue>/gm)[0]
        .replace(/<\/.*|.OfxParamValue>/gm, "");
      bruh.push({ name, value });
    }
    return bruh;
  }
  function getRealValue(value: string) {
    if(isNaN(value)) {
      return value === "true" ? true : value === "false" ? false : value 
    } else {
      return Number(value)
    }
  }
  function getFoldersRecursive(folder) {
    var files = folder.getFiles(),
      editFolders = [],
      folder;

    for (var i = 0; i < files.length; i++) {
      folder = files[i];
      if (folder instanceof Folder) {
        editFolders.push(folder);
        editFolders = editFolders.concat(getFoldersRecursive(folder));
      }
    }
    return editFolders;
  }

  function expressionPanel(thisObj) {
    var dropdowns = {}
    var win =
      thisObj instanceof Panel
        ? thisObj
        : new Window("palette", "Ofx Presets", undefined);
    win.spacing = 5;
    var groupTwo: Group = win.add("group", undefined, "GroupOne");
    groupTwo.orientation = "column";
    applyBtn = groupTwo.add("button", undefined, "Get Presets");

    applyBtn.onClick = function () {
      if (app.project.activeItem instanceof CompItem) {
        const effect = app.project.activeItem.selectedProperties[0];
        if(!effect) {
          return alert('bro you need to select a effect')
        }
        // alert(effect.name);
        var ofxFolders: Array<Folder> = getFoldersRecursive(OFX);
        for (var i = 0; i < ofxFolders.length; ++i) {
          if (ofxFolders[i].name.split(".").pop() === effect.name) {
            alert(
              "FOUND EFFECT: " +
                ofxFolders[i].name +
                " OK now checking for presets"
            );
            var filterFolder = ofxFolders[i].getFiles()[0];
            if (filterFolder instanceof Folder) {
              const xmlFiles = filterFolder.getFiles();
              if (xmlFiles.length < 1) {
                alert(ofxFolders[i].name + " has no presets");
                return;
              }
              var presets = [];
              var presetNames = [];
              for (var j = 0; j < xmlFiles.length; ++j) {
                presets.push(xmlFiles[j]);
                presetNames.push(xmlFiles[j].name);
              }
              var g = groupTwo.add("panel", undefined, effect.name); //Add a group

              g.orientation = "row";
              var dropdownpresets = g.add(
                "dropdownlist",
                undefined,
                presetNames
              );
              g.add("button", undefined, "Apply").onClick = function () {
                if (dropdownpresets.selection instanceof ListItem) {
                  var file = presets[dropdownpresets.selection.index];
                  alert(file.name);
                  file.open("r");
                  var data = file.read();
                  var realData = getNames(data);
                  file.close();
                  for (var sh = 0; sh < realData.length; sh++) {
                    var item = realData[sh];
                    if(item.name === "Start") {
                      item.name = "Start XY"
                      item.value = item.value.split(' ')
                    }
                    else if(item.name === "End") {
                      item.name = "End XY",
                      item.value = item.value.split(' ')
                    }
                    else if(item.name === "Start Color") {
                      item.value = item.value.split(' ')
                    }
                    else if(item.name === "End Color") {
                      item.value = item.value.split(' ')
                    }
                    else if (effect.property(item.name)) {
                      if(Object.prototype.toString.call(item.value) === '[object Array]') {
                        effect.property(item.name).setValue(item.value);
                        continue
                      }
                      effect.property(item.name).setValue(getRealValue(item.value))
                    }
                  }
                }
              };
              g.layout.layout(true);
              win.layout.layout(true);
            }
          }
        }
        // alert(effect.property("Mocha").name);
      } else {
        alert("select effect bruh");
      }
    };

    win instanceof Window
      ? (win.center(), win.show())
      : (win.layout.layout(true), win.layout.resize());
  }
  expressionPanel(thisObj);
  // if (app.project.activeItem instanceof CompItem) {
  //   var hehe = app.project.activeItem.selectedProperties;
  //   alert((hehe[0].expression = "loopOut()"));
  // }
})(this);
