jQuery(document).ready(function ($) {
    $(document).on('click', '#reepay_capture', function (e) {
        e.preventDefault();
        var nonce = $(this).data('nonce');
        var order_id = $(this).data('order-id');
        var self = $(this);

        $.ajax({
            url: Reepay_Admin.ajax_url,
            type: 'POST',
            data: {
                action: 'reepay_capture',
                nonce: nonce,
                order_id: order_id
            },
            beforeSend: function () {
                self.data('text', self.html());
                self.html(Reepay_Admin.text_wait);
                self.prop('disabled', true);
            },
            success: function (response) {
                self.html(self.data('text'));
                self.prop('disabled', false);
                if (!response.success) {
                    return false;
                }

                window.location.href = location.href;
            }
        });
    });

    $(document).on('click', '#reepay_cancel', function (e) {
        e.preventDefault();
        var nonce = $(this).data('nonce');
        var order_id = $(this).data('order-id');
        var self = $(this);
        $.ajax({
            url: Reepay_Admin.ajax_url,
            type: 'POST',
            data: {
                action: 'reepay_cancel',
                nonce: nonce,
                order_id: order_id
            },
            beforeSend: function () {
                self.data('text', self.html());
                self.html(Reepay_Admin.text_wait);
                self.prop('disabled', true);
            },
            success: function (response) {
                self.html(self.data('text'));
                self.prop('disabled', false);
                /*
                if (!response.success) {
                    alert(response.data);
                    return false;
                }
                */
                window.location.href = location.href;
            }
        });
    });

    $(document).on('click', '#reepay_refund', function (e) {
        e.preventDefault();
        var nonce = $(this).data('nonce');
        var order_id = $(this).data('order-id');
        var amount = $(this).data('amount');
        var self = $(this);
        $.ajax({
            url: Reepay_Admin.ajax_url,
            type: 'POST',
            data: {
                action: 'reepay_refund',
                nonce: nonce,
                order_id: order_id,
                amount: amount
            },
            beforeSend: function () {
                self.data('text', self.html());
                self.html(Reepay_Admin.text_wait);
                self.prop('disabled', true);
            },
            success: function (response) {
                self.html(self.data('text'));
                self.prop('disabled', false);
                if (!response.success) {
                    alert(response.data);
                    return false;
                }

                window.location.href = location.href;
            },
            error: function (response) {
                alert(response);
            }
        });
    });

    $(document).on('click', '#reepay_capture_partly', function (e) {
        e.preventDefault();
        var nonce = $(this).data('nonce');
        var order_id = $(this).data('order-id');
        var amount = $("#reepay-capture_partly_amount-field").val();
        var self = $(this);

        $.ajax({
            url: Reepay_Admin.ajax_url,
            type: 'POST',
            data: {
                action: 'reepay_capture_partly',
                nonce: nonce,
                order_id: order_id,
                amount: amount
            },
            beforeSend: function () {
                self.data('text', self.html());
                self.html(Reepay_Admin.text_wait);
                self.prop('disabled', true);
            },
            success: function (response) {
                self.html(self.data('text'));
                self.prop('disabled', false);
                if (!response.success) {
                    alert(response.data);
                    return false;
                }
                window.location.href = location.href;
            },
            error: function (response) {
                alert("error response: " + JSON.stringify(response));
            }
        });
    });

    $(document).on('click', '#reepay_refund_partly', function (e) {
        console.log('refund_partually');
        e.preventDefault();
        var nonce = $(this).data('nonce');
        var order_id = $(this).data('order-id');
        var amount = $("#reepay-refund_partly_amount-field").val();
        var self = $(this);

        $.ajax({
            url: Reepay_Admin.ajax_url,
            type: 'POST',
            data: {
                action: 'reepay_refund_partly',
                nonce: nonce,
                order_id: order_id,
                amount: amount
            },
            beforeSend: function () {
                self.data('text', self.html());
                self.html(Reepay_Admin.text_wait);
                self.prop('disabled', true);
            },
            success: function (response) {
                self.html(self.data('text'));
                self.prop('disabled', false);
                if (!response.success) {
                    alert(response.data);
                    return false;
                }
                window.location.href = location.href;
            },
            error: function (response) {
                alert("error response: " + JSON.stringify(response));
            }
        });
    });

    $(document).on('click', '#woocommerce-order-actions .button', function (e) {
        const orderId = $("#reepay_order_id").data('order-id')
        const amount = $('#reepay_order_total').data('order-total')
        const authorized = $('#reepay_order_total_authorized').val()
        const $inputSettled = $('#reepay_order_total_settled')
        const settled = $inputSettled.val()
        const initialSettled = $inputSettled.data('initial-amount')
        const currency = $('#reepay_currency').val()
        const formatted_amount = parseFloat(amount) - parseFloat(initialSettled)
        let $form = $('#post')
        if ($form.length === 0) {
            $form = $('#order')
        }
        if (amount > 0 && settled < authorized && $("#order_status option:selected").val() === 'wc-completed') {
            e.preventDefault();
            const settle = window.confirm(`'You are about to change the order status. Do you want to capture the remaining amount of ${formatted_amount} ${currency} at the same time? Click OK to continue with settle. Click Cancel to continue without settle.'`)

            $.ajax({
                url: Reepay_Admin.ajax_url,
                type: 'POST',
                data: {
                    action: 'reepay_set_complete_settle_transient',
                    nonce: Reepay_Admin.nonce,
                    order_id: orderId,
                    settle_order: Number(settle)
                },
                beforeSend: function () {
                },
                success: function () {
                },
                error: function (response) {
                    alert("error response: " + JSON.stringify(response))
                },
                complete: function () {
                    $form.submit()
                }
            })

        } else {
            $form.submit()
        }
    })

    $('#reepay-capture_partly_amount-field, #reepay-refund_partly_amount-field').inputmask({
        alias: "currency",
        groupSeparator: ''
    })
    
    $(document).on('click', '#reepay-capture-amount-button', function (e) {
        e.preventDefault();

        let $form = $('#post')
        if ($form.length === 0) {
            $form = $('#order')
        }
        const capture_amount = $('#reepay-capture-amount-input').val()
        const amount = $('#reepay_order_total').data('order-total')
        const $inputSettled = $('#reepay_order_total_settled')
        const initialSettled = $inputSettled.data('initial-amount')
        const currency = $('#reepay_currency').val()
        const formatted_amount = Number((parseFloat(amount) - parseFloat(initialSettled)).toFixed(2))

        if (capture_amount > formatted_amount) {
            alert(`'The capture amount must be less than or equal to ${formatted_amount} ${currency}'`)
            return
        }

        const settle = window.confirm(`'Do you want to capture the amount ${capture_amount} ${currency}? Click OK to continue with settle. Click Cancel to continue without settle.'`)

        if (settle) {
            const $button = $(this);

            $form.one('submit', function() {
                const buttonName = $button.attr('name')
                const buttonValue = $button.val()
                
                if (buttonName && buttonValue) {
                    $('<input>').attr({
                        type: 'hidden',
                        name: buttonName,
                        value: buttonValue
                    }).appendTo(this);
                }
            });
            
            $form.submit()
        }
    });
    
})