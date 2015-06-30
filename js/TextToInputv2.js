$.fn.TextToInput = function(definitionAction){

    //Object table
    //var myTable = $(this);
    //Version plugin


    //Default parameters
    TextToInput_defaultSettings = {
    mainButtonDiv  : "#mainButtonDiv",
    actionCell : ".actionCell",
    controleUniqueButton : true,
    buttunClass : "btn",
    modifiedclass : "btn-primary",
    saveclass : "btn-success",
    cancelclass : "btn-danger",
    ToSaveclass : "btn-success",
    modifiedtext : " Modify",
    savetext : " Save",
    canceltext : " Cancel",
    ToSavetext : " Valid Changes",
    modifiedglyph : "glyphicon glyphicon-pencil",
    saveglyph : "glyphicon glyphicon-floppy-disk",
    cancelglyph : "glyphicon glyphicon-ban-circle",
    ToSaveglyph : "glyphicon glyphicon-saved",
    modifiedtitle : "",
    savetitle : "",
    canceltitle : "",
    ToSavetitle : "",
    UpdatedVal : ".text-danger",
    UpdatingVal : ".updating_line",
    ToUpdateLine : ".to_update_line",
    PrecisedFieldDB : false,
    IDDB : "",
    dataDB : "name_DB",
    notChange : ".lockValue",
    link : "index.html",
    myTable : $(this),
    saveOnChange:true,
    SuccesSend: function () {alert("Sending information success")},
    ErrorSend: function () {alert("Sending information error")},
    SendJSON: function (json) {
        $.ajax({
            type: "POST",
            url: tdpersonnalised.link,
            data: json,
        }).success(function(){
            tdpersonnalised.SuccesSend();
            resetChange();
        }).error(function(){
            tdpersonnalised.ErrorSend();
        });
    },
  };

    //Definition of the version
    TextToInput_defaultSettings.VERSION  = '2.0.0';

    //download of the parameters
    if (typeof definitionAction != 'undefined'){
        var tdpersonnalised = $.extend( {}, TextToInput_defaultSettings, definitionAction );
    }
    else{
        var tdpersonnalised = TextToInput_defaultSettings;
    }

    //Call of the function if it is multiple or Unique controle button
    function addMainControlButton(){
        (tdpersonnalised.controleUniqueButton)?addMainButonsUnique():addMainButonsMultiple();
    }

  //tdpersonnalised["myTable"] = $(this);


    //Add of buttons if Unique Button & hide good one(s)
    function addMainButonsUnique(){
        var obj = $(tdpersonnalised.mainButtonDiv);
        obj.append("<button title='"+tdpersonnalised.modifiedtitle+"' class=\""+ tdpersonnalised.buttunClass+ " "  + tdpersonnalised.modifiedclass +"\"><span class=\""+ tdpersonnalised.modifiedglyph +"\" aria-hidden=\"true\">"+tdpersonnalised.modifiedtext+"</span></button>");

        obj.append("<button title='"+tdpersonnalised.savetitle+"' class=\"" + tdpersonnalised.buttunClass+ " "  + tdpersonnalised.saveclass +"\"><span class=\""+ tdpersonnalised.saveglyph +"\" aria-hidden=\"true\">"+tdpersonnalised.savetext+"</span></button>");

        obj.append("<button title='"+tdpersonnalised.canceltitle+"' class=\"" + tdpersonnalised.buttunClass+ " " + tdpersonnalised.cancelclass +"\"><span class=\""+ tdpersonnalised.cancelglyph +"\" aria-hidden=\"true\">"+tdpersonnalised.canceltext+"</span></button>");

        obj.append("<button disabled title='"+tdpersonnalised.ToSavetitle+"' class=\"" + tdpersonnalised.buttunClass+ " " + tdpersonnalised.ToSaveclass +"\"><span class=\""+ tdpersonnalised.ToSaveglyph +"\" aria-hidden=\"true\">"+tdpersonnalised.ToSavetext+"</span></button>");

        obj.children("button:nth-child(2),button:nth-child(3)").hide();

    }

    //Add of buttons if Multiple Button & hide good one(s)
    function addMainButonsMultiple(){
        var obj = $(tdpersonnalised.mainButtonDiv);

        obj.append("<button disabled title='"+tdpersonnalised.ToSavetitle+"' class=\"" + tdpersonnalised.buttunClass+ " " + tdpersonnalised.ToSaveclass +"\"><span class=\""+ tdpersonnalised.ToSaveglyph +"\" aria-hidden=\"true\">"+tdpersonnalised.ToSavetext+"</span></button>");


    }

    //Add button on each line for multiple button & hide the good ones
    function addButtonLine(){
        var obj = tdpersonnalised.myTable.find(tdpersonnalised.actionCell);
        $.each(obj,function(){
            $(this).append("<button title='"+tdpersonnalised.modifiedtitle+"' class=\""+ tdpersonnalised.buttunClass+ " "  + tdpersonnalised.modifiedclass +"\"><span class=\""+ tdpersonnalised.modifiedglyph +"\" aria-hidden=\"true\"></span></button>");

            $(this).append("<button title='"+tdpersonnalised.ToSavetitle+"' class=\"" + tdpersonnalised.buttunClass+ " " + tdpersonnalised.ToSaveclass +"\"><span class=\""+ tdpersonnalised.ToSaveglyph +"\" aria-hidden=\"true\"></span></button>");

            $(this).append("<button title='"+tdpersonnalised.canceltitle+"' class=\"" + tdpersonnalised.buttunClass+ " " + tdpersonnalised.cancelclass +"\"><span class=\""+ tdpersonnalised.cancelglyph +"\" aria-hidden=\"true\"></span></button>");
        });

        obj.children("button:nth-child(2),button:nth-child(3)").hide();

    }

    function LockActionCellExceptCurrent(e){
        tdpersonnalised.myTable.find(tdpersonnalised.actionCell).not(e).children("button:nth-child(1)").each(function(){
            $(this).attr('disabled','disabled');
        });
    }

    function UnlockActionCellExceptCurrent(){
        tdpersonnalised.myTable.find(tdpersonnalised.actionCell).children("button:nth-child(1)").each(function(){
            $(this).attr('disabled',false);
        });
    }

    function modifieLine(e){
        var parent = e.parent();
        if(!tdpersonnalised.saveOnChange) LockActionCellExceptCurrent(parent);
        else saveOnChange();
        e.hide();
        parent.parent().addClass("updating_line");
        parent.children("button:nth-child(2),button:nth-child(3)").show();
        transformInInput(parent.parent());
    }

    function saveOnChange(){
        wheelSave(tdpersonnalised.myTable.find(tdpersonnalised.UpdatingVal).find("td,li").not(tdpersonnalised.actionCell).not(tdpersonnalised.notChange).not(tdpersonnalised.IDDB));
        if($(tdpersonnalised.UpdatingVal)[0]) resetButtonMultiple($(tdpersonnalised.UpdatingVal));
    }

    function wheelSave(e){
        e.each(function(i,e){
            SaveChange($(e));
        });
    }

    function SaveChange(e){
        var val = e.children("input").val();
        if(typeof val != "undefined" && val != "")if(val.indexOf('"') != -1)val = val.replace('"', '\"');
        var oldval = e.children("input").data("oldval");
        if (tdpersonnalised.IDDB=="" && e.data("oldval")=== undefined )e.attr("data-oldVal",oldval);
        InputToText(e,val);

        if(val!=oldval) e.addClass(tdpersonnalised.UpdatedVal.replace(".",""));
        addUpdateLine();
    }

    function resetButtonMultiple(e){
        e.find(tdpersonnalised.actionCell).children("button:nth-child(2),button:nth-child(3)").hide();
        e.find(tdpersonnalised.actionCell).children("button:nth-child(1)").show();
        e.removeClass(tdpersonnalised.UpdatingVal.replace(".",""));
    }

    function CancelLine(e){
        e.find("td,li").not(tdpersonnalised.actionCell).not(tdpersonnalised.notChange).not(tdpersonnalised.IDDB).each(function(i,e){
            var oldval = $(e).children("input").data("oldval");
            InputToText($(e),oldval)
        });
    }

    function transformInInput(target){
        target.find("td,li").not(tdpersonnalised.actionCell).not(tdpersonnalised.notChange).not(tdpersonnalised.IDDB).each(function(){
            var temp = $(this).text().replace('"', '\"');
            $(this).text("");
            $(this).append("<input data-oldVal='"+ temp +"' value='"+ temp +"'>");
        });
    }

    function InputToText(e,val){
        e.text("");
        e.append(val);
    }

    function cancelAllLine(){
        tdpersonnalised.myTable.find("td,li").not(tdpersonnalised.actionCell).not(tdpersonnalised.notChange).not(tdpersonnalised.IDDB).each(function(){
            var oldval = $(this).children("input").data("oldval");
            InputToText($(this),oldval);
        });
    }

    function saveAllLine(){
        tdpersonnalised.myTable.find("td,li").not(tdpersonnalised.actionCell).not(tdpersonnalised.notChange).not(tdpersonnalised.IDDB).each(function(){
            var oldval = $(this).children("input").data("oldval");
            var val = $(this).children("input").val().replace('"', '\"');
        if (tdpersonnalised.IDDB=="" && $(this).data("oldval")=== undefined )$(this).attr("data-oldVal",oldval);
            InputToText($(this),val);
            if(val!=oldval) $(this).addClass(tdpersonnalised.UpdatedVal.replace(".",""));
        });
        addUpdateLine();
    }

    function addUpdateLine(){
        $(tdpersonnalised.UpdatedVal).each(function(){
            if(!$($(this).parent(tdpersonnalised.ToUpdateLine))[0]){
                $(this).parent("tr,ul,ol").addClass(tdpersonnalised.ToUpdateLine.replace(".",""));
                var temp;
                (tdpersonnalised.controleUniqueButton)?temp = 4:temp = 1;
                EnableSaveBDDButton(temp);
            }
        });
    }

    function modifAllLine(){
        transformInInput(tdpersonnalised.myTable);
    }

    function hideModifAndSaveButtunUnique(e){
        e.children("button:nth-child(4),button:nth-child(1)").hide();
    }

    function showCancelAndSaveChangeUnique(e){
        e.children("button:nth-child(2),button:nth-child(3)").show();
    }

    function showModifAndSaveButtunUnique(e){
        e.children("button:nth-child(4),button:nth-child(1)").show();
    }

    function hideCancelAndSaveChangeUnique(e){
        e.children("button:nth-child(2),button:nth-child(3)").hide();
    }

    function EnableSaveBDDButton(nb){
        $(tdpersonnalised.mainButtonDiv).children("button:nth-child(" + nb + ")").attr("disabled",false);
    }
    function DisableSaveBDDButton(nb){
        $(tdpersonnalised.mainButtonDiv).children("button:nth-child(" + nb + ")").attr("disabled","disabled");
    }

    function buildChangeObject(){
        (tdpersonnalised.PrecisedFieldDB)?(tdpersonnalised.IDDB!="")?buildWithID():buildWithoutID():(tdpersonnalised.IDDB!="")?buildNODataID():buildNOData();

    }

    function buildWithoutID(){
        var object = {};
        var old = {};
        var infos = [];
        tdpersonnalised.myTable.find(tdpersonnalised.ToUpdateLine).each(function(){
            $(this).find("td,li").not(tdpersonnalised.actionCell).each(function() {
                var id = $(this).data(tdpersonnalised.dataDB.toLowerCase());
                if($(this).hasClass(tdpersonnalised.UpdatedVal.replace(".",""))){
                  var value = $(this).text();
                  object[String(id)] = value;
                }

                var value_new = $(this).attr("data-oldVal");
               // console.log(value_new);
                old[String(id)] = value_new;
            });
            var temp = new Array(old,object);
            infos.push(temp);
            temp = {};
            old = {};
            object = {};
        });
        JsonForString(infos);
        //console.log(infos);
    }

    function buildWithID(){
        var object = {};
        var infos = [];
        tdpersonnalised.myTable.find(tdpersonnalised.ToUpdateLine).each(function(){
            object[String(tdpersonnalised.IDDB.replace(".",""))] = $(this).children(tdpersonnalised.IDDB).text();
           //+tdpersonnalised.UpdatedVal

$(this).find("td"+tdpersonnalised.UpdatedVal,"li"+tdpersonnalised.UpdatedVal).not(tdpersonnalised.actionCell).not(tdpersonnalised.IDDB).each(function() {
                var id = $(this).data(tdpersonnalised.dataDB.toLowerCase());
                var value = $(this).text();
                object[String(id)] = value;
            });
            infos.push(object);
            object = {};
        });
        JsonForString(infos);
        console.log(infos);
    }

    function buildNOData(){
        var object = {};
        var old = {};
        var infos = [];
        tdpersonnalised.myTable.find(tdpersonnalised.ToUpdateLine).each(function(){
            $(this).find("td,li").not(tdpersonnalised.actionCell).each(function(i) {
                if($(this).hasClass(tdpersonnalised.UpdatedVal.replace(".",""))){
                  var value = $(this).text();
                  object[String(i)] = value;
                }
                var value_new = $(this).attr("data-oldVal");
                console.log(value_new);
                old[String(i)] = value_new;
            });
            var temp = new Array(old,object);
            infos.push(temp);
            temp = {};
            old = {};
            object = {};
        });
        JsonForString(infos);
        //console.log(infos);
    }

    function buildNODataID(){
        var object = {};
        var infos = [];
        tdpersonnalised.myTable.find(tdpersonnalised.ToUpdateLine).each(function(){
            object[String(tdpersonnalised.IDDB.replace(".",""))] = $(this).children(tdpersonnalised.IDDB).text();
            $(this).find("td,li").not(tdpersonnalised.actionCell).not(tdpersonnalised.IDDB).each(function(i) {
                if($(this).hasClass(tdpersonnalised.UpdatedVal.replace(".",""))){
                  var value = $(this).text();
                  object[i]=value;
                }
            });
            infos.push(object);
            object = {};
        });
        JsonForString(infos);
    }

    function JsonForString(infos){
        var json = JSON.stringify(infos);
        tdpersonnalised.SendJSON(json);
    }

    function resetChange(){
        tdpersonnalised.myTable.find(tdpersonnalised.ToUpdateLine).each(function(){
            $(this).find(tdpersonnalised.UpdatedVal).each(function(){
                $(this).removeClass(tdpersonnalised.UpdatedVal.replace(".",""));
            });
            $(this).removeClass(tdpersonnalised.ToUpdateLine.replace(".",""));
            (tdpersonnalised.controleUniqueButton)?temp = 4:temp = 1;
            DisableSaveBDDButton(temp);
        });
    }




    //Put in place button in structure

    addMainControlButton();
    if(!tdpersonnalised.controleUniqueButton) addButtonLine();

    //Trigger event
        //Click on modified Button if multiple line
    tdpersonnalised.myTable.find(tdpersonnalised.actionCell).on('click', "button:nth-child(1)" ,function(){
        modifieLine($(this));
    });
        //Click on cancel Button if multiple line
    tdpersonnalised.myTable.find(tdpersonnalised.actionCell).on('click', "button:nth-child(3)" ,function(){
        var parent = $(this).parents("tr,ul,ol");
        CancelLine(parent);
        resetButtonMultiple(parent);
        UnlockActionCellExceptCurrent();

    });
        //Click on save Button if multiple line
    tdpersonnalised.myTable.find(tdpersonnalised.actionCell).on('click', "button:nth-child(2)" ,function(){
       var parent = $(this).parents("tr,ul,ol"); wheelSave(parent.find("td,li").not(tdpersonnalised.actionCell).not(tdpersonnalised.notChange).not(tdpersonnalised.IDDB));
        resetButtonMultiple(parent);
        UnlockActionCellExceptCurrent();
    });
        //Click on modified Button on unique buttun
    $(tdpersonnalised.mainButtonDiv).on('click', "button:nth-child(1)" ,function(){
       if(tdpersonnalised.controleUniqueButton){
            modifAllLine();
            var parent = $(this).parent();
            hideModifAndSaveButtunUnique(parent);
            showCancelAndSaveChangeUnique(parent);
       }else{
           buildChangeObject();
       }


    });

    $(tdpersonnalised.mainButtonDiv).on('click', "button:nth-child(3)" ,function(){
        var parent = $(this).parent();
        cancelAllLine();
        showModifAndSaveButtunUnique(parent);
        hideCancelAndSaveChangeUnique(parent);
    });

    $(tdpersonnalised.mainButtonDiv).on('click', "button:nth-child(2)" ,function(){
        var parent = $(this).parent();
        saveAllLine();
        showModifAndSaveButtunUnique(parent);
        hideCancelAndSaveChangeUnique(parent);
    });

     $(tdpersonnalised.mainButtonDiv).on('click', "button:nth-child(4)" ,function(){
        buildChangeObject();
    });



}
