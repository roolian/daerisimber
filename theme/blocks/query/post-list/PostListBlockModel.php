<?php

use Timber\Timber;
use Daerisimber\Services\Plugins\ACF\BlockModel;

class PostListBlockModel extends BlockModel
{
    public function before_render() : void
    {
        $posts = Timber::get_posts([
            'post_type' => $this->fields['post_type'],
            'posts_per_page' => $this->fields['posts_per_page'],
            'paged' =>  get_query_var( 'paged' )  ? get_query_var( 'paged' ) : 1,
            'post_status' => 'publish',
            'orderby' => 'rand',
            //'limit' => 1,
        ]);

        $this->timber_context['posts'] =  $posts;
        
    }
}
