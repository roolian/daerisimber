<?php

use Timber\Timber;
use Daerisimber\Services\Plugins\ACF\BlockModel;
use Theme\Modules\Faq\Utils\YoastFaqGraphPiece;

class FaqPageBlockModel extends BlockModel
{
    public function __construct()
    {
    }
    public function before_render(): void
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
}
