<?php

use Timber\Timber;

/**
 * The main template file
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package WordPress
 * @subpackage Timberland
 * @since Timberland 2.0.1
 */

 
global $wp_query;

$context   = Timber::context();
$templates = ['index.twig'] ;
if (post_password_required()) {
    $templates = ['single-password.twig'];
} else {
    if (is_singular()) {
        $timber_post     = Timber::get_post();
        $context['post'] = $timber_post;

        if (is_single()) {
            array_unshift($templates, 'single-' . $timber_post->ID . '.twig', 'single-' . $timber_post->post_type . '.twig', 'single-' . $timber_post->slug . '.twig', 'single.twig');
        }
        if(is_page()) {
            array_unshift($templates, 'page-' . $timber_post->post_name . '.twig', 'page.twig');
        }
    }
    if (is_home()) {
        array_unshift($templates, 'front-page.twig', 'home.twig');
    }
    if (is_archive()) {
        array_unshift($templates, 'archive.twig');
        $context['title'] = 'Archive';
        $context['posts'] = Timber::get_posts();
        if (is_day()) {
            $context['title'] = 'Archive: ' . get_the_date('D M Y');
        } elseif (is_month()) {
            $context['title'] = 'Archive: ' . get_the_date('M Y');
        } elseif (is_year()) {
            $context['title'] = 'Archive: ' . get_the_date('Y');
        } elseif (is_tag()) {
            $context['title'] = single_tag_title('', false);
        } elseif (is_author()) {
            if ( isset( $wp_query->query_vars['author'] ) ) {
                $author            = Timber::get_user( $wp_query->query_vars['author'] );
                $context['author'] = $author;
                $context['title']  = 'Author Archives: ' . $author->name();
            }
        } elseif (is_category()) {
            $context['title'] = single_cat_title('', false);
            array_unshift($templates, 'archive-' . get_query_var('cat') . '.twig');
        } elseif (is_post_type_archive()) {
            $context['title'] = post_type_archive_title('', false);
            array_unshift($templates, 'archive-' . get_post_type() . '.twig');
        }
    }
    if (is_search()) {
        $context['title'] = 'Search results for ' . get_search_query();
        $context['posts'] = Timber::get_posts();
        array_unshift($templates, 'search.twig');
    }
    if (is_404()) {
        array_unshift($templates, '404.twig');
    }
}

Timber::render($templates, $context);
