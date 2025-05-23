<?php
/**
 * Metabox customer template
 *
 * @package Reepay\Checkout
 *
 * @var array $args arguments sent to template.
 */

defined( 'ABSPATH' ) || exit;
?>
<ul class="order_action">
	<li class="reepay-admin-section-li-header-small">
		<?php _e( 'Handle', 'reepay-checkout-gateway' ); ?>
	</li>
	<li class="reepay-admin-section-li-small">
		<?php echo $args['handle']; ?>
	</li>
	<li class="reepay-admin-section-li-header-small">
		<?php _e( 'Email', 'reepay-checkout-gateway' ); ?>
	</li>
	<li class="reepay-admin-section-li-small">
		<?php echo $args['email']; ?>
	</li>
	<li class="reepay-admin-section-li">
		<a class="button" href="<?php echo $args['link']; ?>" target="_blank">
			<?php _e( 'See customer', 'reepay-checkout-gateway' ); ?>
		</a>
	</li>
</ul>
