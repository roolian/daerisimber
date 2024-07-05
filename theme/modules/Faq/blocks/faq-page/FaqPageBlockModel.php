<?php

use Timber\Timber;
use Daerisimber\Plugins\ACF\BlockModel;
use Daeristwo\Modules\Faq\Utils\YoastFaqGraphPiece;

class FaqPageBlockModel extends BlockModel
{

    public function __construct() {
        //Si yoast SEO est activé
        if (function_exists('yoast_breadcrumb')) {
            add_filter('wpseo_schema_graph_pieces', [$this, 'yoast_add_faq_schema_pieces'], 11, 2);
        }
        
    }
    public function before_render() : void
    {
        $faqList = [];

        $categories = Timber::get_terms([
            'taxonomy' => 'categorie_question',
        ]);

        foreach ($categories as $cat) {
            $faqList[$cat->slug] = [
                'label' => $cat->name,
                'slug' => $cat->slug,
                'image' => $cat->meta('image'),
                'posts' => Timber::get_posts([
                    'post_type' => 'question',
                    'post_status' => 'publish',
                    'orderby' => 'menu_order',
                    'order' => 'ASC',
                    'tax_query' => [
                        [
                            'taxonomy' => 'categorie_question',
                            'field' => 'slug',
                            'terms' => $cat->slug,
                        ],
                    ],
                ]),
            ];
        }

        $this->timber_context['faq_list'] =  $faqList;
        
    }

    /**
     * If this fires, we know there's an FAQ block on the page, so filter the page type.
     *
     * @param [type] $blocks
     * @param mixed $pieces
     * @param mixed $context
     */
    public function yoast_add_faq_schema_pieces($pieces, $context)
    {
        $pieces[] = new YoastFaqGraphPiece($context);

        return $pieces;
    }
}
