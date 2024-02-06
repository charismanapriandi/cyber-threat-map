/* 
 * config file to ajax framework
 * ina development
 * 2014
 */

$(function() {
    var URL_BASE = "localhost";
    var URL_PATH = "vms/";
    
    if (!(window.history && history.pushState)) {
        $(".history-message").fadeIn();
    }

    [].forEach.call(document.querySelectorAll("li.child a"),function(e) {
        e.addEventListener("click", function(evt) {
            var self          = $(this);
            var URL           = self.attr("href");
            var CURR_URL      = URL.replace(URL_BASE+URL_PATH,"");
            var title         = this.textContent;
            
            /**
             * Clear ajax timeout loop.
             */
            clearTimeout(timer);
            
            get_data_ajax(URL);
            history.pushState(null, title, CURR_URL);
            evt.preventDefault(); 
        });
    });
    
    var get_data_ajax = function(URL) {
        $.ajax({
            headers    : { 'X-Content-Only' : 'true' },
            type       : "GET",
            url        : URL,
            data       : "token=310142ae8c103aba8d24a0b366451222",
            cache      : false,
            beforeSend : function() {
                            $("#ajax-modal").html("<b>Loading..</b>").show();
                         }
        }).done(function(content) {
            $("#ent-content").empty();
            $("#ent-content").append(content);
            $("#ajax-modal").fadeOut(100);
        }).fail(function() {
            $("#ajax-modal").html("<b>Error!</b> Page request not found.").show();
            
            setTimeout(function() {
                    $("#ajax-modal").fadeOut(1000);
            },1500);
        });
    };  
    
});
