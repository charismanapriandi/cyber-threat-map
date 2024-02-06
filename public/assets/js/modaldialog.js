// =============
/*
		Copyright Konglie
		lee@konglie.web.id

		But, you are free to use, and/or modify or even do whatever you like with these codes.
		*/
function maxZ()
{
    var m = [0];
    $('body > *').each(function(){
        if(/position|fixed/.test($(this).css('position')))
        {
            var z = parseInt($(this).css('z-index'));
            if(isNaN(z)) z = 0
            m.push(z);
        }
    });

    return Math.max.apply(null, m);
}

$.fn.modal.Constructor.prototype.enforceFocus = function () {};
function showModal(title, comp, buttons)
{
    var d = $('<div>').addClass('modal hide fade').appendTo('body');
    var head = $('<div>').addClass('modal-header').appendTo(d);
    $('<button>').addClass('close')
    .attr('data-dismiss', 'modal').attr('aria-hidden', true).text('x').appendTo(head);
    $('<h3>').appendTo(head).text(title);

    var body = $('<div>').addClass('modal-body').appendTo(d);

    if(! comp.jquery)
    {
        $(body).html( comp );
    }
    else
    {
        $(comp).data('pre-parent', $(comp).parents().get(0));
        $(comp).appendTo(body).show();
    }

    var footer = $('<div>').addClass('modal-footer').appendTo(d);
    if($.isPlainObject(buttons))
        buttons = [ buttons ];

    if($.isArray(buttons) && buttons.length > 0)
    {
        for(var i in buttons)
        {
            var button = buttons[ i ];
            var btn = $('<button>').appendTo(footer).text(button.text);
            if(typeof button.cls != 'undefined')
                $(btn).addClass('btn ' + button.cls);
            else
                $(btn).addClass('btn btn-primary');

            if($.isFunction(button.fx))
            {
                $(btn)
                .data('fx', button.fx)
                .click(function(e){
                    $(this).data('fx')( $(this).parents('.modal') );
                    return false;
                });
            }
        }
    }

    $(d)
    .on('hidden', function(){
        if(comp.jquery)
        {
            $(comp).appendTo(
                $( $(comp).data('pre-parent') )
            )
            .hide();
        }
        $(this).remove();
    })
    .modal();

    var z = maxZ();
    $('.modal-backdrop:last').css({
        zIndex: ++z
    });

    $(d).css('z-index', ++z);

    return d;
}

window.xalert = function(str, fx){
    showModal('Alert', str, {
        text: 'Okay',
        fx: function(modal){
            if($.isFunction(fx))
                fx();

            $(modal).modal('hide');
        }
    })
}

window.xconfirm = function(str, okFx, cancelFx){
    showModal('Please confirm', str, [
        {
            text: 'Okay',
            fx: function(modal){
                if($.isFunction(okFx))
                    okFx();

                $(modal).modal('hide');
            }
        },
        {
            text: 'Cancel',
            cls: 'btn-danger',
            fx: function(modal){
                if($.isFunction(cancelFx))
                    cancelFx();

                $(modal).modal('hide');
            }
        }
    ])
}

window.xprompt = function(msg, fx)
{
    var box = $('<textarea>').css('width', '514px');
    showModal(msg, box, [
        {
            text: 'Okay',
            fx: function(modal){
                if($.isFunction(fx))
                    fx($(box).val());

                $(modal).modal('hide');
            }
        },
        {
            text: 'Cancel',
            cls: 'btn-danger',
            fx: function(modal){
                $(modal).modal('hide');
            }
        }
    ])
}

//==============    */


$('#alertBtn').click(function(){
    xalert('hello world');
});

$('#chainedBtn').click(function(){
    var depth = 1;
    var chain = function(){
        return $('<div>')
        .html('depth: ' + depth++ + '<br/>')
        .append(
            $('<button>')
            .addClass('btn btn-primary')
            .text('click me').click(function(){
                xalert( chain() , function(){
                    depth--;
                })
            })
        );
    };
    xalert( chain() );
});

$('#confirmBtn').click(function(){
    xconfirm('Shall we?', function(){
        xalert('you said, OK');
    });
});

$('#promptBtn').click(function(){
    xprompt('tell me something', function(str){
        xalert('you told me: ' + str);
    })
});

$('#formBtn').click(function(){
    $('#inputEmail').val('');
    $('#inputPassword').val('');
    showModal('Login Form', $('#pageForm'), [
        {
            text: 'Submit',
            fx: function(m){
                var input = {
                    'email': $('#inputEmail').val(),
                    'password': $('#inputPassword').val()
                };
                if( input.email == '' || input.password == '')
                {
                    xalert('all fields are required');
                    return;
                }

                $(m).modal( 'hide' );
                xalert('now submit form to your handler');
            }
        },
        {
            text: 'Cancel',
            cls: 'btn-danger',
            fx: function(m){
                $(m).modal('hide');
            }
        }
    ])
});
