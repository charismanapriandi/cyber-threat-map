$(function() {
    var URL_BASE = "localhost";
    var URL_PATH = "vms/";
    var CURR_URL = "";
    
    if (!(window.history && history.pushState)) {
        $(".history-message").fadeIn();
    }
    
    /**
     * New Featured Function Framework 2014 V.1.2
     * @Vizzca Indra Pratama
     * Add Function
     */
    [].forEach.call(document.querySelectorAll(".add-form"),function(e) {
        e.addEventListener("click", function(evt) {
            var self          = $(this);
            var URL           = self.attr("href");
            var title         = this.textContent;
            
            get_data_ajax(URL,null);
            history.pushState(null, title, URL);
            evt.preventDefault(); 
            
            return false;
        });
    });
    
    /*
     * Insert and Update Function
     */
    [].forEach.call(document.querySelectorAll("form.form-insert"),function(e) {
        e.addEventListener("submit", function(evt) {
            var self          = $(this);
            var URL           = self.attr("data-target");
            var XURL          = self.attr("action");
            var DATA          = $(this).serializeJSON();
            
            $.ajax({
                type       : "POST",
                url        : XURL,
                data       : DATA,
                dataType   : "json",
                cache      : false
            }).done(function(content) {
                $("#ajax-modal").fadeOut();
                $("#ajax-modal").empty();
                $("#ajax-modal").append(content.message).fadeIn(100);

                setTimeout(function() {
                    $("#ajax-modal").fadeOut(1000);
                },1500);
                
                if(content.error === false) {
                    /*
                    * Validation code 
                    */
                   
                   setTimeout(function() {
                       $.ajax({
                           headers    : { 'X-Content-Only' : 'true' },
                           type       : "GET",
                           url        : URL,
                           data       : "token=310142ae8c103aba8d24a0b366451222&search",
                           cache      : false
                       }).done(function(content) {
                           $("#ent-content").empty();
                           $("#ent-content").append(content);
                       });
                   },2000);
                }
            });
            
            history.pushState(null, null, URL);
            evt.preventDefault(); 
        });
    });
    
    /*
     * Edit Function
     */
    [].forEach.call(document.querySelectorAll(".edit-form"),function(e) {
        e.addEventListener("click", function(evt) {
            var self          = $(this);
            var URL           = self.attr("href");
            var title         = this.textContent;
            
            get_data_ajax(URL,null);
            history.pushState(null, title, URL);
            evt.preventDefault(); 
            
            return false;
        });
    });
    
    /*
     * Delete Function
     */
    [].forEach.call(document.querySelectorAll(".delete-form"),function(e) {
        e.addEventListener("click", function(evt) {
            var self          = $(this);
            var URL           = self.attr("href");
            var XURL          = self.attr("media");
            var title         = this.textContent;
            
            if(confirm("Apakah anda ingin menghapus data ini ? ")) {
                $.ajax({
                    headers    : { 'X-Content-Only' : 'true' },
                    type       : "POST",
                    url        : URL,
                    data       : "&token=310142ae8c103aba8d24a0b366451222",
                    cache      : false,
                    beforeSend : function() {
                                    $("#ajax-modal").html("<b>Menghapus..</b>").show();
                                 }
                }).done(function(content) {
                    $("#ajax-modal").fadeOut();
                    $("#ajax-modal").empty();
                    $("#ajax-modal").append(content).fadeIn(100);

                    setTimeout(function() {
                        $("#ajax-modal").fadeOut(1000);
                    },1500);

                    setTimeout(function() {
                        $.ajax({
                            headers    : { 'X-Content-Only' : 'true' },
                            type       : "GET",
                            url        : XURL,
                            data       : "token=310142ae8c103aba8d24a0b366451222&search",
                            cache      : false
                        }).done(function(content) {
                            $("#ent-content").empty();
                            $("#ent-content").append(content);
                        });
                    },2000);
                });

                
            }
            
            history.pushState(null, title, XURL);
            evt.preventDefault(); 
            return false;
        });
    });
    
    /*
     * Selected Delete Function
     */
    [].forEach.call(document.querySelectorAll("form.selected-delete"),function(e) {
        e.addEventListener("submit", function(evt) {
            var self          = $(this);
            var URL           = self.attr("data-target");
            var XURL          = self.attr("action");
            var DATA          = $(this).serialize();
            
            if(confirm("Apakah anda ingin menghapus data yang sudah anda pilih ? ")) {
                $.ajax({
                    headers    : { 'X-Content-Only' : 'true' },
                    type       : "POST",
                    url        : XURL,
                    data       : DATA + "&token=310142ae8c103aba8d24a0b366451222",
                    cache      : false,
                    beforeSend : function() {
                                    $("#ajax-modal").html("<b>Menghapus..</b>").show();
                                 }
                }).done(function(content) {
                    $("#ajax-modal").fadeOut();
                    $("#ajax-modal").empty();
                    $("#ajax-modal").append(content).fadeIn(100);

                    setTimeout(function() {
                        $("#ajax-modal").fadeOut(1000);
                    },1500);

                    setTimeout(function() {
                        $.ajax({
                            headers    : { 'X-Content-Only' : 'true' },
                            type       : "GET",
                            url        : URL,
                            data       : "token=310142ae8c103aba8d24a0b366451222&search",
                            cache      : false
                        }).done(function(content) {
                            $("#ent-content").empty();
                            $("#ent-content").append(content);
                        });
                    },2000);
                });
            }
            
            history.pushState(null, null, URL);
            evt.preventDefault(); 
            
            return false;
        });
    });
    
    /*
     * Search Function
     */
    [].forEach.call(document.querySelectorAll(".search-btn"),function(e) {
        e.addEventListener("click", function() {
            var QR    = $(".search").val();
            var TURL  = $('.search').attr("src");
            
            get_data_ajax(TURL, QR);
            $('.search').attr({value: QR});
            $('.search').focus();
        });
    });
    
    /*
     * Pagination Function
     */
    [].forEach.call(document.querySelectorAll(".pagination li a"),function(e) {
        e.addEventListener("click", function(evt) {
            var self          = $(this);
            var URL           = self.attr("href");
            var title         = this.textContent;
            
            get_data_ajax(URL,null);
            history.pushState(null, title, URL);
            evt.preventDefault(); 
        });
    });
    
    [].forEach.call(document.querySelectorAll(".pagination li a.active"),function(e) {
        e.addEventListener("click", function(evt) {
            $("#ajax-modal").hide();
            evt.preventDefault(); 
        });
    });
    
    /*
     * Action Function Link
     */
    [].forEach.call(document.querySelectorAll(".action-form"),function(e) {
        e.addEventListener("click", function(evt) {
            var self          = $(this);
            var URL           = self.attr("href");
            var XURL          = self.attr("media");
            var title         = this.textContent;
            
            $.ajax({
                headers    : { 'X-Content-Only' : 'true' },
                type       : "POST",
                url        : URL,
                data       : "&token=310142ae8c103aba8d24a0b366451222",
                cache      : false,
                beforeSend : function() {
                                $("#ajax-modal").html("<b>Loading..</b>").show();
                             }
            }).done(function(content) {
                $("#ajax-modal").fadeOut();
                $("#ajax-modal").empty();
                $("#ajax-modal").append(content).fadeIn(100);

                setTimeout(function() {
                    $("#ajax-modal").fadeOut(1000);
                },1500);
                
                setTimeout(function() {
                    $.ajax({
                        headers    : { 'X-Content-Only' : 'true' },
                        type       : "GET",
                        url        : XURL,
                        data       : "token=310142ae8c103aba8d24a0b366451222&search",
                        cache      : false
                    }).done(function(content) {
                        $("#ent-content").empty();
                        $("#ent-content").append(content);
                    });
                },2000);
            });
            
            history.pushState(null, title, XURL);
            evt.preventDefault(); 
            
            return false;
        });
    });
    
    /*
     * Function Ajax
     */
    var get_data_ajax = function(URL , QR) {
        var search  = false;
        var curr_qr = "";
        
        if(QR !== null) {
            search  = true;
            curr_qr = QR;
        }
        
        $.ajax({
            headers    : { 'X-Content-Only' : 'true' },
            type       : "GET",
            url        : URL,
            data       : "token=310142ae8c103aba8d24a0b366451222&search=" + search + "&q=" + curr_qr,
            cache      : false,
            beforeSend : function() {
                            $("#ajax-modal").html("<b>Loading..</b>").show();
                         }
        }).done(function(content) {
            $("#ent-content").empty();
            $("#ent-content").append(content);
            $("#ajax-modal").fadeOut(100);
        });
    };    
    
});

function checked_role(target) {
    var jumKomponen = document.formview.length;
        
    if (document.formview[target].checked === true)
    {
       for (i=1; i<=jumKomponen; i++)
       {
            if (document.formview[i].type === "checkbox") 
                document.formview[i].checked = true;
       }
    }
    else if (document.formview[target].checked === false)
   {
        for (i=1; i<=jumKomponen; i++)
        {
            if (document.formview[i].type === "checkbox") 
                document.formview[i].checked = false;
        } 
   }
}
