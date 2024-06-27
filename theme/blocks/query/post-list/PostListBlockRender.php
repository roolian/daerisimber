<?php

use Timber\Timber;
use Daerisimber\Blocks\BlockRender;

class PostListBlockRender extends BlockRender 
{
    public function custom_construct() : void
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
