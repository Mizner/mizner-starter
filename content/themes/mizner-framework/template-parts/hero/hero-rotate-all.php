<?php if ( have_rows( 'hero_slider' ) ): ?>
	<?php
	$speed           = get_field( 'hero_images_speed' );
	$slider_settings = [
		'autoPlay'   => $speed,
		'wrapAround' => true,
	];
	?>
    <div class="hero-slider">
        <div class="carousel js-flickity"
             data-flickity='<?php esc_attr_e( json_encode( $slider_settings ) ); ?>'>
			<?php while ( have_rows( 'hero_slider' ) ) : the_row(); ?>
                <div class="carousel-cell">
					<?php
					$image       = get_sub_field( 'hero_slider_image' );
					$image_url   = ( $image == null ? 'https://placehold.it/1920x700' : $image['url'] ); // If there's no image, use placeholder image
					$image_alt   = ( $image == null ? 'Placeholder' : $image['alt'] ); // and placeholder text
					$title       = get_sub_field( 'hero_slider_title' );
					$subtitle    = get_sub_field( 'hero_slider_subtitle' );
					$button_text = get_sub_field( 'hero_slider_button_text' );
					$button_text = ( $button_text == '' ? 'Click Here' : $button_text ); // Backup for no text
					$button_link = get_sub_field( 'hero_slider_button_link' );
					?>
                    <div class="object-fit-fix">
                        <img src="<?php echo esc_url( $image_url ); ?>" alt="<?php esc_attr( $image_alt ); ?>">
                    </div>
                    <article>
                        <h1><?php _e( $title ); ?></h1>
						<?php _e( $subtitle ); ?>
                        <a href="<?php _e( $button_link ); ?>">
                            <button class="button"><?php _e( $button_text ); ?></button>
                        </a>
                    </article>
                </div>
			<?php endwhile; ?>
        </div>
    </div>
<?php else: ?>
	<?php get_template_part( 'components/hero/hero-static-image' ); ?>
<?php endif; ?>
